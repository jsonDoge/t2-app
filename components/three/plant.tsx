import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

interface Props {
  reference: any,
}

useGLTF.preload('/plant.gltf');

const Plant: React.FC<Props> = ({
  reference,
}) => {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('/plant.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  useEffect(() => {
    // TODO: find better way to assign reference
    if (reference) {
      reference.current = meshRef.current;
    }
  }, [reference]);

  return (
    <mesh
      position={[-100, -100, -100]} // so wouldnt appear in 0/0/0 initially
      ref={meshRef}
      scale={[0.3, 0.3, 0.3]}
      rotation={[90 * (Math.PI / 180), 0, 0]}
      castShadow
      receiveShadow
      geometry={nodes.Cube.geometry}
      material={materials.Material}
    />
  );
};

export default Plant;
