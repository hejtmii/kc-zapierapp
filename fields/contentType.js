const ContentType = {
    label: 'Content type',
    key: 'content_type',
    helpText: 'Select the content type which should be observed or leave blank to trigger based for any item regardless of its content type.',
    type: 'string',
    altersDynamicFields: true,
    dynamic: 'get_content_type_choices.system__codename.system__name',
};

module.exports = ContentType;
