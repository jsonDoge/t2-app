import React from 'react';
import Plot from './plot';
import { MappedPlots } from './utils/interfaces';

interface Props {
  mainPlotRefs: Array<Array<THREE.Mesh>>,
  centerRef: React.MutableRefObject<{ x: number, y: number }>
  onPlotSelect: (x: number, y: number) => void,
  mappedPlots: MappedPlots | {}
}

const MainPlots: React.FC<Props> = ({
  mainPlotRefs,
  centerRef,
  onPlotSelect,
  mappedPlots,
}) => (
  <>
    {
      mainPlotRefs.map((r, yIndex) => r.map((c, xIndex) => (
        <Plot
          reference={c}
          onPointerDown={(self) => {
            const coordinates = {
              x: centerRef.current.x + (xIndex - 3),
              y: centerRef.current.y + (yIndex - 3),
            };

            onPlotSelect(coordinates.x, coordinates.y);
          }}
          plotInfo={mappedPlots?.[xIndex]?.[yIndex]}
          isPrint={yIndex === 3 && xIndex === 3}
        />
      )))
      }
  </>
);

export default MainPlots;
