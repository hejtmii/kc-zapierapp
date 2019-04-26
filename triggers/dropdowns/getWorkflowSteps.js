const handleErrors = require('../../utils/handleErrors');

async function execute(z, bundle) {
    const options = {
        url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/workflow`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        },
        params: {}
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content);

    return results;
}

const getWorkflowSteps = {
    noun: "Workflow step",
    display: {
        hidden: true,
        important: false,
        description: "Gets workflow steps for the input dropdown, in the order, in which they are defined in Kentico Cloud.",
        label: "Get Workflow Steps"
    },
    key: "get_workflow_steps",
    operation: {
        perform: execute,
        sample: {
            transitions_to: [],
            id: "88ac5e6e-1c5c-4638-96e1-0d61221ad5bf",
            name: "Draft"
        },
        outputFields: [
            {
                key: "id",
                label: "Workflow step ID"
            },
            {
                key: "name",
                label: "Name"
            }
        ]
    },
};

module.exports = getWorkflowSteps;
