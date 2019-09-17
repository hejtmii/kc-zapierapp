function getWorkflowStepField(extras) {
    return Object.assign(
        {
            list: false,
            dynamic: "get_workflow_steps.id.name",
            label: "Workflow step",
            key: "workflowStepId",
            type: "string",
        },
        extras || {},
    );
}

module.exports = getWorkflowStepField;
