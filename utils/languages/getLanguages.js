const handleErrors = require('../handleErrors');

async function getLanguages(z, bundle) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/languages`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {}
    };

    const response = await z.request(options);
    handleErrors(response);

    const languages = z.JSON.parse(response.content).languages;

    return languages;
}

module.exports = getLanguages;
