import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { useForm, useField } from 'react-form'

import './index.scss'

const initialState = {
    characters: [],
}
const ADD_CHARACTER = 'add_character'
const LOAD_CHARACTERS = 'load_characters'

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
        case 'save_characters':
            return state
        default:
            throw new Error(`Action type ${action.type} not supported`)
    }
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

            console.log('submitting...', values)

            chrome.storage.sync.set({
                diceBot: { characters },
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
        <div className="options">
            <pre>{JSON.stringify(state, null, 4)}</pre>
            <Form>
                {state.characters.map(({ ddbUrl, discordUrl }, i) => {
                    return (
                        <>
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
                        </>
                    )
                })}
                <br />
                <button onClick={handleAddCharacter}>Add a Character</button>
                <br />
                <button type="submit">Save</button>
            </Form>
        </div>
    )
}

ReactDOM.render(<Options />, document.getElementById('root'))

function Input({
    scope,
    fieldName,
    defaultValue = '',
    index,
    inputType = 'url',
}) {
    const { getInputProps } = useField(`${scope}[${index}].${fieldName}`, {
        defaultValue,
    })

    return (
        <>
            <label className="mike">{fieldName}</label>
            <input type={inputType} {...getInputProps()} />
        </>
    )
}
