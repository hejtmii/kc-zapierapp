const handleErrors = require('../handleErrors');

async function getLanguage(z, bundle, codename) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/languages/codename/${codename}`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {}
    };

    const response = await z.request(options);
    handleErrors(response);

    const language = z.JSON.parse(response.content);

    return language;
}

module.exports = getLanguage;
