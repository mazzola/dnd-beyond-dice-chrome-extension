import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { useForm, useField } from 'react-form'

import './index.scss'

const initialState = {
    characters: [],
}
const ADD_CHARACTER = 'add_character'
const LOAD_CHARACTERS = 'load_characters'
const SAVE_CHARACTERS = 'save_characters'

// TODO:
//  - add functionality for all action types
//  - consider saving/loading characters as a subset of dicebot options
const reducer = (state, action) => {
    console.log('in reducer....', action)
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
        case SAVE_CHARACTERS:
            // anti pattern to do this here?
            chrome.storage.sync.set({
                diceBot: {
                    characters: action.payload.characters,
                },
            })

            return state
        default:
            throw new Error(`Action type ${action.type} not supported`)
    }
}

const Input = ({
    scope,
    fieldName,
    defaultValue = '',
    index,
    inputType = 'url',
}) => {
    const { getInputProps } = useField(`${scope}[${index}].${fieldName}`, {
        defaultValue,
    })

    return (
        <div className="dicebot-options__character--input">
            <label>{fieldName}</label>
            <br />
            <input type={inputType} {...getInputProps()} />
        </div>
    )
}

const Options = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const handleAddCharacter = (e) => {
        e.preventDefault()
        dispatch({ type: ADD_CHARACTER })
    }
    const { Form } = useForm({
        onSubmit: (values, instance) => {
            const { characters } = values

            dispatch({
                type: SAVE_CHARACTERS,
                payload: { characters },
            })
        },
    })

    useEffect(() => {
        chrome.storage.sync.get('diceBot', ({ diceBot }) =>
            dispatch({
                type: LOAD_CHARACTERS,
                payload: diceBot.characters,
            })
        )
    }, [])

    return (
        <div className="dicebot-options">
            <strong>Current State</strong>
            <pre>{JSON.stringify(state, null, 4)}</pre>
            <Form>
                {state.characters.map(({ ddbUrl, discordUrl }, i) => {
                    return (
                        <div className="dicebot-options__character">
                            <Input
                                scope="characters"
                                fieldName="ddbUrl"
                                index={i}
                                defaultValue={ddbUrl}
                            />
                            <Input
                                scope="characters"
                                fieldName="discordUrl"
                                index={i}
                                defaultValue={discordUrl}
                            />
                        </div>
                    )
                })}
                <button onClick={handleAddCharacter}>Add a Character</button>
                <button type="submit">Save</button>
            </Form>
        </div>
    )
}

ReactDOM.render(<Options />, document.getElementById('root'))
