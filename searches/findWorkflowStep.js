const handleErrors = require('../utils/handleErrors');

async function execute(z, bundle) {
    async function getWorkflowSteps() {
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

    async function findWorkflowStep(stepName) {
        if (!stepName) {
            return [];
        }

        const workflowSteps = await getWorkflowSteps();
        const search = stepName.toLowerCase();

        const fullMatch = workflowSteps.filter(step => step.name.toLowerCase() === search);
        if (fullMatch.length) {
            return fullMatch;
        }

        const partialMatch = workflowSteps.filter(step => step.name.toLowerCase().indexOf(search) >= 0);
        return partialMatch;
    }

    const stepName = bundle.inputData.name;

    const found = await findWorkflowStep(stepName);

    return found;
}

const findWorkflowStep = {
    noun: 'Workflow step',
    display: {
        hidden: false,
        important: false,
        description: 'Finds a workflow step based on its name.',
        label: 'Find Workflow Step',
    },
    key: 'find_workflow_step',
    operation: {
        perform: execute,
        inputFields: [
            {
                label: 'Step name',
                key: 'name',
                helpText: 'Name of the workflow step, the search is case insensitive. If exact match is not found, searches as a substring.',
                type: 'string',
                required: true,
            }
        ],
        sample: {
            'transitions_to': [],
            'id': '88ac5e6e-1c5c-4638-96e1-0d61221ad5bf',
            'name': 'Draft'
        },
        outputFields: [
            {
                'key': 'id',
                'label': 'Workflow step ID'
            },
            {
                'key': 'name',
                'label': 'Name'
            }
        ]
    },
};

module.exports = findWorkflowStep;
