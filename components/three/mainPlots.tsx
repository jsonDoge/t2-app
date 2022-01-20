import React, { useEffect, useRef } from 'react';
import Plot from './plot';
import Plant from './plant';
import { MappedPlots } from './utils/interfaces';
import { generateMeshRefGrid } from './utils';
import WeedGroup from './weedGroup';
import plantTypes from '../../constants/plantTypes';

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
  const lastMappedPlot = useRef('');
  const plantRefs = useRef<Array<Array<THREE.Mesh>>>(generateMeshRefGrid(7));
  const weedRefs = useRef<Array<Array<THREE.Mesh>>>(generateMeshRefGrid(7));

  const setPlotItem = (plantType, itemRef, plotRef) => {
    if (plantType) {
      itemRef.position.copy(plotRef.matrixWorld.getPosition());
      itemRef.position.z = 0.2;
    } else {
      itemRef.position.z = -5;
    }
  };

  useEffect(() => {
    // EVIL EVIL HACK (look for better solution once done)
    const updater = setInterval(() => {
      if (!mappedPlots.current) { return; }
      if (JSON.stringify(mappedPlots.current) === lastMappedPlot.current) { return; }
      lastMappedPlot.current = JSON.stringify(mappedPlots.current);

      Object.keys(mappedPlots.current).forEach((x) => {
        Object.keys(mappedPlots.current[x]).forEach((y) => {
          mainPlotRefs[y][x].current.material.color = mappedPlots.current[x][y].color.rgb;

          setPlotItem(
            mappedPlots.current[x][y]?.plantType &&
              mappedPlots.current[x][y]?.plantType !== plantTypes.WEED,
            plantRefs.current[x][y].current,
            mainPlotRefs[y][x].current,
          );

          setPlotItem(
            mappedPlots.current[x][y]?.plantType === plantTypes.WEED,
            weedRefs.current[x][y].current,
            mainPlotRefs[y][x].current,
          );
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
          <WeedGroup reference={weedRefs?.current[xIndex][yIndex]} />
        </>
      )))
      }
    </>
  );
};

export default MainPlots;
