const getContentTypeElements = require('../elements/getContentTypeElements');
const { ElementsPrefix, SystemPrefix } = require ('../constants');

const detectInfo = {
    label: 'Detect info',
    key: 'detect_info',
    helpText: `## Changes to detect

You can optionally detect only changes to a particular field by selecting the field below.`,
    type: 'copy',
};

async function getDetectField(z, bundle, contentType) {
    const elements = await getContentTypeElements(z, bundle, contentType);
    const choices = [
        { value: `${SystemPrefix}name`, label: 'Item name' },
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
            case 'asset':

            case 'rich_text':
            case 'date_time':

            case 'number':
                choices.push({ value: `${ElementsPrefix}${element.codename}`, label: element.name });
        }
    }

    return [{
        label: 'Detect changes of field',
        key: 'detect_field',
        helpText: 'Select a field that should be observed for changes. If none is selected, any change will be detected.',
        type: 'string',
        required: false,
        choices,
    }];
}

const detectField = async function (z, bundle) {
    return await getDetectField(z, bundle, bundle.inputData.content_type);
};

module.exports = [detectInfo, detectField];
