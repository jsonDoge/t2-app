import React, { useCallback, useEffect, useRef } from 'react';
import { PlotColor, PlotInfo } from './utils/interfaces';
import { getDefaultPlotColor, getPlotColor } from './utils/plotColors';

interface Props {
  reference: any,
  onPointerDown?: (self: any) => void,
  plotInfo: PlotInfo
}

const Plot: React.FC<Props> = ({
  reference,
  onPointerDown = (self) => {},
  plotInfo,
}) => {
  const materialRef = useRef();

  const getPlotColorOrDefault = (pi: PlotInfo) => {
    if (!pi) {
      return getDefaultPlotColor();
    }
    return getPlotColor(
      pi.isOwner,
      pi.isPlantOwner,
      pi.isUnminted,
    );
  };

  const onPointerOver = useCallback((self) => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);
    self.eventObject.material.color = pc.colorHover;
  }, [JSON.stringify(plotInfo)]);

  const onPointerOut = useCallback((self) => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);
    self.eventObject.material.color = pc.color;
  }, [JSON.stringify(plotInfo)]);

  useEffect(() => {
    const pc: PlotColor = getPlotColorOrDefault(plotInfo);

    materialRef.current.color = pc.color;
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
        <meshStandardMaterial ref={materialRef} />
      </mesh>
    </>
  );
};

export default Plot;
