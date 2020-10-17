chrome.management.getSelf((self) => {
    if (self.installType === 'development') {
        const hmrConnection = new WebSocket('ws://localhost:8080')

        hmrConnection.onmessage = () => window.location.reload()
    }
})

const webhookUrlField = document.getElementById('webhookUrlField')
chrome.storage.sync.get('webhookUrl', (data) => setWebhookInputField(data))
document.getElementById('saveButton').addEventListener('click', storeWebhookUrl)

function setWebhookInputField(data) {
    console.log(`Setting: ${data.webhookUrl}`)
    webhookUrlField.value = data.webhookUrl
}

function storeWebhookUrl() {
    let value = htmlEncode(webhookUrlField.value)
    if (isValidUrl(value)) {
        console.log(`Storing: ${webhookUrlField.value}`)
        chrome.storage.sync.set({ webhookUrl: webhookUrlField.value })
    }
}

function isValidUrl(string) {
    try {
        new URL(string)
    } catch (_) {
        return false
    }

    return true
}

function htmlEncode(string) {
    var element = document.createElement('element')
    element.innerText = string
    return element.innerHTML
}
