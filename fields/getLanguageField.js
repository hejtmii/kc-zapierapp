function getLanguageField(extras) {
    return Object.assign(
        {
            label: 'Language codename',
            key: 'language',
            helpText: 'Select language',
            type: 'string',
            dynamic: 'get_languages.codename.name',
        },
        extras || {},
    );
}

module.exports = getLanguageField;
