const getContentTypeElements = require('./getContentTypeElements');
const getElementFieldType = require('./getElementFieldType');

async function getElementOutputFields(z, bundle, contentType) {
    if (!contentType) {
        return [];
    }

    const elements = await getContentTypeElements(z, bundle, contentType);
    const fields = elements
        .filter(element => element.type !== 'guidelines')
        .map(element => ({
            label: element.name,
            key: `elements__${element.codename}`,
            type: getElementFieldType(element.type),
        }));

    return fields;
}

module.exports = getElementOutputFields;
