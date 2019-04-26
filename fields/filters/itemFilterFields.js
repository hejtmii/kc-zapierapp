const getContentTypeElements = require('../elements/getContentTypeElements');
const getOperatorChoices = require('./getOperatorChoices');
const { ElementsPrefix, SystemPrefix } = require ('../constants');

const filterInfo = {
    label: 'Filter info',
    key: 'filter_info',
    helpText: `## Filter by field

You can optionally restrict the set of triggering content items by specifying the filter below.`,
    type: 'copy',
};

async function getFilterField(z, bundle, contentType) {
    const elements = await getContentTypeElements(z, bundle, contentType);
    const choices = [
        { value: `${SystemPrefix}id`, label: 'Item ID' },
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
        label: 'Filter field',
        key: 'filter_field',
        helpText: 'Select the field based on which the item should be found.',
        required: false,
        choices,
        altersDynamicFields: true,
    }];
}

const filterField = async function (z, bundle) {
    return await getFilterField(z, bundle, bundle.inputData.content_type);
};

async function getFilterOperator(z, bundle, contentType, filterField) {
    const choices = await getOperatorChoices(z, bundle, contentType, filterField);

    return [{
        label: 'Filter operator',
        key: 'filter_pattern',
        helpText: 'Select how the filter value should be matched.',
        required: true,
        choices,
        default: choices[0].value,
        altersDynamicFields: true,
    }];
}

const filterOperator = async function (z, bundle) {
    return await getFilterOperator(z, bundle, bundle.inputData.content_type, bundle.inputData.filter_field);
};

const filterValue = {
    label: 'Filter value',
    key: 'filter_value',
    helpText: 'Value to match in the filter field. The value must match exactly.',
    type: 'string',
    required: false,
};

module.exports = [filterInfo, filterField, filterOperator, filterValue];
