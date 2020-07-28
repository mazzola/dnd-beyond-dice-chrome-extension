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
				let message = createMessage(latestDiceResult.innerText)
				sendMessageToDiscordChannel(message)
				break;
			}
		}
	}
}

function sendMessageToDiscordChannel(message) {
	let content = {"content": message}
	let headers = {"content-type": "application/json"}
	fetch(webhookUrl, {"method": "POST", "headers": headers, "body": JSON.stringify(content)})
}

function createMessage(diceResult) {
	if (isNatural20AttackRoll() && !isRollWithDisadvantage()) {
		return `${characterName()} rolled a natural 20!`
	}

	return `${characterName()} rolled a ${diceResult}`
}

function characterName() {
	return document.body.querySelector(".ddbc-character-name ").innerText
}

function isNatural20AttackRoll() {
	let diceBreakdowns = document.body.querySelectorAll(".dice_result__info__breakdown")
	let latestDiceBreakdown = diceBreakdowns.item(diceBreakdowns.length - 1)
	let isNatural20 = latestDiceBreakdown.innerText.includes("20")

	if (!isNatural20) {
		return false;
	}

	let diceRollTypes = document.body.querySelectorAll(".dice_result__rolltype")
	let latestDiceRollType = diceRollTypes.item(diceRollTypes.length -1)
	let isAttackRoll = latestDiceRollType.classList.contains("rolltype_tohit")
	return isNatural20 && isAttackRoll
}

function isRollWithDisadvantage() {
	let diceResultContainers = document.body.querySelectorAll(".dice_result__total-container")
	let latestDiceResultContainer = diceResultContainers.item(diceResultContainers.length - 1)
	return latestDiceResultContainer.innerText.includes("DIS")
}