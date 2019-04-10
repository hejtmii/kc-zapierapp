function handleErrors(response) {
    if (response.status === 400) {
        throw new Error(`Request failed with code ${response.status}.\nResponse: ${response.content}`);
    }
    response.throwForStatus();
}

module.exports = handleErrors;
