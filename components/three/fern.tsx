import React, { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/fern.gltf');

const Fern: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/fern.gltf');
  materials.Material.transparent = true;
  materials.Material.opacity = 1;

  return (
    <Suspense fallback={null}>
      <group ref={group} {...props} dispose={null}>
        <mesh
          scale={[0.5, 0.5, 0.5]}
          rotation={[90 * (Math.PI / 180), 0, 0]}
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
        />
      </group>
    </Suspense>
  );
};

export default Fern;
