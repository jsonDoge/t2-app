import React, { useEffect, useRef } from 'react';
import Plot from './plot';
import Plant from './plant';
import { MappedPlots } from './utils/interfaces';
import { generateMainGrid } from './utils';

interface Props {
  mainPlotRefs: Array<Array<THREE.Mesh>>,
  centerRef: React.MutableRefObject<{ x: number, y: number }>
  onPlotSelect: (x: number, y: number) => void,
  mappedPlots: React.MutableRefObject<MappedPlots>
}

const MainPlots: React.FC<Props> = ({
  mainPlotRefs,
  centerRef,
  onPlotSelect,
  mappedPlots,
}) => {
  const plantRefs = useRef<Array<Array<THREE.Mesh>>>(generateMainGrid(7));

  useEffect(() => {
    // EVIL EVIL HACK (look for better solution once done)
    const updater = setInterval(() => {
      if (!mappedPlots.current) { return; }
      Object.keys(mappedPlots.current).forEach((x) => {
        Object.keys(mappedPlots.current[x]).forEach((y) => {
          mainPlotRefs[y][x].current.material.color = mappedPlots.current[x][y].color.rgb;
          if (mappedPlots.current[x][y]?.plantType) {
            plantRefs.current[x][y].current.position.copy(
              mainPlotRefs[y][x].current.matrixWorld.getPosition()
            );
            plantRefs.current[x][y].current.position.z = 0.2;
          } else {
            plantRefs.current[x][y].current.position.z = -5;
          }
        });
      });
    }, 1000);

    return () => { clearInterval(updater); };
  }, [JSON.stringify(mappedPlots.current)]);

  return (
    <>
      {
      mainPlotRefs.map((r, yIndex) => r.map((c, xIndex) => (
        <>
          <Plot
            reference={c}
            onPointerDown={(self) => {
              const coordinates = {
                x: centerRef.current.x + (xIndex - 3),
                y: centerRef.current.y + (yIndex - 3),
              };

              onPlotSelect(coordinates.x, coordinates.y);
            }}
            onPointerOut={(self) => {
              self.eventObject.material.color =
                mappedPlots?.current?.[xIndex]?.[yIndex]?.color?.rgb;
            }}
            onPointerOver={(self) => {
              self.eventObject.material.color =
                mappedPlots?.current?.[xIndex]?.[yIndex]?.color?.rgbHover;
            }}
          />
          <Plant reference={plantRefs?.current[xIndex][yIndex]} />
        </>
      )))
      }
    </>
  );
};

export default MainPlots;
