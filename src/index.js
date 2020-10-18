import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const Options = () => {
    const [webhookUrl, setWebhookUrl] = useState('')
    const handleChange = (e) => setWebhookUrl(e.target.value) // TODO: handle url validation
    const handleClick = (e) => {
        e.preventDefault()
        console.log(`Storing: ${webhookUrl}`)
        chrome.storage.sync.set({ webhookUrl })
    }

    useEffect(() => {
        chrome.storage.sync.get('webhookUrl', ({ webhookUrl }) =>
            setWebhookUrl(webhookUrl)
        )
    }, [])

    return (
        <form>
            <label>Discord Webhook URL:</label>
            <br />
            <input type="url" onChange={handleChange} value={webhookUrl} />
            <br />
            <input type="submit" onClick={handleClick} value="Save" />
        </form>
    )
}

ReactDOM.render(<Options />, document.getElementById('root'))
