function getLanguageField(extras) {
    return Object.assign(
        {
            label: 'Language codename',
            key: 'language',
            helpText: 'Language codename as shown in [Kentico Cloud admin UI](https://app.kenticocloud.com) Project settings > Localization. The value is case-sensitive.',
            type: 'string',
        },
        extras || {},
    );
}

module.exports = getLanguageField;
