const getContentTypeElements = require('./getContentTypeElements');
const getElementFieldType = require('./getElementFieldType');

async function getContentTypeFields(z, bundle, contentType) {

    function getField(element, extra) {
        const base = {
            key: `elements__${element.codename}`,
            label: element.name,
            helpText: element.guidelines,
            type: getElementFieldType(element.type),
        };

        return Object.assign(base, extra || {});
    }

    function getSimpleElementField(element) {
        switch (element.type) {
            case 'multiple_choice':
            case 'asset':
            case 'modular_content':
            case 'taxonomy':
                return getField(element, { list: true });

            case 'text':
            case 'rich_text':
            case 'custom':
            case 'number':
            case 'date_time':
            case 'url_slug':
            case 'guidelines':
                return getField(element);
        }
    }

    const elements = await getContentTypeElements(z, bundle, contentType);
    const fields = elements.map(getSimpleElementField);

    return fields;
}

module.exports = getContentTypeFields;
