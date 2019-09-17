function getLanguageField(extras) {
    return Object.assign(
        {
            label: 'Language',
            key: 'languageId',
            type: 'string',
            dynamic: 'get_languages.id.name',
        },
        extras || {},
    );
}

module.exports = getLanguageField;
