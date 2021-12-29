import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/grass1.gltf');

interface Props {
  reference: any
}

const Grass1: React.FC<Props> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/grass1.gltf');

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
        scale={[0.07, 0.07, 0.07]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
      >
        <meshStandardMaterial
          {...materials.Material}
        />
      </mesh>
    </group>
  );
};

export default Grass1;
