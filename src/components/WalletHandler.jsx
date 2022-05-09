import { 
	Button, Modal, ModalOverlay,
	ModalContent, ModalHeader, ModalCloseButton,
	ModalFooter, useDisclosure, ModalBody,
	Box, Input,
	Grid, InputGroup, InputRightElement,
	Text, Flex, Spacer,
	Spinner, Image
} from '@chakra-ui/react';
import { useState } from 'react';
import MrCryptoABI from './mrCrypto.js';
import { ethers } from 'ethers';
import FloatingImage from './FloatingImage';

import axios from 'axios';

const mrCryptoAddr = '0xeF453154766505FEB9dBF0a58E6990fd6eB66969';

let provider; 
let signer; 
try {
	provider = new ethers.providers.Web3Provider(window.ethereum);
	signer = provider.getSigner();
} catch (e) {
	console.log('User without an wallet');
}

const contract = new ethers.Contract(mrCryptoAddr, MrCryptoABI, signer);

const RPC = "https://polygon-mainnet.infura.io/v3/2b0748dfb0fb40af996afae36875897c";
const infuraProv = new ethers.providers.JsonRpcProvider(RPC);
const contractWithoutSigner = new ethers.Contract(mrCryptoAddr, MrCryptoABI, infuraProv);

const rarities = require('./rarity.json');

const userHasAnWallet = () => window.ethereum;

// NOTE this should not be hardcoded
const maxRarity = 204;




const WalletHandler = () => {

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [currentTokens, setCurrentTokens] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentIds, setCurrentIds] = useState([]);
	
	const requestConnectionAndThen = callback => {
		window.ethereum.request({method: 'eth_requestAccounts'}).then(
			callback
		).catch(e => setLoading(false))
	}

	const getUserToken = async (id, contract) => {
		try {
			const thisIdUri = await contract.tokenURI(id);
			const metadata = await axios.get(thisIdUri);
			return metadata;
		} catch (e) {
			return getUserToken(id, contract);
		}
	}

	const getUserTokens = async addr => {

		const addrBal = await contract.balanceOf(addr);
		let ids = [];
		for(let i = 0; i < addrBal; i++) {
			const id = await contract.tokenOfOwnerByIndex(addr, i);
			ids.push(id);
		}	
		setCurrentIds(ids);

		let tokensMetadata = [];
		for (const id of ids) {
			tokensMetadata.push(await getUserToken(id, contract));
		}
		setCurrentTokens(tokensMetadata);
	}


	const changeAccountHandle = async acc => {
		setDefaultAccount(acc);
		await getUserTokens(acc);
		setLoading(false);
	}

	const connectWalletHandler = callback => {
		if(loading) return;
		if (userHasAnWallet()){
			setLoading(true);
			requestConnectionAndThen(result => changeAccountHandle(result[0]));
		}
		else callback();
	}
		
	const handleClick = async () => {
		if(loading) return;
		setLoading(true);
		let n = parseInt(idInputVal);	
		if(n < 1 || n > 10000 || isNaN(n))
			setIdInputVal('No es una ID válida')
		else {
			setCurrentIds([n])
		}

	}
	
	const [idInputVal, setIdInputVal] = useState('');
	const handleChange = event => setIdInputVal(event.target.value);
	
	const formatAddr = addr => {
		let l = addr.length;
		return addr.substring(0, 7) + '...' + addr.substring(l-7, l);
	}

	const getColorBasedOnRarity = (id) => {
		let r = rarities[id]['rank'];
		if (r > 9000) 
			return 'linear(to-l, #7928CA, #FF0080)';
		if (r <= 9000 && r > 5000)
			return 'linear(to-l, #dd5e89, #f7bb97)';
		return 'linear(to-l, #42275a, #734b6d)'
	}
	
	const getImages = (ids) => {
		if(ids.length > 0) {
			let x = ids.map(id => (
				<>
					<Image 
						src={rarities[id]['image']} 
						borderRadius='lg'
					/>
					<Box 
						fontSize='2xl' 
						fontWeight='bold'
					>
						Id: {id}
					</Box>
					<Box 
						fontSize='2xl'
						fontWeight='bold'
					>
						<Flex>
						<Box mr={2}>Rareza: top</Box><Box
						  bgGradient={getColorBasedOnRarity(rarities[id]['rank'])}
						  bgClip='text'
						>{rarities[id]['rank']}</Box>
						</Flex>
					</Box>
				</>
			));
			//setLoading(false);
			return x;
		}
	}

	const loadImages = ids => {
		return (
			<>
				<Spinner />
				{getImages(currentIds)}
			</>
		);
	}

	return (
		<>
		<Button
			onClick={() => connectWalletHandler(onOpen)}
			w='100%'
			p={6}
			colorScheme='red'
			variant='outline'
		>
			{defaultAccount === null? "Conecta tu wallet" : formatAddr(defaultAccount)}
		</Button>
			<InputGroup size='md' >
			  <Input 
				  p={6}
				  value={idInputVal}
				  onChange={handleChange}
				placeholder='O introduzca la ID aquí'
			  />
			<InputRightElement py={6} w='6rem' mr={1} >
				<Button 
					size='sm' 
					onClick={handleClick}
				  	colorScheme='red'
					variant='outline'
				>
					Ver rareza
				</Button>
			  </InputRightElement>
			</InputGroup>

			{loading ? <Spinner /> : null} 
			{getImages(currentIds)}


      	<Modal isOpen={isOpen} onClose={onClose}>
        	<ModalOverlay />
        	<ModalContent>
        		<ModalHeader>Error</ModalHeader>
        		<ModalCloseButton />
          		<ModalBody pb={6}>
					Necesita una wallet de Polygon para 
					poder conectarse.
          		</ModalBody>
        	</ModalContent>
      	</Modal>
		</>
	);
}


export default WalletHandler;
