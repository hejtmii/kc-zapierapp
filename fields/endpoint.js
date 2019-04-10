const endpointField = {
    label: 'Track items',
    key: 'endpoint',
    helpText: 'Select what kind of items should be tracked.',
    type: 'string',
    default: 'deliver.kenticocloud.com',
    required: true,
    choices: [
        {
            "sample": "deliver.kenticocloud.com",
            "value": "deliver.kenticocloud.com",
            "label": "Published Content items"
        },
        {
            "sample": "preview-deliver.kenticocloud.com",
            "value": "preview-deliver.kenticocloud.com",
            "label": "Edited Content items"
        }
    ]
};

module.exports = endpointField;
