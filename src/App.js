import Main from './components/Main.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import mainTheme from './theme.js';


const App = () => {
	return (
		<ChakraProvider theme={mainTheme}>
	  		<Main />
		</ChakraProvider>
  	);
}

export default App;
