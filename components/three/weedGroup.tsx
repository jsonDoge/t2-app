import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import Weed from './weed';

interface Props {
  reference: any,
}

const WeedGroup: React.FC<Props> = ({
  reference,
}) => {
  const group = useRef();

  useEffect(() => {
    // TODO: find better way to assign reference
    if (reference) {
      reference.current = group.current;
    }
  }, [reference]);

  const memoFactory = (relativeVector) => useMemo(
    () => (group?.current?.position
      ? relativeVector
      : { x: 0, y: 0, z: -10 }),
    [JSON.stringify(group?.current?.position)],
  );

  const weedPosition1 = memoFactory(new THREE.Vector3(0.5, 0.3, 0));
  const weedPosition2 = memoFactory(new THREE.Vector3(-0.5, 0.3, 0));
  const weedPosition3 = memoFactory(new THREE.Vector3(0.7, -0.3, 0));
  const weedPosition4 = memoFactory(new THREE.Vector3(-0.5, -0.3, 0));
  const weedPosition5 = memoFactory(new THREE.Vector3(0, -0.7, 0));

  return (
    <group
      ref={group}
      position={[-100, -100, -100]} // so wouldnt appear in 0/0/0 initially
    >
      <Weed position={weedPosition1} />
      <Weed position={weedPosition2} />
      <Weed position={weedPosition3} />
      <Weed position={weedPosition4} />
      <Weed position={weedPosition5} />
    </group>
  );
};

export default WeedGroup;
