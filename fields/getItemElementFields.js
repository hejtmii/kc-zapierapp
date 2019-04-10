const getContentTypeElements = require('./getContentTypeElements');

async function getItemElementFields(z, bundle, contentType) {

    function getField(element, extra) {
        const base = {
            key: `elements__${element.codename}`,
            label: element.name,
            help_text: element.guidelines
        };

        return Object.assign(base, extra);
    }

    function getSimpleElementField(element) {
        switch (element.type) {
            case 'text':
            case 'rich_text':
            case 'custom':
                return getField(element, {type: 'text'});

            case 'number':
                return getField(element, {type: 'float'});

            case 'date_time':
                return getField(element, {type: 'datetime'});

            case 'multiple_choice':
            case 'asset':
            case 'modular_content':
            case 'taxonomy':
                return getField(element, {type: 'unicode', list: true});

            case 'url_slug':
                return getField(element, {type: 'unicode'});

            case 'guidelines':
                return getField(element, {type: 'copy'});
        }
    }

    const elements = await getContentTypeElements(z, bundle, contentType);
    const fields = elements.map(getSimpleElementField);

    return fields;
}

module.exports = getItemElementFields;
