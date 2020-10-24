const characterDataUrl = "https://character-service.dndbeyond.com/character/v4/character/"
var webhookUrl
chrome.storage.sync.get('webhookUrl', data => webhookUrl = data.webhookUrl)

MutationObserver = window.MutationObserver || window.WebKitMutationObserver

var observer = new MutationObserver(sendDiceResultAndSpellCasts)
observer.observe(document.body, {
	childList: true,
	subtree: true
})

function sendDiceResultAndSpellCasts(mutations, observer) {
	sendDiceResult(mutations, observer)
	setupSpellCastingButtons()
}

function sendDiceResult(mutations, observer) {
	for(const mutation of mutations) {
		let diceRollMutation = mutation.target.id == "noty_layout__bottomRight"
		let isNewDiceRoll = mutation.addedNodes.item(0)?.id?.startsWith("noty_bar")
		if (diceRollMutation && isNewDiceRoll) {
			let diceResults = document.body.querySelectorAll(".dice_result__total-result")
			let latestDiceResult = diceResults.item(diceResults.length - 1)
			if (latestDiceResult !== null) {
				sendDiceResultToDiscordChannel(latestDiceResult.innerText)
				break;
			}
		}
	}
}

function setupSpellCastingButtons() {
	const castButtons = document.getElementsByClassName("ct-spells-spell__action")
	for (const button of castButtons) {
		button.addEventListener("click", sendSpellCastingToDiscord)
	}
}

function sendDiceResultToDiscordChannel(diceResult) {
	sendMessageToDiscordChannel(
		createMessageTitle(),
		createMessageDescription(diceResult),
		createMessageColor(),
		createMessageThumbnail(),
		createMessageFooter()
	 )
}

function sendMessageToDiscordChannel(title, description, color, thumbnail, footer) {
	let message = {
		"embeds": [{
			"title": title,
			"description": description,
			"color": color,
			"thumbnail": thumbnail,
			"footer": footer
		}]
	}
	let headers = {"content-type": "application/json"}
	fetch(webhookUrl, {"method": "POST", "headers": headers, "body": JSON.stringify(message)})
}

function createMessageTitle() {
	let rollDescriptions = document.body.querySelectorAll(".dice_result__info__title")
	let latestRollDescription = last(rollDescriptions).innerText
	return `${characterName()} rolled ${capitalize(latestRollDescription)}`
}

function createSpellMessageTitle(spellName) {
	return `${characterName()} casts ${spellName}`
}

function getSpellName(event) {
	// TODO: Fix a bug that makes this function return undefined whenever it's called more than once
	for (let element of event.composedPath()) {
		if (element.className == "ct-spells-spell ") {
			const spellName = element.querySelector(".ddbc-spell-name").innerText
			return spellName
		}
	}
}

async function sendSpellCastingToDiscord(event) {
	const spellName = getSpellName(event)
	console.log(spellName)
	const response = await fetch(characterDataUrl + "23934295")
	let spellDescription = "Could not get spell description"
	if (response.ok) {
		const result = await response.json()
		const spells = result.data.classSpells[0].spells
		const otherSpells = result.data.spells.class
		const classSpells = getClassSpells(69)
		spellDescription = getSpellDescriptionFromName(spells.concat(otherSpells).concat(classSpells), spellName)
	}

	let title = getSpellName(event)
	console.log(title)

	sendMessageToDiscordChannel(
		createSpellMessageTitle(spellName),
		spellDescription,
		rgbToDecimal(197, 49, 49),
		createMessageThumbnail()
	)
}

async function getClassSpells(classId) {
	const response = await fetch(`https://character-service.dndbeyond.com/character/v4/game-data/always-prepared-spells?classId=${classId}&classLevel=20`)
	return response.then(response => response.json())
					.then(json => json.data)
					.catch(e => [])
}

function getSpellDescriptionFromName(spells, spellName) {
	for (const spell of spells) {
		if (spell.definition.name == spellName) {
			return convertHtmlToMarkdown(spell.definition.description)
		}
	}

	return "Could not get spell description"
}

function createMessageDescription(diceResult) {
	let diceBreakdowns = document.body.querySelectorAll(".dice_result__info__breakdown")
	let latestDiceBreakdown = last(diceBreakdowns).innerText
	return `${latestDiceBreakdown} = \`${diceResult}\``
}

function createMessageColor() {
	let diceRollTypes = document.body.querySelectorAll(".dice_result__rolltype")
	let latestDiceRollType = last(diceRollTypes)
	let rgbColor = getComputedStyle(latestDiceRollType).color.slice(4, -1).split(", ")
	return rgbToDecimal(rgbColor[0], rgbColor[1], rgbColor[2])
}

function createMessageThumbnail() {
	let portrait = document.body.querySelector(".ddbc-character-avatar__portrait")
	let portraitUrl = portrait.style.backgroundImage.slice(5, -2)
	return {"url": portraitUrl}
}

function createMessageFooter() {
	let diceNotations = document.body.querySelectorAll(".dice_result__info__dicenotation")
	return {"text": last(diceNotations).innerText}
}

function characterName() {
	return document.body.querySelector(".ddbc-character-name ").innerText
}

function last(nodeList) {
	return nodeList.item(nodeList.length - 1)
}

function capitalize(words) {
	return words.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

function rgbToDecimal(red, green, blue) {
	return parseInt(red << 16) + parseInt(green << 8) + parseInt(blue)
}

function convertHtmlToMarkdown(htmlString) {
	htmlString = htmlString.replaceAll('<li>', '- ')
	htmlString = htmlString.replaceAll('<strong>', '**')
	htmlString = htmlString.replaceAll('</strong>', '**')
	htmlString = htmlString.replaceAll('</p><ul>', '')
	htmlString = htmlString.replaceAll('</p>', '\n')
	console.log(htmlString)
	// let strippedOfTags = htmlString.replace(/(<([^>]+)>)/gi, "")
	// Decode HTML entities and strip of tags
	let element = document.createElement('div');
	element.innerHTML = htmlString
	console.log(element.innerText)
	return element.innerText
}
