import { 
	Button, Modal, ModalOverlay,
	ModalContent, ModalHeader, ModalCloseButton,
	ModalFooter, useDisclosure, ModalBody,
	Box, Image, Input,
	Grid, InputGroup, InputRightElement
} from '@chakra-ui/react';
import { useState } from 'react';
import MrCryptoABI from './mrCrypto.js';
import { ethers } from 'ethers';

import axios from 'axios';

const mrCryptoAddr = '0xeF453154766505FEB9dBF0a58E6990fd6eB66969';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new ethers.Contract(mrCryptoAddr, MrCryptoABI, signer);

const RPC = "https://polygon-mainnet.infura.io/v3/2b0748dfb0fb40af996afae36875897c";
const infuraProv = new ethers.providers.JsonRpcProvider(RPC);
const contractWithoutSigner = new ethers.Contract(mrCryptoAddr, MrCryptoABI, infuraProv);

const rarities = require('./rarity.json');

const userHasAnWallet = () => window.ethereum;

// NOTE this should not be hardcoded
const minRarity = 0.01*0.01*0.001*0.001*0.02*0.02;
const maxRarity = 0.49*0.11*0.7*0.1*0.27*0.37;

const requestConnectionAndThen = callback => {
	window.ethereum.request({method: 'eth_requestAccounts'}).then(
		callback
	)
}



const WalletHandler = () => {

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [currentTokens, setCurrentTokens] = useState([]);

	const getUserTokens = async addr => {
		
		const addrBal = await contract.balanceOf(addr);
		let ids = [];
		for(let i = 0; i < addrBal; i++) {
			const id = await contract.tokenOfOwnerByIndex(addr, i);
			ids.push(id);
		}	
		
		let tokensMetadata = [];
		for (const id of ids) {
			const thisIdUri = await contract.tokenURI(id);
			const metadata = await axios.get(thisIdUri);
			tokensMetadata.push(metadata);
		}
		setCurrentTokens(tokensMetadata);
	}


	const changeAccountHandle = acc => {
		setDefaultAccount(acc);
		getUserTokens(acc);
	}

	const connectWalletHandler = callback => {
		if (userHasAnWallet()){
			requestConnectionAndThen(result => changeAccountHandle(result[0]));
		}
		else callback();
	}
		
	const computeRarityPercent = data => {
		let sum = 1;
		for(const att in data.attributes) {
			const currentAtt = data.attributes[att];
			const currentPercent = rarities[currentAtt.trait_type][currentAtt.value];
			sum = sum * (1/currentPercent);
		}
		return sum;
	}

	const computeRarity = data => {
		const percent = computeRarityPercent(data);
		return (10 * percent) / maxRarity;
	}
	
	const handleClick = async () => {
		let n = parseInt(idInputVal);	
		console.log(n);
		if(n < 0 || n > 9999 || isNaN(n))
			setIdInputVal('No es una ID')
		else {
			const thisIdUri = await contractWithoutSigner.tokenURI(n);
			console.log(thisIdUri);
			const metadata = await axios.get(thisIdUri);
			console.log(metadata);
			setCurrentTokens([metadata]);
		}


	}
	
	const [idInputVal, setIdInputVal] = useState('');
	const handleChange = event => setIdInputVal(event.target.value);
	
	const formatAddr = addr => {
		let l = addr.length;
		return addr.substring(0, 7) + '...' + addr.substring(l-7, l);
	}

	return (
		<>
		<Button
			onClick={() => connectWalletHandler(onOpen)}
			w='100%'
			p={6}
		>
			{defaultAccount === null? "Conecta tu wallet" : formatAddr(defaultAccount)}
		</Button>
			<InputGroup size='md' >
			  <Input p={6}
				  value={idInputVal}
				  onChange={handleChange}
				placeholder='O introduzca la ID aquí'
			  />
			<InputRightElement py={6} w='6rem' mr={1} >
				<Button size='sm' onClick={handleClick}>
					Ver rareza
				</Button>
			  </InputRightElement>
			</InputGroup>

		{currentTokens !== null ? 
			currentTokens.map(token => (
				<>
				<Image src={token.data.image} />
					<Box>Id: {token.data.edition}</Box>
					<Box>Rareza: {computeRarity(token.data)}</Box>
				</>
			)) : null
		}

      	<Modal isOpen={isOpen} onClose={onClose}>
        	<ModalOverlay />
        	<ModalContent>
        		<ModalHeader>Error</ModalHeader>
        		<ModalCloseButton />
          		<ModalBody>
					Necesita una wallet de Polygon para 
					poder conectarse.
          		</ModalBody>
        	</ModalContent>
      	</Modal>
		</>
	);
}


export default WalletHandler;
