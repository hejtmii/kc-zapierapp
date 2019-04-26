const getContentTypeElements = require('../elements/getContentTypeElements');
const getOperatorChoices = require('./getOperatorChoices');
const { ElementsPrefix, SystemPrefix } = require ('../constants');

const searchInfo = {
    label: 'Search info',
    key: 'search_info',
    helpText: `### Search by field
    
You can search the item by a particular field value.`,
    type: 'copy',
};

async function getSearchField(z, bundle, contentType) {
    const elements = await getContentTypeElements(z, bundle, contentType);
    const choices = [
        { value: 'id', label: 'Item ID' },
        { value: 'external_id', label: 'External ID' },
        { value: `${SystemPrefix}codename`, label: 'Code name' }
    ];

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        switch (element.type) {
            case 'text':
            case 'custom':
            case 'url_slug':

            case 'multiple_choice':
            case 'modular_content':
            case 'taxonomy':

            case 'number':
                choices.push({ value: `${ElementsPrefix}${element.codename}`, label: element.name });
        }
    }

    return [{
        label: 'Search field',
        key: 'search_field',
        helpText: 'Select the field based on which the item should be found.',
        required: true,
        choices,
        altersDynamicFields: true,
    }];
}

const searchField = async function (z, bundle) {
    return await getSearchField(z, bundle, bundle.inputData.content_type);
};

async function getSearchOperator(z, bundle, contentType, searchField) {
    const choices = await getOperatorChoices(z, bundle, contentType, searchField);

    return [{
        label: 'Search operator',
        key: 'search_pattern',
        helpText: 'Select how the search value should be matched.',
        required: true,
        choices,
        default: choices[0].value,
        altersDynamicFields: true,
    }];
}

const searchOperator = async function (z, bundle) {
    return await getSearchOperator(z, bundle, bundle.inputData.content_type, bundle.inputData.search_field);
};

const searchValue = {
    label: "Search value",
    key: "search_value",
    helpText: "Value to match in the search field. The value must match exactly.",
    type: "string",
    required: true,
    altersDynamicFields: false
};

module.exports = [searchInfo, searchField, searchOperator, searchValue];
