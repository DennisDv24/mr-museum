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
			overflow='hidden'
			as='h1'
			fontSize='4xl'
			fontWeight='bold'
			  bgGradient='linear(to-l, #7928CA, #FF0080)'
			  bgClip='text'
			mb={3}
		>
			Mr. Museum
		</Center>
		<WalletHandler />
		<Box color='#7928CA' pt={200} pos='fixed' bottom={0}>
			Hecho por #6640
		</Box>
		</VStack>
	</Center>
);

export default Main;
