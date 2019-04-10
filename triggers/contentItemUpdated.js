const endpointField = require('../fields/endpoint');
const languageCodeField = require('../fields/languageCode');
const contentTypeField = require('../fields/contentType');
const getElementOutputFields = require('../fields/getElementOutputFields');
const itemFilterFields = require('../fields/itemFilterFields');
const getContentItems = require('../utils/getContentItems');

const detectInfoField = {
    label: 'Detect info',
    key: 'detect_info',
    helpText: `## Changes to detect

You can optionally detect only changes to a particular field by selecting the field below.`,
    type: 'copy',
};

const detectFieldField = {
    label: 'Detect changes of field',
    key: 'detect_field',
    helpText: 'Select a field that should be observed for changes. If none is selected, any change will be detected.',
    type: 'string',
    required: false,
    dynamic: 'get_item_filter_field_choices.value.label',
};

function getDetectionValue(item, detectField) {
    if (!detectField) {
        return item.system.last_modified;
    }
    const fieldParts = detectField.split('.');
    let value = item;

    // Get the value from object
    for (let i = 0; i < fieldParts.length; i++) {
        value = value[fieldParts[i]];
    }

    return value;
}

async function execute(z, bundle) {
    const endpoint = bundle.inputData.endpoint;
    const projectId = bundle.authData.project_id;

    const language = bundle.inputData.language;
    const contentType = bundle.inputData.content_type;

    const filterField = bundle.inputData.filter_field;
    const filterValue = bundle.inputData.filter_value;

    const detectField = bundle.inputData.detect_value;

    const results = await getContentItems(z, bundle, endpoint, language, contentType, filterField, filterValue);

    const resultsWithId = results.map(
        (item) => Object.assign(
            item,
            {
                projectId,
                id: z.hash('md5', item.system.id + getDetectionValue(item, detectField))
            }
        )
    );

    return resultsWithId;
}

module.exports = {
    key: 'update_item',
    noun: 'Updated Content item',
    display: {
        label: 'Content Item Updated',
        description: 'Triggers when a content item is created or updated.',
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
            detectInfoField,
            detectFieldField,
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
