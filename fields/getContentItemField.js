function getContentItemField(extras) {
    return Object.assign(
        {
            search: "find_item.id",
            list: false,
            required: false,
            dynamic: "get_content_items.id.system__name",
            label: "Content item",
            key: "fullItemId",
            type: "string",
            altersDynamicFields: false
        },
        extras || {},
    );
}

module.exports = getContentItemField;
