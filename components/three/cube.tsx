import React, { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/cube.gltf');

const Cube: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/cube.gltf');
  console.log('materials', materials);
  console.log('nodes', nodes);

  return (
    <Suspense fallback={null}>
      <group ref={group} {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadowdwww
          geometry={nodes.Cube001.geometry}
          material={materials['Material.001']}
        />
      </group>
    </Suspense>
  );
};

export default Cube;
