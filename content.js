let webhookUrl

chrome.storage.sync.get('diceBot', ({ diceBot }) => {
    const { characters } = diceBot

    webhookUrl = characters.reduce((found, character) => {
        if (character.ddbUrl === window.location.href) {
            return character.discordUrl
        }
        return found
    }, '')
})

MutationObserver = window.MutationObserver || window.WebKitMutationObserver

var observer = new MutationObserver(sendDiceResult)
observer.observe(document.body, {
    childList: true,
    subtree: true,
})

function sendDiceResult(mutations, observer) {
    for (const mutation of mutations) {
        let diceRollMutation = mutation.target.id == 'noty_layout__bottomRight'
        let isNewDiceRoll = mutation.addedNodes
            .item(0)
            ?.id?.startsWith('noty_bar')
        if (diceRollMutation && isNewDiceRoll) {
            let diceResults = document.body.querySelectorAll(
                '.dice_result__total-result'
            )
            let latestDiceResult = diceResults.item(diceResults.length - 1)
            if (latestDiceResult !== null) {
                sendMessageToDiscordChannel(latestDiceResult.innerText)
                break
            }
        }
    }
}

function sendMessageToDiscordChannel(diceResult) {
    let message = {
        embeds: [
            {
                title: createMessageTitle(),
                description: createMessageDescription(diceResult),
                color: createMessageColor(),
                thumbnail: createMessageThumbnail(),
                footer: createMessageFooter(),
            },
        ],
    }
    let headers = { 'content-type': 'application/json' }
    fetch(webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(message),
    })
}

function createMessageTitle() {
    let rollDescriptions = document.body.querySelectorAll(
        '.dice_result__info__title'
    )
    let latestRollDescription = last(rollDescriptions).innerText
    return `${characterName()} rolled ${capitalize(latestRollDescription)}`
}

function createMessageDescription(diceResult) {
    let diceBreakdowns = document.body.querySelectorAll(
        '.dice_result__info__breakdown'
    )
    let latestDiceBreakdown = last(diceBreakdowns).innerText
    return `${latestDiceBreakdown} = \`${diceResult}\``
}

function createMessageColor() {
    let diceRollTypes = document.body.querySelectorAll('.dice_result__rolltype')
    let latestDiceRollType = last(diceRollTypes)
    let rgbColor = getComputedStyle(latestDiceRollType)
        .color.slice(4, -1)
        .split(', ')
    return rgbToDecimal(rgbColor[0], rgbColor[1], rgbColor[2])
}

function createMessageThumbnail() {
    let portrait = document.body.querySelector(
        '.ddbc-character-avatar__portrait'
    )
    let portraitUrl = portrait.style.backgroundImage.slice(5, -2)
    return { url: portraitUrl }
}

function createMessageFooter() {
    let diceNotations = document.body.querySelectorAll(
        '.dice_result__info__dicenotation'
    )
    return { text: last(diceNotations).innerText }
}

function characterName() {
    return document.body.querySelector('.ddbc-character-name ').innerText
}

function last(nodeList) {
    return nodeList.item(nodeList.length - 1)
}

function capitalize(words) {
    return words.replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
}

function rgbToDecimal(red, green, blue) {
    return parseInt(red << 16) + parseInt(green << 8) + parseInt(blue)
}
