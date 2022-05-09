// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
}

// 3. extend the theme
const mainTheme = extendTheme({ config })

export default mainTheme 
