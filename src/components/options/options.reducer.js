export const LOAD_OPTIONS = 'load_options'
export const ADD_NEW_CHARACTER = 'add_new_character'
export const SAVE_CHARACTER = 'save_character'
export const REMOVE_CHARACTER = 'remove_character'

export const initialState = {
    characters: [],
}

const emptyCharacter = {
    discordUrl: '',
    ddbUrl: '',
}

export const optionsReducer = (state, action) => {
    console.log({ state, action })
    switch (action.type) {
        case LOAD_OPTIONS: {
            return action.payload
        }
        case ADD_NEW_CHARACTER: {
            return {
                characters: [...state.characters, emptyCharacter],
            }
        }
        case SAVE_CHARACTER: {
            const { index, character } = action.payload
            const newState = {
                ...state,
            }

            newState.characters[index] = character

            chrome.storage.sync.set({ diceBot: newState })

            return newState
        }
        case REMOVE_CHARACTER: {
            const { index } = action.payload
            const newState = {
                ...state,
                characters: state.characters.filter((_, i) => i !== index),
            }

            chrome.storage.sync.set({ diceBot: newState })

            return newState
        }
        default: {
            throw new Error(`Action ${action.type} not supported`)
        }
    }
}
