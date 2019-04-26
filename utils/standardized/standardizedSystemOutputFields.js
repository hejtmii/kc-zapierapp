const standardizedSystemOutputFields = [
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
        type: 'datetime',
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
        key: 'system__projectId',
        label: 'Project ID',
        type: 'string',
    },
    {
        key: 'system__full_id',
        label: 'Full item ID',
        type: 'string',
    },
];

module.exports = standardizedSystemOutputFields;
