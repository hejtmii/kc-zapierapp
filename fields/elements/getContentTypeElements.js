const handleErrors = require('../../utils/handleErrors');
const getContentType = require('../../utils/types/getContentType');

async function getContentTypeElements(z, bundle, contentTypeId) {
    if (!contentTypeId) {
        return [];
    }

    async function getElements(element) {
        if (element.type === 'snippet') {
            return await getSnippetElements(element.snippet.id, element)
        } else {
            return [element];
        }
    }

    async function getAllElements(elements, parentElement) {
        const fieldPromises = elements.map(getElements);
        const fieldElements = await Promise.all(fieldPromises);

        const allFields = [];
        for (var i = 0; i < fieldElements.length; i++) {
            const elements = fieldElements[i];
            const elementsWithParent = parentElement ?
                elements.map(element => Object.assign(
                    {},
                    element,
                    {codename: `${parentElement.codename}__${element.codename}`}
                )) :
                elements;


            allFields.push(...elementsWithParent);
        }
        return allFields;
    }

    async function getSnippetElements(snippetId, parentElement) {
        var request = {
            'method': 'GET',
            'url': `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/snippets/${snippetId}`,
            'params': {},
            'headers': {
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cmApiKey}`
            }
        };

        const response = await z.request(request);
        handleErrors(response);
        const results = z.JSON.parse(response.content);

        const allSnippetElements = await getAllElements(results.elements, parentElement);
        return allSnippetElements;
    }

    const type = await getContentType(z, bundle, contentTypeId);
    const allElements = await getAllElements(type.elements);

    return allElements;
}

module.exports = getContentTypeElements;
