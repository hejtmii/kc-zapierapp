const languageCodeField = require('../fields/languageCode');
const contentTypeField = require('../fields/contentType');
const getItemElementFields = require('../fields/getItemElementFields');
const createItem = require('./createItem');
const createVariant = require('./createVariant');

const itemNameField = {
    required: true,
    label: "Content item name",
    helpText: "Name of the content item. Displays in content inventory. Shared by all language variants.",
    key: "name",
    type: "string",
};

const externalIdField = {
    required: false,
    label: "External ID",
    helpText: "Any unique identifier for the item in the external system. Can be used to link the content item for future updates. [Read more about external ID ...](https://developer.kenticocloud.com/v1/reference#content-management-api-reference-by-external-id)",
    key: "external_identifier",
    type: "string",
};

const elementsInfoField = {
    label: "Elements",
    helpText: `#### Content item variant elements
                
The following inputs represent elements of a chosen content type as defined in Kentico Cloud. Element data is stored per language version.

[Read more about elements ...](https://docs.kenticocloud.com/tutorials/define-content-structure/content-elements/content-type-elements-reference)`,
    key: "elements_header",
    type: "copy",
};

async function execute(z, bundle) {
    const name = bundle.inputData.name;
    const contentType = bundle.inputData.content_type;
    const language = bundle.inputData.language;
    const externalId = bundle.inputData.external_identifier;

    const item = await createItem(z, bundle, name, contentType, externalId);
    const variant = await createVariant(z, bundle, item.id, language, contentType);

    return {
        item,
        variant,
    };
}

const createContentItem = {
    noun: "Content item",
    display: {
        hidden: false,
        important: true,
        description: "Creates a content item and its language variant using Kentico Cloud Content Management API. The created item is not published, but only in a Draft workflow step.",
        label: "Create Content Item"
    },
    key: "create_item",
    operation: {
        perform: execute,
        inputFields: [
            languageCodeField,
            contentTypeField,
            itemNameField,
            externalIdField,
            elementsInfoField,
            async function (z, bundle) {
                return await getItemElementFields(z, bundle, bundle.itemData.content_type);
            }
        ]
    },
};

module.exports = createContentItem;
