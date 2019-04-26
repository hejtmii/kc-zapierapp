function getFilterParams(field, pattern, value) {
    const filterParams = {};

    const filterQuery = (pattern || '{0}={1}')
        .replace('{0}', encodeURIComponent(field))
        .replace('{1}', encodeURIComponent(value));
    const filterParts = filterQuery.split('&');

    for (var i = 0; i < filterParts.length; i++) {
        const components = filterParts[i].split('=');
        if (components.length === 2) {
            filterParams[decodeURIComponent(components[0])] = decodeURIComponent(components[1]);
        }
    }

    return filterParams;
}

module.exports = getFilterParams;
