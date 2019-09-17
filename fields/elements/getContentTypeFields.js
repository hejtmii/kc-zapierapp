const getContentTypeElements = require('./getContentTypeElements');
const getElementFieldProps = require('./getElementFieldProps');

async function getContentTypeFields(z, bundle, contentTypeId) {

    function getField(element, extraProps) {
        const baseProps = {
            key: `elements__${element.codename}`,
            label: element.name,
            helpText: element.guidelines,
            required: element.is_required,
        };
        const typeProps = getElementFieldProps(element);

        return Object.assign(baseProps, typeProps, extraProps || {});
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

    const elements = await getContentTypeElements(z, bundle, contentTypeId);
    const fields = elements.map(getSimpleElementField);

    return fields;
}

module.exports = getContentTypeFields;
