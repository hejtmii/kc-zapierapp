const getLanguageField = require('../fields/getLanguageField');
const getContentTypeField = require('../fields/getContentTypeField');
const itemSearchFields = require('../fields/filters/itemSearchFields');
const handleErrors = require('../utils/handleErrors');
const getContentType = require('../utils/getContentType');
const getFilterParams = require('../utils/getFilterParams');

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

    async function findByItemIdentifier(languageCode, contentType, searchField, searchValue) {
        const cmApiItemUrl = getCmApiItemUrl(searchField, searchValue);
        if (!cmApiItemUrl) {
            return null;
        }

        const contentTypeObj = contentType && await getContentType(contentType);

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
        if (contentTypeObj &&
            (!itemResults.type || (itemResults.type.id !== contentTypeObj.id))
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
        // const variantResults = z.JSON.parse(variantResponse.content);

        const results = [{
            id: `${itemId}/${languageCode}`,
            system: {
                projectId,
                id: itemId,
                name: itemResults.name,
                codename: itemResults.codename,
                full_id: `${itemId}/${languageCode}`,
            },
        }];

        return results;
    }

    async function findByElement(languageCode, contentType, searchField, searchPattern, searchValue) {
        const searchParams = getFilterParams(searchField, searchPattern, searchValue);

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
                searchParams,
                contentType && {'system.type': contentType},
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
            system: {
                projectId: bundle.authData.project_id,
                id: item.system.id,
                name: item.system.name,
                codename: item.system.codename,
                full_id: `${item.system.id}/${item.system.language}`,
            },
        }));

        return resultsWithIds;
    }

    async function findItem(languageCode, contentType, searchField, searchPattern, searchValue) {
        const foundByCmApi = await findByItemIdentifier(languageCode, contentType, searchField, searchValue);
        if (foundByCmApi) {
            return foundByCmApi;
        }

        return findByElement(languageCode, contentType, searchField, searchPattern, searchValue);
    }

    const language = bundle.inputData.language;
    const contentType = bundle.inputData.content_type;

    const searchField = bundle.inputData.search_field;
    const searchPattern = bundle.inputData.search_pattern;
    const searchValue = bundle.inputData.search_value;

    const found = await findItem(language, contentType, searchField, searchPattern, searchValue);

    return found;
}

const findContentItem = {
    noun: 'Content item',
    display: {
        hidden: false,
        important: true,
        description: 'Finds a Content item matching the provided parameters. If more items match, it returns the first found item.',
        label: 'Find Content Item'
    },
    key: 'find_item',
    operation: {
        perform: execute,
        inputFields: [
            getLanguageField({ required: true }),
            getContentTypeField({ altersDynamicFields: true }),
            ...itemSearchFields,
        ],
        sample: {
            system: {
                projectId: '471f9f4c-4f97-009b-a0b8-79db2558e63f',
                codename: 'on_roasts',
                id: 'f4b3fc05-e988-4dae-9ac1-a94aba566474',
                name: 'On Roasts',
                full_id: 'f4b3fc05-e988-4dae-9ac1-a94aba566474/en-US',
            },
            id: 'f4b3fc05-e988-4dae-9ac1-a94aba566474/en-US',
        },
        outputFields: [
            {
                key: 'system__projectId',
                label: 'Project ID',
                type: 'string',
            },
            {
                key: 'system__codename',
                label: 'Item codename',
                type: 'string',
            },
            {
                key: 'system__id',
                label: 'Item ID',
                type: 'string',
            },
            {
                key: 'system__name',
                label: 'Item name',
                type: 'string',
            },
            {
                key: 'system__full_id',
                label: 'Full item ID',
                type: 'string',
            },
        ]
    },
};

module.exports = findContentItem;
