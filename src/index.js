import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import Options from './components/options'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#C53131',
        },
    },
})

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Options />
    </ThemeProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))
