import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import Plant from './plant';
import { PlotColor, PlotInfo } from './utils/interfaces';
import { getDefaultPlotColor, getPlotColor } from './utils/plotColors';

interface Props {
  reference: any,
  onPointerDown?: (self: any) => void,
  plotInfo: PlotInfo | undefined
}

const Plot: React.FC<Props> = ({
  reference,
  onPointerDown = (self) => {},
  plotInfo,
}) => {
  const materialRef = useRef();
  const plantRef = useRef();

  const getPlotColorOrDefault = (pi: PlotInfo | undefined) => {
    if (!pi) {
      return getDefaultPlotColor();
    }
    return getPlotColor(
      pi.isOwner,
      pi.isPlantOwner,
      pi.isUnminted,
    );
  };

  useEffect(() => {
    if (!plotInfo?.plantType) { return; }
    if (!reference?.current) { return; }

    plantRef.current.position.copy(reference.current.matrixWorld.getPosition());
    plantRef.current.position.z = 0.2;
  }, [JSON.stringify(plotInfo), JSON.stringify(reference)]);

  const onPointerOver = useCallback((self) => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);

    self.eventObject.material.color = pc.colorHover;
  }, [JSON.stringify(plotInfo)]);

  const onPointerOut = useCallback((self) => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);

    self.eventObject.material.color = pc.color;
  }, [JSON.stringify(plotInfo)]);

  const color = useMemo(() => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);

    return pc.hex;
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
        <meshStandardMaterial ref={materialRef} color={color} />
      </mesh>
      {
        plotInfo?.plantType
          && <Plant reference={plantRef} />
      }
    </>
  );
};

export default Plot;
