const getContentTypeElements = require('./getContentTypeElements');
const getElementFieldType = require('./getElementFieldType');

async function getElementOutputFields(z, bundle, contentType) {
    if (!contentType) {
        return [];
    }

    const elements = await getContentTypeElements(z, bundle, contentType);
    const fields = elements.map(element => ({
        label: element.name,
        key: `elements__${element.codename}__value`,
        type: getElementFieldType(element.type),
    }));

    return fields;
}

module.exports = getElementOutputFields;
