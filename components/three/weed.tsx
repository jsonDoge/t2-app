import React from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/weed.gltf');

const Weed: React.FC<{}> = (props) => {
  const { nodes, materials } = useGLTF('/weed.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  return (
    <mesh
      scale={[0.07, 0.07, 0.07]}
      rotation={[90 * (Math.PI / 180), 0, 0]}
      castShadow
      receiveShadow
      geometry={nodes.Cube.geometry}
      material={materials.Material}
      {...props}
    />
  );
};

export default Weed;
