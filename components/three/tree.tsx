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
    if (props.reference) {
      props.reference.current = group.current;
      const { position } = props.reference.current;
      ([position.x, position.y, position.z] = [-100, -100, -100]);
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
