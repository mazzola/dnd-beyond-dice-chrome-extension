import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import Input from '../input'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiCardContent-root': {
            paddingLeft: 0,
        },
        marginBottom: '10px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        fontSize: 28,
    },
}))

const patterns = {
    discord: /^https:\/\/discord\.com\/api\/webhooks\//,
    ddb: /^https:\/\/www\.dndbeyond\.com\/profile\/(\w|\d)+\/characters\/\d+$/,
}

const Form = ({ character = {}, index, onSubmit, handleRemove }) => {
    const classes = useStyles()
    const [name, setName] = useState('')
    const [ddbUrl, setDdbUrl] = useState(character.ddbUrl)
    const [discordUrl, setDiscordUrl] = useState(character.discordUrl)
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({
            index,
            character: {
                ddbUrl,
                discordUrl,
            },
        })
    }

    useEffect(() => {
        async function fetchCharacterName() {
            const htmlString = await fetch(ddbUrl).then((r) => r.text())
            const htmlDoc = new DOMParser().parseFromString(
                htmlString,
                'text/html'
            )
            const titleText = htmlDoc.querySelector('title').innerText

            setName(titleText.replace(' - D&D Beyond', ''))
        }

        fetchCharacterName()
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        {name}
                    </Typography>
                </CardContent>
                <Box mb={2}>
                    <Input
                        setValue={setDdbUrl}
                        labelText="D&D Beyond URL"
                        helperText="Invalid D&D Beyond url"
                        pattern={patterns.ddb}
                        fieldName="ddbUrl"
                        defaultValue={ddbUrl}
                    />
                    <Input
                        setValue={setDiscordUrl}
                        labelText="Discord URL"
                        helperText="Invalid Discord url"
                        pattern={patterns.discord}
                        fieldName="discordUrl"
                        defaultValue={discordUrl}
                    />
                </Box>
                <Button type="submit">Save</Button>
                <Button onClick={handleRemove}>Delete</Button>
            </Card>
        </form>
    )
}

export default Form
