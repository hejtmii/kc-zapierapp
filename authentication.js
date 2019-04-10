const handleErrors = require('./utils/handleErrors');

async function execute(z, bundle) {
    async function checkCmApi() {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/types`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`,
            },
        };

        const response = await z.request(options);
        handleErrors(response);

        return true;
    }

    async function checkPreviewApi() {
        const options = {
            url: `https://preview-deliver.kenticocloud.com/${bundle.authData.project_id}/types`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bundle.authData.preview_api_key}`,
            },
        };

        const response = await z.request(options);
        handleErrors(response);

        return true;
    }

    async function getProjectName() {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/validate`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`,
            },
        };

        const response = await z.request(options);
        handleErrors(response);

        const results = z.JSON.parse(response.content);

        return results.project.name;
    }

    async function checkConnection() {
        const previewApi = checkPreviewApi();
        const projectName = getProjectName();
        //const cmApi = checkCmApi();

        const results = await Promise.all([
            projectName,
            previewApi,
            //cmApi,
        ]);

        return {
            projectName: results[0],
        };
    }

    const result = await checkConnection();

    return result;
}

const Authentication = {
    type: 'custom',
    test: execute,
    fields: [
        {
            label: 'Kentico Cloud Project ID',
            key: 'project_id',
            type: 'string',
            required: true,
            helpText: 'Your project ID is available in the [Kentico Cloud admin UI](https://app.kenticocloud.com) in Project Settings > API Keys.'
        },
        {
            label: 'Content Management API Key',
            key: 'cm_api_key',
            type: 'string',
            required: true,
            helpText: 'The Content Management API key is needed for Content item actions and is available in the [Kentico Cloud admin UI](https://app.kenticocloud.com) in Project Settings > API Keys.'
        },
        {
            label: 'Delivery Preview API Key',
            key: 'preview_api_key',
            type: 'string',
            required: true,
            helpText: 'The Preview API key is needed for Content item triggers and is available in the [Kentico Cloud admin UI](https://app.kenticocloud.com) in Project Settings > API Keys.'
        }
    ],
    connectionLabel: '{{projectName}} - {{bundle.authData.project_id}}'
};

module.exports = Authentication;
