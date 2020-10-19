import React from 'react'
import { useForm } from 'react-form'

const Form = ({ onSubmit, children }) => {
    const { Form } = useForm({ onSubmit })

    return <Form>{children}</Form>
}

export default Form
