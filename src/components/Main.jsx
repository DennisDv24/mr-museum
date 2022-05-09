import { 
	Heading, Center, Box,
	Button, VStack,
} from '@chakra-ui/react';
import WalletHandler from './WalletHandler.jsx';

const Main = () => (
	<Center>
		<VStack 
			w='md'
			p={3}
		>
		<Center
			w='100%'
			borderWidth='1px'
			borderRadius='lg'
			overflow='hidden'
			as='h1'
			fontSize='4xl'
			fontWeight='bold'
		>
			Mr. Museum
		</Center>
		<WalletHandler />
		<Box pt={200}>
			Hecho por #6640
		</Box>
		</VStack>
	</Center>
);

export default Main;
