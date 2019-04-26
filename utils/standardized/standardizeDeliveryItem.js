function standardizeElement(element) {
    switch (element.type) {
        case 'text':
        case 'rich_text':
        case 'url_slug':
        case 'custom':
        case 'number':
        case 'date_time':
        case 'modular_content':
            return element.value;

        case 'multiple_choice':
        case 'taxonomy':
            return element.value.map(item => item.codename);

        case 'asset':
            return element.value.map(item => item.url);
    }
}

function standardizeElements(elements) {
    const standardized = {};

    for (var prop in elements) {
        if (elements.hasOwnProperty(prop)) {
            standardized[prop] = standardizeElement(elements[prop]);
        }
    }

    return standardized;
}

function standardizeDeliveryItem(bundle, item) {
    return {
        system: {
            projectId: bundle.authData.project_id,
            id: item.system.id,
            name: item.system.name,
            codename: item.system.codename,
            language: item.system.language,
            last_modified: item.system.last_modified,
            type: item.system.type,
            full_id: `${item.system.id}/${item.system.language}`,
        },
        elements: standardizeElements(item.elements),
    }
}

module.exports = standardizeDeliveryItem;
