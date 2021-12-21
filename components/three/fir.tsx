import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/fir.gltf');

const Fir: React.FC<{}> = (props) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/fir.gltf');

  materials.Material.visible = props.visible !== undefined
    ? props.visible
    : true;

  useEffect(() => {
    // TODO: find better way to assign reference
    if (props.reference) {
      props.reference.current = group.current;
    }
  }, [props.reference]);


  // TODO: will be used for making transparen
  // materials.Material.transparent = true;
  // materials.Material.opacity = 1;

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

export default Fir;
