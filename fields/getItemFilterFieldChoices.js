const contentTypeField = require('./contentType');
const getContentTypeElements = require('./getContentTypeElements');

async function execute(z, bundle) {
    async function getFilterFields(contentType) {
        const elements = await getContentTypeElements(z, bundle, contentType);
        const choices = [
            { value: 'system.name', label: 'Item name' },
            { value: 'system.codename', label: 'Item code name' }
        ];

        for (var i = 0; i < elements.length; i++) {
            const element = elements[i];
            switch (element.type) {
                case 'text':
                case 'custom':
                case 'url_slug':
                    choices.push({ value: `elements.${element.codename}`, label: element.name });
            }
        }

        return choices.map(item => ({
            id: item.value,
            value: item.value,
            label: item.label,
        }));
    }

    const contentType = bundle.inputData.content_type;
    const filterFields = await getFilterFields(contentType);

    return filterFields;
}

module.exports = {
    key: 'get_item_filter_field_choices',
    noun: 'Get Content item filter field choices',
    display: {
        label: 'Content item filter field choice',
        description: 'Gets content item filter fields for the filter field dropdown based on the given content type. Expects bundle.inputData.content_type as an input.',
        hidden: true,
    },
    operation: {
        type: 'polling',
        inputFields: [
            contentTypeField,
        ],
        perform: execute,
        sample: {
            "id": "id",
            "value": "id",
            "label": "Item ID"
        },
        outputFields: [
            {
                key: 'id',
                label: 'ID',
                type: 'string',
            },
            {
                key: 'value',
                label: 'Value',
                type: 'string',
            },
            {
                key: 'label',
                label: 'Label',
                type: 'string',
            },
        ]
    }
};
