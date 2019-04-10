const languageCodeField = require('../fields/languageCode');
const contentTypeField = require('../fields/contentType');
const itemSearchFields = require('./itemSearchFields');
const handleErrors = require('../utils/handleErrors');
const getContentType = require('../utils/getContentType');

async function execute(z, bundle) {
    function getCmApiItemUrl(searchField, searchValue) {
        if (!searchValue) {
            throw new Error(`Missing search value for ${searchField}`);
        }

        switch (searchField) {
            case 'external_id':
                return `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/external-id/${searchValue}`;

            case 'id':
                return `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${searchValue}`;

            case 'codename':
                return `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/codename/${searchValue}`;

            default:
                return null;
        }
    }

    async function findByItemIdentifier(languageCode, contentTypeId, searchField, searchValue) {
        const cmApiItemUrl = getCmApiItemUrl(searchField, searchValue);
        if (!cmApiItemUrl) {
            return null;
        }

        const itemRequest = {
            url: cmApiItemUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {}
        };

        const itemResponse = await z.request(itemRequest);
        if (itemResponse.status === 404) {
            return [];
        }

        handleErrors(itemResponse)
        const itemResults = z.JSON.parse(itemResponse.content);

        // Validate content type
        if (contentTypeId &&
            (!itemResults.type || (itemResults.type.id !== contentTypeId))
        ) {
            return [];
        }

        const itemId = itemResults.id;
        const projectId = bundle.authData.project_id;

        const variantRequest = {
            url: `https://manage.kenticocloud.com/v2/projects/${projectId}/items/${itemId}/variants/codename/${languageCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {}
        };

        const variantResponse = await z.request(variantRequest);
        if (variantResponse.status === 404) {
            return [];
        }

        handleErrors(variantResponse);
        const variantResults = z.JSON.parse(variantResponse.content);

        const results = [{
            projectId,
            id: `${itemId}/${languageCode}`,
            item: {
                id: itemId,
                name: itemResults.name,
                codename: itemResults.codename,
            },
        }];

        return results;
    }

    async function findByElement(languageCode, contentTypeId, searchField, searchValue) {
        const contentType = contentTypeId && await getContentType(contentTypeId);
        const searchParam = {};

        searchParam[searchField] = searchValue;

        const options = {
            url: `https://preview-deliver.kenticocloud.com/${bundle.authData.project_id}/items`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.preview_api_key}`
            },
            params: Object.assign(
                {
                    // Only first, no modulars
                    'limit': 1,
                    'depth': 0
                },
                searchParam,
                contentType && {'system.type': contentType.codename},
                languageCode && {'language': languageCode},
                // No language fallbacks
                languageCode && {'system.language': languageCode}
            )
        };

        const response = await z.request(options);
        if (response.status === 404) {
            return [];
        }

        handleErrors(response);

        const results = z.JSON.parse(response.content).items;
        const resultsWithIds = results.map(item => ({
            id: `${item.system.id}/${item.system.language}`,
            item: {
                id: item.system.id,
                name: item.system.name,
                codename: item.system.codename,
            },
        }));

        return resultsWithIds;
    }

    async function findItem(languageCode, contentTypeId, searchField, searchValue) {
        const foundByCmApi = await findByItemIdentifier(languageCode, contentTypeId, searchField, searchValue);
        if (foundByCmApi) {
            return foundByCmApi;
        }

        return findByElement(languageCode, contentTypeId, searchField, searchValue);
    }

    const language = bundle.inputData.language;
    const contentTypeId = bundle.inputData.content_type_id;

    const searchField = bundle.inputData.search_field;
    const searchValue = bundle.inputData.search_value;

    const found = await findItem(language, contentTypeId, searchField, searchValue);

    return found;
}

const findContentItem = {
    noun: "Content item",
    display: {
        hidden: false,
        important: true,
        description: "Finds a Content item matching the provided parameters. If more items match, it returns the first found item.",
        label: "Find Content Item"
    },
    key: "find_item",
    operation: {
        perform: execute,
        inputFields: [
            languageCodeField,
            contentTypeField,
            ...itemSearchFields,
        ],
        sample: {
            item: {
                codename: "on_roasts",
                id: "f4b3fc05-e988-4dae-9ac1-a94aba566474",
                name: "On Roasts"
            },
            id: "f4b3fc05-e988-4dae-9ac1-a94aba566474/en-US",
        },
        outputFields: [
            {
                key: "item__codename",
                label: "Code name",
                type: "string",
            },
            {
                key: "item__id",
                label: "Item ID",
                type: "string",
            },
            {
                key: "item__name",
                label: "Name",
                type: "string",
            },
            {
                key: "id",
                label: "Compound item ID",
                type: "string",
            },
            {
                key: 'projectId',
                label: 'Project ID',
                type: 'string',
            },
        ]
    },
};

module.exports = findContentItem;
