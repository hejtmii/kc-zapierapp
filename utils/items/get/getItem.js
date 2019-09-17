const handleErrors = require('../../handleErrors');

async function getItem(z, bundle, url) {
    const options = {
        url: url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {}
    };

    const response = await z.request(options);
    if (response.status === 404) {
        return null
    }

    handleErrors(response);
    const item = z.JSON.parse(response.content);

    return item;
}

module.exports = getItem;
