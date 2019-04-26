const handleErrors = require('../utils/handleErrors');

async function getWorkflowSteps(z, bundle) {
    const options = {
        url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/workflow`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        },
        params: {}
    }

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content);
    return results;
}

function isFirstWorkflowStep(stepId, workflowSteps) {
    const firstStep = workflowSteps[0];

    return firstStep && (firstStep.id === stepId);
}

function isPublishedWorkflowStep(stepId, workflowSteps) {
    const lastStep = workflowSteps[workflowSteps.length - 1];

    return lastStep && (lastStep.id === stepId) && (lastStep.name === "Published");
}

function isScheduledWorkflowStep(stepId, workflowSteps) {
    const nextToLastStep = workflowSteps[workflowSteps.length - 2];

    return nextToLastStep && (nextToLastStep.id === stepId) && (nextToLastStep.name === "Scheduled");
}

async function execute(z, bundle) {
    async function getVariant(itemId, languageCode) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
        };

        const response = await z.request(options);
        handleErrors(response);

        const results = z.JSON.parse(response.content);

        return results;
    }

    async function createNewVersion(itemId, languageCode) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}/new-version`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
        };

        const response = await z.request(options);
        handleErrors(response);
    }

    async function publish(itemId, languageCode) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}/publish`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
        };

        const response = await z.request(options);
        handleErrors(response);
    }

    async function schedulePublishing(itemId, languageCode, publishDate) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}/publish`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
            body: {
                'scheduled_to': publishDate
            }
        };

        const response = await z.request(options);
        handleErrors(response);
    }

    async function cancelScheduling(itemId, languageCode) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}/cancel-scheduled-publish`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
        }

        const response = await z.request(options);
        handleErrors(response);
    }

    async function changeWorkflowStep(itemId, languageCode, stepId) {
        const options = {
            url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items/${itemId}/variants/codename/${languageCode}/workflow/${stepId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bundle.authData.cm_api_key}`
            },
            params: {},
        };

        const response = await z.request(options);
        handleErrors(response);
    }

    async function setWorkflowStep(itemId, languageCode, stepId) {
        const variant = await getVariant(itemId, languageCode);
        const workflowSteps = await getWorkflowSteps(z, bundle);

        const targetIsScheduled = isScheduledWorkflowStep(stepId, workflowSteps);

        const currentStepId = variant.workflow_step.id;
        if ((currentStepId === stepId) && !targetIsScheduled) {
            // Already in that step (except for scheduled)
            return {message: "Content item is already in the requested workflow step"};
        }

        const targetIsFirst = isFirstWorkflowStep(stepId, workflowSteps);

        const isPublished = isPublishedWorkflowStep(currentStepId, workflowSteps);
        if (isPublished) {
            // Create new version first
            await createNewVersion(itemId, languageCode);
            if (targetIsFirst) {
                // New version ends up in first WF step
                return {message: "New Draft version has been created"};
            }
        } else {
            const isScheduled = isScheduledWorkflowStep(currentStepId, workflowSteps);
            if (isScheduled) {
                // Cancel scheduling first
                await cancelScheduling(itemId, languageCode);
                if (targetIsFirst) {
                    // Cancelled scheduling ends up in first WF step
                    return {message: "Scheduling cancelled and content item has retuned to Draft"};
                }
            }
        }

        const targetIsPublished = isPublishedWorkflowStep(stepId, workflowSteps);
        if (targetIsPublished) {
            await publish(itemId, languageCode);

            return {message: "Content item has been published"};
        } else {
            if (targetIsScheduled) {
                const publishDate = bundle.inputData.publish_date;

                // If publish date is soon (within a minute from now) or in the past, we need to publish as scheduling may fail

                //const isInPast = moment(publishDate).add(-1, 'm').isBefore();
                const isInPast = new Date(publishDate).getTime() < new Date(new Date().toUTCString()).getTime()
                if (isInPast) {
                    await publish(itemId, languageCode);

                    return {message: "Content item has been published instead of scheduling in a moment"};
                } else {
                    await schedulePublishing(itemId, languageCode, publishDate);

                    return {message: "Content item has been scheduled to publishing"};
                }
            } else {
                await changeWorkflowStep(itemId, languageCode, stepId);

                return {message: "Content item workflow step has changed"};
            }
        }
    }

    // ID = "<item id>/<language_code>"
    const compoundId = bundle.inputData.compound_item_id;
    if (!compoundId) {
        throw Error('Missing compound item ID');
    }

    const parsedId = compoundId.split('/');
    const itemId = parsedId[0];
    const languageCode = parsedId[1];

    if (!itemId || !languageCode) {
        throw Error(`Compound item ID has to be in format "[item id]/[language code]", found "${compoundId}"`);
    }

    const stepId = bundle.inputData.workflow_step_id;
    if (!compoundId) {
        throw Error('Missing target workflow step ID');
    }

    const result = await setWorkflowStep(itemId, languageCode, stepId);

    return result;
}

async function getScheduledPublishingFields(z, bundle) {
    const workflowSteps = await getWorkflowSteps(z, bundle);
    const stepId = bundle.inputData.workflow_step_id;

    const isScheduledSelected = isScheduledWorkflowStep(stepId, workflowSteps);
    if (isScheduledSelected) {
        // Only display the datetime field for Scheduled workflow step
        return [{
            type: 'datetime',
            key: 'publish_date',
            label: 'To be published on',
            helpText: 'In case the publishing time is in the past, the content item gets published immediately.',
            required: true
        }];
    }

    return [];
}

const changeContentItemWorkflow = {
    noun: "Content item",
    display: {
        "hidden": false,
        "important": true,
        "description": "Changes the content item workflow status.",
        "label": "Change Content Item Workflow"
    },
    key: "change_item_workflow",
    operation: {
        perform: execute,
        inputFields: [
            {
                search: "find_item.id",
                list: false,
                required: false,
                dynamic: "get_content_items.id.system__name",
                label: "Content item",
                helpText: "Select the content item to update.\n\nFor a custom value use compound content item id in a form of \"[item id]/[language code]\"",
                key: "compound_item_id",
                type: "string",
                altersDynamicFields: false
            },
            {
                search: "find_workflow_step.id",
                list: false,
                required: true,
                dynamic: "get_workflow_steps.id.name",
                label: "Set workflow step",
                helpText: "Select a workflow step to which the content item should move.\n\n[More about workflow in Kentico Cloud ...](https://docs.kenticocloud.com/tutorials/collaborate-with-your-team/workflows/setting-up-a-workflow-for-your-content)",
                key: "workflow_step_id",
                type: "string",
                altersDynamicFields: true
            },
            getScheduledPublishingFields
        ]
    },
};

module.exports = changeContentItemWorkflow;
