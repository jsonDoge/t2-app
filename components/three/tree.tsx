import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/tree.gltf');

interface Props {
  reference: any
}

const Tree: React.FC<Props> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/tree.gltf');

  useEffect(() => {
    // TODO: find better way to assign reference
    if (props.reference) {
      props.reference.current = group.current;
    }
  }, [props.reference]);

  return (
    <group>
      <mesh
        ref={group}
        scale={[0.5, 0.5, 0.5]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      >
        <meshStandardMaterial
          {...materials.Material}
        />
      </mesh>
    </group>
  );
};

export default Tree;
