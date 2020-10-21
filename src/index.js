import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'

import Options from './components/options'

const App = () => (
    <>
        <CssBaseline />
        <Options />
    </>
)

ReactDOM.render(<App />, document.getElementById('root'))
