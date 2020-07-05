MutationObserver = window.MutationObserver || window.WebKitMutationObserver

var observer = new MutationObserver(logDiceResult)
observer.observe(document.body, {
	childList: true,
	subtree: true
})

function logDiceResult(mutations, observer) {
	for(const mutation of mutations) {
		let diceRollMutation = mutation.target.id == "noty_layout__bottomRight"
		let isNewDiceRoll = mutation.addedNodes.length > 0 && mutation.addedNodes.item(0).id.startsWith("noty_bar")
		if (diceRollMutation && isNewDiceRoll) {
			let diceResults = document.body.querySelectorAll(".dice_result__total-result")
			let latestDiceResult = diceResults.item(diceResults.length - 1)
			if (latestDiceResult !== null) {
				console.log(latestDiceResult.innerText)
				break;
			}
		}
	}
}
