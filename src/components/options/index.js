import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'

import Input from '../input'
import Form from '../form'

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
    const [state, setState] = useState({})

    useEffect(() => {
        chrome.storage.sync.get('diceBot', ({ diceBot }) =>
            setState({ ...state, ...diceBot })
        )
    }, [])

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static">
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
                    state.characters.map((c) => <Form character={c} />)}
                {/* Purely for debugging in development */}
                <strong>Current State</strong>
                <pre>{JSON.stringify(state, null, 4)}</pre>
            </Box>
        </>
    )
}

export default Options
