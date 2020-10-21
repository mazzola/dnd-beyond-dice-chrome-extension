import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Input from '../input'

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: '10px',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    title: {
        fontSize: 28,
    },
}))

const patterns = {
    discord: /^https:\/\/discord\.com\/api\/webhooks\//,
    ddb: /^https:\/\/www\.dndbeyond\.com\/profile\/(\w|\d)+\/characters\/\d+$/,
}

const Form = ({ character }) => {
    const classes = useStyles()
    const [ddbUrl, setDdbUrl] = useState(character.ddbUrl)
    const [discordUrl, setDiscordUrl] = useState(character.discordUrl)
    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: write to chrome storage
        console.log('submitting', { ddbUrl, discordUrl })
    }
    console.log(ddbUrl, discordUrl)
    return (
        <form onSubmit={handleSubmit}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        Rabbit
                    </Typography>
                </CardContent>
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
                <Button type="submit">Save</Button>
            </Card>
        </form>
    )
}

export default Form
