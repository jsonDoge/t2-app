import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/tree.gltf');

interface Props {
  position: [number, number, number],
  visible: boolean,
  reference: any
}

const Tree: React.FC<Props> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/tree.gltf');

  materials.Material.visible = props.visible !== undefined
    ? props.visible
    : true;

  useEffect(() => {
    // TODO: find better way to assign reference
    if (props.reference) {
      props.reference.current = group.current;
    }
  }, [props.reference]);

  return (
    <group visible={props.visible}>
      <mesh
        ref={group}
        scale={[0.5, 0.5, 0.5]}
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
      />
    </group>
  );
};

export default Tree;
