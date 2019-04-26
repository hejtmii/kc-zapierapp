const getContentTypeElements = require('../elements/getContentTypeElements');
const { ElementsPrefix, SystemPrefix } = require ('../constants');

async function getFieldType(z, bundle, contentType, field) {
    if (field.indexOf(ElementsPrefix) === 0) {
        const elementCodeName = field.substr(ElementsPrefix.length);
        const elements = await getContentTypeElements(z, bundle, contentType);

        const element = elements.filter(e => e.codename === elementCodeName)[0];
        if (element) {
            return element.type;
        }
    }

    if (field.indexOf(SystemPrefix) === 0) {
        return 'text';
    }

    return 'id';
}

module.exports = getFieldType;
