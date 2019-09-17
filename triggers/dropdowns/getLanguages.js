const getLanguages = require('../../utils/languages/getLanguages');

async function execute(z, bundle) {
    const languages = getLanguages(z, bundle);

    return languages;
}

module.exports = {
    noun: "Language",
    display: {
        hidden: true,
        important: false,
        description: "Gets languages for the input dropdown, in the order, in which they are defined in Kentico Kontent.",
        label: "Get Languages"
    },
    key: "get_languages",
    operation: {
        perform: execute,
        sample: {
            id: "00000000-0000-0000-0000-000000000000",
            codename: "en-US",
            name: "English - United States"
        },
        outputFields: [
            {
                key: "id",
                label: "Language ID"
            },
            {
                key: "name",
                label: "Name"
            },
            {
                key: "codename",
                label: "Codename"
            }
        ]
    },
};
