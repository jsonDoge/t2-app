import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/potato.gltf');

const Potato: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/potato.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  return (
    <group ref={group} {...props}>
      <mesh
        scale={[0.1, 0.1, 0.1]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      />
    </group>
  );
};

export default Potato;
