const getContentTypeElements = require('../fields/getContentTypeElements');

const searchInfo = {
    "required": false,
    "label": "Search info",
    "helpText": "### Search by field\n\nYou can search the item by a particular field value.",
    "key": "search_info",
    "type": "copy",
};

async function getSearchField(z, bundle, contentTypeId) {
    const elements = await getContentTypeElements(z, bundle, contentTypeId);
    const choices = [
        { value: 'id', label: 'Item ID' },
        { value: 'external_id', label: 'External ID' },
        { value: 'codename', label: 'Code name' }
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

    return [{
        key: 'search_field',
        label: 'Search field',
        help_text: 'Select the field based on which the item should be found. Only following elements are supported: text, URL slug, custom',
        required: true,
        choices
    }];
}

const searchField = async function (z, bundle) {
    return await getSearchField(z, bundle, bundle.inputData.content_type_id);
}

const searchValue = {
    required: true,
    label: "Search value",
    helpText: "Value to match in the search field. The value must match exactly.",
    key: "search_value",
    type: "string",
    altersDynamicFields: false
};

module.exports = [searchInfo, searchField, searchValue]
