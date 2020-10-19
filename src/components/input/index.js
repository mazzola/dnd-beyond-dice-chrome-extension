import React from 'react'
import { useField } from 'react-form'
import startCase from 'lodash/startCase'

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
            <label>{startCase(fieldName).toUpperCase()}</label>
            <br />
            <input type={inputType} {...getInputProps()} />
        </div>
    )
}

export default Input
