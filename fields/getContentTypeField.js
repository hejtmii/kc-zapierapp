function getContentTypeField(extras) {
    return Object.assign(
        {
            label: 'Content type',
            key: 'contentTypeId',
            type: 'string',
            dynamic: 'get_content_types.system__id.system__name',
        },
        extras || {},
    );
}

module.exports = getContentTypeField;
