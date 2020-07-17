var webhookUrl
chrome.storage.sync.get('webhookUrl', data => webhookUrl = data.webhookUrl)

MutationObserver = window.MutationObserver || window.WebKitMutationObserver

var observer = new MutationObserver(sendDiceResult)
observer.observe(document.body, {
	childList: true,
	subtree: true
})

function sendDiceResult(mutations, observer) {
	for(const mutation of mutations) {
		let diceRollMutation = mutation.target.id == "noty_layout__bottomRight"
		let isNewDiceRoll = mutation.addedNodes.item(0)?.id?.startsWith("noty_bar")
		if (diceRollMutation && isNewDiceRoll) {
			let diceResults = document.body.querySelectorAll(".dice_result__total-result")
			let latestDiceResult = diceResults.item(diceResults.length - 1)
			if (latestDiceResult !== null) {
				sendMessageToDiscordChannel(latestDiceResult.innerText)
				break;
			}
		}
	}
}

function sendMessageToDiscordChannel(diceResult) {
	let message = {"content": `${characterName()} rolled a ${diceResult}`}
	let headers = {"content-type": "application/json"}
	fetch(webhookUrl, {"method": "POST", "headers": headers, "body": JSON.stringify(message)})
}

function characterName() {
	return document.body.querySelector(".ddbc-character-name ").innerText
}