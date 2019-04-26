const endpointField = require('../fields/endpoint');
const getLanguageField = require('../fields/getLanguageField');
const getContentTypeField = require('../fields/getContentTypeField');
const getElementOutputFields = require('../fields/elements/getElementOutputFields');
const itemFilterFields = require('../fields/filters/itemFilterFields');
const itemDetectFields = require('../fields/filters/itemDetectFields');
const getContentItems = require('../utils/getContentItems');
const standardizedSystemOutputFields = require('../utils/standardized/standardizedSystemOutputFields');

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

    // Value may be structured (e.g. array, so we convert it to JSON to be able to hash it)
    return JSON.stringify(value);
}

async function execute(z, bundle) {
    const endpoint = bundle.inputData.endpoint;
    const projectId = bundle.authData.project_id;

    const language = bundle.inputData.language;
    const contentType = bundle.inputData.content_type;

    const filterField = bundle.inputData.filter_field;
    const filterPattern = bundle.inputData.filter_pattern;
    const filterValue = bundle.inputData.filter_value;

    const detectField = bundle.inputData.detect_field;

    const results = await getContentItems(z, bundle, endpoint, language, contentType, filterField, filterPattern, filterValue);

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
    noun: 'Content item',
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
            getLanguageField(),
            getContentTypeField({ altersDynamicFields: true }),
            ...itemFilterFields,
            ...itemDetectFields,
        ],
        perform: execute,
        sample: {
            'elements': {},
            'system': {
                'projectId': '471f9f4c-4f97-009b-a0b8-79db2558e63f',
                'name': 'On Roasts',
                'language': 'en-US',
                'last_modified': '2019-03-15T13:45:27.0956286Z',
                'codename': 'on_roasts',
                'type': 'article',
                'id': '2d42e460-1fb7-4bcc-9514-23a462e370db',
                'full_id': '2d42e460-1fb7-4bcc-9514-23a462e370db/en-US',
            },
            id: '77963b7a931377ad4ab5ad6a9cd718aa',
        },
        outputFields: [
            ...standardizedSystemOutputFields,
            async function (z, bundle) {
                return await getElementOutputFields(z, bundle, bundle.inputData.content_type);
            }
        ]
    }
};
