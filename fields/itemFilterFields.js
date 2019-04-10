const filterInfoField = {
    label: 'Filter info',
    key: 'filter_info',
    helpText: `## Filter by field

You can optionally restrict the set of triggering content items by specifying the filter below.`,
    type: 'copy',
};

const filterFieldField = {
    label: 'Filter field',
    key: 'filter_field',
    helpText: 'Select the field based on which the item should be found. Only the following elements are supported: text, URL slug, custom.',
    type: 'string',
    required: false,
    dynamic: 'get_item_filter_field_choices.value.label',
};

const filterValueField = {
    label: 'Filter value',
    key: 'filter_value',
    helpText: 'Value to match in the filter field. The value must match exactly.',
    type: 'string',
    required: false,
};

module.exports = [ filterInfoField, filterFieldField, filterValueField ];
