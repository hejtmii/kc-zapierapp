const handleErrors = require('../utils/handleErrors');
const getContentTypeElements = require('../fields/elements/getContentTypeElements');

function getElementValue(value, element) {
    switch (element.type) {
        case 'rich_text':
            if (value.trim().startsWith('<')) {
                return value;
            }
            return `<p>${value}</p>`;

        case 'text':
        case 'custom':
            return value;

        case 'number':
            return value;

        case 'date_time':
            return value;

        case 'multiple_choice':
        case 'asset':
        case 'modular_content':
        case 'taxonomy':
            return value;

        case 'url_slug':
            return value;

        case 'guidelines':
            return undefined;

        default:
            throw new Error(`Unknown element type ${element.type}`);
    }
}

async function getElements(z, bundle, contentType) {
    const typeElements = await getContentTypeElements(z, bundle, contentType);
    const elements = typeElements.map((element) => {
        const value = bundle.inputData[`elements__${element.codename}`];
        if (!value) {
            return undefined;
        }
        return {
            element: {
                id: element.id
            },
            value: getElementValue(value, element)
        };
    }).filter(e => !!e);

    return elements;
}

async function createVariant(z, bundle, itemId, language, contentType) {
    const elements = await getElements(z, bundle, contentType);

    const options = {
        url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${language}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        },
        params: {},
        body: {
            elements,
        }
    };

    const variantResponse = await z.request(options);
    handleErrors(variantResponse);

    const variant = z.JSON.parse(variantResponse.content);

    return variant;
}

module.exports = createVariant;
