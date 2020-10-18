chrome.management.getSelf((self) => {
    if (self.installType === 'development') {
        const hmrConnection = new WebSocket('ws://localhost:8080')

        hmrConnection.onmessage = (msg) => window.location.reload()
    }
})
