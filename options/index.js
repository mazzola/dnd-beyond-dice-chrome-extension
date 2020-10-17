import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import '../common/hot-reload'

const Form = () => {
    const [webhookUrl, setWebhookUrl] = useState('')

    useEffect(() => {
        chrome.storage.sync.get('webhookUrl', ({ webhookUrl }) =>
            setWebhookUrl('webhookUrl')
        )
    }, [])

    return (
        <form>
            <label>Discord Webhook URL:</label>
            <br />
            <input type="url" id="webhookUrlField" />
            <br />
            <input type="submit" id="saveButton" value="Save" />
        </form>
    )
}

ReactDOM.render(<Form />, document.getElementById('root'))

// const webhookUrlField = document.getElementById('webhookUrlField')

// chrome.storage.sync.get('webhookUrl', (data) => setWebhookInputField(data))
// document.getElementById('saveButton').addEventListener('click', storeWebhookUrl)

// function setWebhookInputField(data) {
//     console.log(`Setting: ${data.webhookUrl}`)
//     webhookUrlField.value = data.webhookUrl
// }

// function storeWebhookUrl() {
//     let value = htmlEncode(webhookUrlField.value)
//     if (isValidUrl(value)) {
//         console.log(`Storing: ${webhookUrlField.value}`)
//         chrome.storage.sync.set({ webhookUrl: webhookUrlField.value })
//     }
// }

// function isValidUrl(string) {
//     try {
//         new URL(string)
//     } catch (_) {
//         return false
//     }

//     return true
// }

// function htmlEncode(string) {
//     var element = document.createElement('element')
//     element.innerText = string
//     return element.innerHTML
// }
