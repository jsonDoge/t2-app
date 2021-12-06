import React, { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/tree.gltf');

interface Props {
  position: [number, number, number]
}

const Tree: React.FC<Props> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/tree.gltf');

  return (
    <group ref={group} {...props}>
      <mesh
        scale={[0.5, 0.5, 0.5]}
        rotation={[90 * (Math.PI / 180), 0, 0]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      />
    </group>
  );
};

export default Tree;
