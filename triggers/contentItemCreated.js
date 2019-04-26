const endpointField = require('../fields/endpoint');
const getLanguageField = require('../fields/getLanguageField');
const getContentTypeField = require('../fields/getContentTypeField');
const getElementOutputFields = require('../fields/elements/getElementOutputFields');
const itemFilterFields = require('../fields/filters/itemFilterFields');
const getContentItems = require('../utils/getContentItems');
const standardizedSystemOutputFields = require('../utils/standardized/standardizedSystemOutputFields');

async function execute(z, bundle) {
    const endpoint = bundle.inputData.endpoint;

    const language = bundle.inputData.language;
    const contentType = bundle.inputData.content_type;

    const filterField = bundle.inputData.filter_field;
    const filterPattern = bundle.inputData.filter_pattern;
    const filterValue = bundle.inputData.filter_value;

    const results = await getContentItems(z, bundle, endpoint, language, contentType, filterField, filterPattern, filterValue);

    const resultsWithId = results.map(
        (item) => Object.assign(
            item,
            {
                id: item.system.id
            }
        )
    );

    return resultsWithId;
}

module.exports = {
    key: 'create_item',
    noun: 'Content item',
    display: {
        label: 'New Content Item',
        description: 'Triggers when a new content item is created or published.',
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
            'id': '2d42e460-1fb7-4bcc-9514-23a462e370db',
        },
        outputFields: [
            ...standardizedSystemOutputFields,
            async function (z, bundle) {
                return await getElementOutputFields(z, bundle, bundle.inputData.content_type);
            }
        ]
    }
};
