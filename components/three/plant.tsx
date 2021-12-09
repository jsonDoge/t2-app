import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/plant.gltf');

const Plant: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/plant.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  return (
    <group ref={group} {...props}>
      <mesh
        scale={[0.3, 0.3, 0.3]}
        rotation={[90 * (Math.PI / 180), 0, 0]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      />
    </group>
  );
};

export default Plant;
