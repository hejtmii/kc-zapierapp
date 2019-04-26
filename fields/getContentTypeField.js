function getContentTypeField(extras) {
    return Object.assign(
        {
            label: 'Content type',
            key: 'content_type',
            helpText: 'Select the content type which should be observed or leave blank to trigger based for any item regardless of its content type.',
            type: 'string',
            dynamic: 'get_content_types.system__codename.system__name',
        },
        extras || {},
    );
}

module.exports = getContentTypeField;
