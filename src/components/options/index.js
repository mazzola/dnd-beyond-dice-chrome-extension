import React, { useState, useReducer, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'

import Input from '../input'
import Form from '../form'
import {
    optionsReducer,
    initialState,
    LOAD_OPTIONS,
    ADD_NEW_CHARACTER,
    SAVE_CHARACTER,
    REMOVE_CHARACTER,
} from './options.reducer'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(3),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))

const Options = () => {
    const classes = useStyles()
    const [state, dispatch] = useReducer(optionsReducer, initialState)

    useEffect(() => {
        chrome.storage.sync.get(null, ({ diceBot }) => {
            console.log('loading options from chrome storage...', diceBot)

            // handles loading from a clean slate vs one that's been initialized by a previous run of the options page
            dispatch({ type: LOAD_OPTIONS, payload: diceBot || initialState })
        })
    }, [])

    return (
        <>
            <div className={classes.root}>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Tabletop Sagas Dice Roller
                        </Typography>
                        <Link
                            color="inherit"
                            href="https://www.twitch.tv/tabletopsagas"
                        >
                            Twitch
                        </Link>
                    </Toolbar>
                </AppBar>
            </div>
            <Box mx="25vw">
                {state.characters &&
                    state.characters.map((c, i) => (
                        <Form
                            character={c}
                            index={i}
                            onSubmit={(payload) =>
                                dispatch({ type: SAVE_CHARACTER, payload })
                            }
                            handleRemove={() =>
                                dispatch({
                                    type: REMOVE_CHARACTER,
                                    payload: { index: i },
                                })
                            }
                        />
                    ))}
                <Button onClick={() => dispatch({ type: ADD_NEW_CHARACTER })}>
                    Add new character
                </Button>
            </Box>
        </>
    )
}

export default Options
