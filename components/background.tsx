import React from 'react';
import { Canvas } from '@react-three/fiber';
import Box from './box';

const Background: React.FC<{}> = () => (
  <Canvas shadows className="min-h-screen w-screen">
    <Box />
  </Canvas>
);

export default Background;
