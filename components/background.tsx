import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Grid from './three/grid';

const Background: React.FC<{}> = () => (
  <Canvas shadows className="min-h-screen w-screen">
    <Suspense fallback={(<>Loading...</>)}>
      <Grid />
    </Suspense>
  </Canvas>
);

export default Background;
