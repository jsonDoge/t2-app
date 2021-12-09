import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/grass1.gltf');

const Grass1: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/grass1.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  return (
    <group ref={group} {...props}>
      <mesh
        scale={[0.07, 0.07, 0.07]}
        rotation={[90 * (Math.PI / 180), 0, 0]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      />
    </group>
  );
};

export default Grass1;
