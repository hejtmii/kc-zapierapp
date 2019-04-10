function getElementFieldType(element) {
    switch (element.type) {
        case 'text':
        case 'rich_text':
        case 'url_slug':
            return 'unicode';

        case 'custom':
        case 'multiple_choice':
        case 'asset':
        case 'modular_content':
        case 'taxonomy':
            return 'text';

        case 'number':
            return 'float';

        case 'date_time':
            return 'datetime';

        case 'guidelines':
            return 'copy';
    }
}

module.exports = getElementFieldType;
