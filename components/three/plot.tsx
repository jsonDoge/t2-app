import React, {
  useCallback, useEffect, useRef,
} from 'react';
import Plant from './plant';
import { PlotInfo } from './utils/interfaces';
import { getDefaultPlotColor } from './utils/plotColors';

interface Props {
  reference: any,
  onPointerDown?: (self: any) => void,
  plotInfo: PlotInfo | undefined,
  isPrint: boolean,
}

const Plot: React.FC<Props> = ({
  reference,
  onPointerDown = (self) => {},
  plotInfo,
  isPrint = false,
}) => {
  const plantRef = useRef();
  const defaultColor = getDefaultPlotColor();


  useEffect(() => {
    if (!plotInfo?.plantType) { return; }
    if (!reference?.current) { return; }
    if (!plantRef?.current) { return; }

    if (isPrint) {
      console.log('USE EFFECT TRIGGERED FOR TREEE');
    }

    plantRef.current.position.copy(reference.current.matrixWorld.getPosition());
    plantRef.current.position.z = 0.2;
  }, [JSON.stringify(plotInfo), JSON.stringify(reference), JSON.stringify(plantRef)]);

  const onPointerOver = useCallback((self) => {
    self.eventObject.material.color = plotInfo?.color?.rgbHover;
  }, [JSON.stringify(plotInfo)]);

  const onPointerOut = useCallback((self) => {
    self.eventObject.material.color = plotInfo?.color?.rgb;
  }, [JSON.stringify(plotInfo)]);

  useEffect(() => {
    if (!reference?.current?.material) { return; }
    if (!plotInfo?.color) { return; }

    reference.current.material.color = plotInfo?.color?.rgb;
  }, [JSON.stringify(plotInfo)]);

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
      {
        plotInfo?.plantType
          && <Plant reference={plantRef} />
      }
    </>
  );
};

export default Plot;
