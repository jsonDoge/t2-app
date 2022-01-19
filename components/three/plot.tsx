import React from 'react';
import { getDefaultPlotColor } from './utils/plotColors';

interface Props {
  reference: any,
  onPointerDown?: (self: any) => void,
  onPointerOut?: (self: any) => void,
  onPointerOver?: (self: any) => void,
}

const Plot: React.FC<Props> = ({
  reference,
  onPointerDown = (self) => {},
  onPointerOut = (self) => {},
  onPointerOver = (self) => {},
}) => {
  const defaultColor = getDefaultPlotColor();

  return (
    <>
      <mesh
        ref={reference}
        castShadow
        receiveShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
      >
        <boxGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial
          color={defaultColor.hex}
        />
      </mesh>
    </>
  );
};

export default Plot;
