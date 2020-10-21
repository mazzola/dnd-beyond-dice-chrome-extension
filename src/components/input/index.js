import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import startCase from 'lodash/startCase'

const Input = ({
    defaultValue = '',
    pattern,
    labelText,
    helperText,
    setValue,
}) => {
    const [isValid, setIsValid] = useState(true)
    const handleChange = (e) => {
        setValue(e.target.value)
        setIsValid(pattern.test(e.target.value))
    }

    return (
        <TextField
            defaultValue={defaultValue}
            onChange={handleChange}
            error={!isValid}
            {...(!isValid && { helperText })}
            label={labelText}
            className="dicebot-options__character-container--input"
        />
    )
}

export default Input
