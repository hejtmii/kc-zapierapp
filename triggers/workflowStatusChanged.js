const contentItemSample = require('../fields/contentItemSample');
const contentItemOutputFields = require('../fields/contentItemOutputFields');
const getContentTypeField = require('../fields/getContentTypeField');
const getWorkflowStepField = require('../fields/getWorkflowStepField');
const getLanguageField = require('../fields/getLanguageField');
const getContentItem = require('../utils/items/get/getContentItem');
const getItemResult = require('../utils/items/get/getItemResult');
const handleErrors = require('../utils/handleErrors');
const getLanguageByCodename = require('../utils/languages/getLanguageByCodename');

function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        var r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
}

async function subscribeHook(z, bundle) {
    const data = {
        // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
        name: `${bundle.inputData.name || 'Item workflow step changed'} (Zapier)`,
        url: bundle.targetUrl,
        secret: randomString(32),
        triggers: {
            workflow_step_changes: [
                {
                    type: 'content_item_variant',
                    transitions_to: [
                        {id: bundle.inputData.workflowStepId}
                    ]
                }
            ]
        }
    };

    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/webhooks`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {},
        body: JSON.stringify(data)
    };

    const response = await z.request(options);
    handleErrors(response);

    const webhook = z.JSON.parse(response.content);

    return webhook;
}

async function unsubscribeHook(z, bundle) {
    // bundle.subscribeData contains the parsed response JSON from the subscribe
    // request made initially.
    const webhook = bundle.subscribeData;

    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/webhooks/${webhook.id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
    };

    const response = await z.request(options);
    handleErrors(response);

    return true;
}

async function parsePayload(z, bundle) {
    //const message = bundle.cleanedRequest.message;
    const items = bundle.cleanedRequest.data.items;
    const item = items[0];
    if (!item) {
        throw z.errors.HaltedError('Skipped, no items found.');
    }

    const languageId = bundle.inputData.languageId;
    if (languageId && (item.language.id !== languageId)) {
        throw new z.errors.HaltedError('Skipped, language not matched.');
    }

    const workflowStepId = bundle.inputData.workflowStepId;
    if (workflowStepId && (item.transition_to.id !== workflowStepId)) {
        throw new z.errors.HaltedError('Skipped, target step not matched.');
    }

    const resultItem = await getContentItem(z, bundle, item.item.id, item.language.id);
    if (!resultItem) {
        throw new z.errors.HaltedError('Skipped, item not found.');
    }

    const contentTypeId = bundle.inputData.contentTypeId;
    if (contentTypeId && (resultItem.system.contentTypeId !== contentTypeId)) {
        throw new z.errors.HaltedError('Skipped, content type not matched.');
    }

    return [resultItem];
}

async function getFirstFoundItem(z, bundle) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/items`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
    };

    const response = await z.request(options);
    handleErrors(response);

    const items = z.JSON.parse(response.content).items;
    if (!items.length) {
        return null;
    }

    const item = items[0];
    return item;
}

async function getItemVariants(z, bundle, itemId) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/items/${itemId}/variants`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
    };

    const response = await z.request(options);
    handleErrors(response);

    const variants = z.JSON.parse(response.content);
    return variants;
}


async function getSampleItem(z, bundle) {
    const item = await getFirstFoundItem(z, bundle);
    if (!item) {
        return [];
    }

    const variants = await getItemVariants(z, bundle, item.id);
    if (!variants.length) {
        return [];
    }

    const sampleItem = await getItemResult(z, bundle, item, variants[0]);
    return [sampleItem];
}

module.exports = {
    key: 'item_workflow_step_changed',
    noun: 'Item workflow step changed',
    display: {
        label: 'Item workflow step changed',
        description: 'Triggers when an item workflow step changes.'
    },
    operation: {
        inputFields: [
            {
                label: "Webhook name",
                helpText: "Enter a webhook name which will appear in the Kentico Kontent admin UI.",
                key: "name",
                type: "string",
            },
            getWorkflowStepField({
                required: true,
                helpText: 'Fires for the selected workflow step.',
            }),
            getLanguageField({
                helpText: 'Fires only for items of the given languages. Leave blank for all languages.',
            }),
            getContentTypeField({
                helpText: 'Fires only for items of the given content type. Leave blank for all content types.',
            }),
        ],
        type: 'hook',

        performSubscribe: subscribeHook,
        performUnsubscribe: unsubscribeHook,

        perform: parsePayload,
        performList: getSampleItem,

        sample: contentItemSample,
        outputFields: contentItemOutputFields,
    }
};
