import React, { useReducer, useEffect } from 'react'
import { useForm } from 'react-form'

import {
    ADD_CHARACTER,
    LOAD_CHARACTERS,
    SAVE_CHARACTERS,
} from './options.actions'
import { optionsReducer, optionsInitialState } from './options.reducer'
import Input from '../input'
import Form from '../form'

import './options.scss'

const Options = () => {
    const [state, dispatch] = useReducer(optionsReducer, optionsInitialState)
    const handleAddCharacter = (e) => {
        e.preventDefault()
        dispatch({ type: ADD_CHARACTER })
    }
    const handleSubmit = (values, instance) => {
        const { characters } = values

        dispatch({
            type: SAVE_CHARACTERS,
            payload: { characters },
        })
    }

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
            <Form onSubmit={handleSubmit}>
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
            {/* Purely for debugging in development */}
            <strong>Current State</strong>
            <pre>{JSON.stringify(state, null, 4)}</pre>
        </div>
    )
}

export default Options
