import {
    ADD_CHARACTER,
    LOAD_CHARACTERS,
    SAVE_CHARACTERS,
    SAVE_CHARACTER,
} from './options.actions'

export const optionsInitialState = {
    characters: [],
}
// TODO:
//  - add functionality for all action types
//  - consider saving/loading characters as a subset of dicebot options
export const optionsReducer = (state, action) => {
    switch (action.type) {
        case ADD_CHARACTER:
            return {
                ...state,
                characters: [
                    ...state.characters,
                    { ddbUrl: '', discordUrl: '' },
                ],
            }
        case 'remove_character':
            return state
        case 'update_character':
            return state
        case LOAD_CHARACTERS:
            return {
                ...state,
                characters: action.payload,
            }
        case SAVE_CHARACTER:
            return state
        case SAVE_CHARACTERS:
            // filter out blank characters before saving
            const characters = action.payload.characters.filter(
                (c) => c.ddbUrl !== '' && c.discordUrl !== ''
            )
            // anti pattern to do this here?
            chrome.storage.sync.set({
                diceBot: { characters },
            })

            return state
        default:
            throw new Error(`Action type ${action.type} not supported`)
    }
}
