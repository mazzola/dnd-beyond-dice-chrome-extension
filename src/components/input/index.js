import React, { useState } from 'react'
import { useField } from 'react-form'
import TextField from '@material-ui/core/TextField'
import startCase from 'lodash/startCase'

const Input = ({
    scope,
    fieldName,
    defaultValue = '',
    index,
    inputType = 'url',
}) => {
    const [isValid, setIsValid] = useState(true)
    const pattern =
        fieldName === 'ddbUrl'
            ? /^https:\/\/www\.dndbeyond\.com\/profile\/(\w|\d)+\/characters\/\d+$/
            : /^https:\/\/discord\.com\/api\/webhooks\//
    const helperText = `Not a valid ${
        fieldName === 'ddbUrl' ? 'D&D Beyond' : 'Discord webhook'
    } url.`
    const { getInputProps } = useField(`${scope}[${index}].${fieldName}`, {
        defaultValue,
        validate: async (value, _) => setIsValid(pattern.test(value)),
    })

    return (
        <TextField
            error={!isValid}
            {...(!isValid && { helperText })}
            {...getInputProps()}
            label={startCase(fieldName).toUpperCase()}
            className="dicebot-options__character-container--input"
        />
    )
}

export default Input
