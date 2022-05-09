import { Suspense } from "react";

import { 
	AspectRatio, Box
} from '@chakra-ui/react';

import { Image } from '@chakra-ui/react';
import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const scene = new THREE.Scene();

const FloatingImage = ({ src }) => {
	
	const colorMap = useLoader(TextureLoader, './test.png');
	//var loader = new TextureLoader();
	//loader.crossOrigin = '';
	//const colorMap = loader.load(src);


	return (
		<Box w='100%' h='400px'>
		<Canvas clasName="canvas">
			<OrbitControls enableZoom={true} />
			<ambientLight intensity={0.5} />
			<directionalLight position={[-2, 5, 2]} />
			<Suspense fallback={null}>

				<mesh map={colorMap}
					rotation={[0, 0, 0]}
				>
					<planeBufferGeometry attach='geometry' args={[5,5]}/>
					{/*<boxBufferGeometry attach='geometry' args={[3,3,3]} />*/}
					<meshNormalMaterial />
					<meshStandardMaterial map={colorMap} side={THREE.DoubleSide} />
				</mesh>

			</Suspense>
		</Canvas>
		</Box>
	);
}

export default FloatingImage;

