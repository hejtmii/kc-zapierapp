const getWorkflowSteps = require('../../utils/workflows/getWorkflowSteps');

async function execute(z, bundle) {
    const workflowSteps = await getWorkflowSteps(z, bundle);

    return workflowSteps;
}

module.exports = {
    noun: "Workflow step",
    display: {
        hidden: true,
        important: false,
        description: "Gets workflow steps for the input dropdown, in the order, in which they are defined in Kentico Kontent.",
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
