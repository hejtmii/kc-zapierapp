const endpointField = require('../fields/endpoint');
const languageCodeField = require('../fields/languageCode');
const contentTypeField = require('../fields/contentType');
const getElementOutputFields = require('../fields/getElementOutputFields');
const itemFilterFields = require('../fields/itemFilterFields');
const getContentItems = require('../utils/getContentItems');

async function execute(z, bundle) {
    const endpoint = bundle.inputData.endpoint;
    const projectId = bundle.authData.project_id;

    const language = bundle.inputData.language;
    const contentType = bundle.inputData.content_type;

    const filterField = bundle.inputData.filter_field;
    const filterValue = bundle.inputData.filter_value;

    const results = await getContentItems(z, bundle, endpoint, language, contentType, filterField, filterValue);

    const resultsWithId = results.map(
        (item) => Object.assign(
            item,
            {
                projectId,
                id: item.system.id
            }
        )
    );

    return resultsWithId;
}

module.exports = {
    key: 'create_item',
    noun: 'Created Content item',
    display: {
        label: 'Content Item Created',
        description: 'Triggers when a new content item is created.',
        important: true,
        hidden: false
    },
    operation: {
        type: 'polling',
        inputFields: [
            endpointField,
            languageCodeField,
            contentTypeField,
            ...itemFilterFields,
        ],
        perform: execute,
        sample: {
            "elements": {},
            "system": {
                "name": "Article to zap through to JIRA",
                "language": "en-US",
                "sitemap_locations": [],
                "last_modified": "2019-03-15T13:45:27.0956286Z",
                "codename": "article_to_zap_through_to_jira",
                "type": "article",
                "id": "2d42e460-1fb7-4bcc-9514-23a462e370db"
            },
            "id": "2d42e460-1fb7-4bcc-9514-23a462e370db_2019-03-15T13:45:27.0956286Z"
        },
        outputFields: [
            {
                key: 'system__name',
                label: 'Item name',
                type: 'string',
            },
            {
                key: 'system__language',
                label: 'Language code',
                type: 'string',
            },
            {
                key: 'system__last_modified',
                label: 'Last modified',
                type: 'string',
            },
            {
                key: 'system__codename',
                label: 'Item codename',
                type: 'string',
            },
            {
                key: 'system__type',
                label: 'Content type codename',
                type: 'string',
            },
            {
                key: 'system__id',
                label: 'Item ID',
                type: 'string',
            },
            {
                key: 'projectId',
                label: 'Project ID',
                type: 'string',
            },
            async function (z, bundle) {
                return await getElementOutputFields(z, bundle, bundle.inputData.content_type);
            }
        ]
    }
};
