import React from 'react';
import { Canvas } from '@react-three/fiber';
import Grid from './three/grid';

const Background: React.FC<{}> = () => (
  <Canvas shadows className="min-h-screen w-screen">
    <Grid />
  </Canvas>
);

export default Background;
