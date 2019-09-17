const handleErrors = require('../handleErrors');

async function getWorkflowSteps(z, bundle) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/workflow`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {}
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content);
    return results;
}

module.exports = getWorkflowSteps;
