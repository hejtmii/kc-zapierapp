const handleErrors = require('../../utils/handleErrors');

async function execute(z, bundle) {
    const options = {
        url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/languages`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        },
        params: {}
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content).languages;

    return results;
}

const getLanguages = {
    noun: "Language",
    display: {
        hidden: true,
        important: false,
        description: "Gets languages for the input dropdown, in the order, in which they are defined in Kentico Cloud.",
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

module.exports = getLanguages;
