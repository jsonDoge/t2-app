export const getAllCoordinatesAround = (x: number, y: number) => {
  const coordinates = [];
  for (let dy = -3; dy < 4; dy += 1) {
    for (let dx = -3; dx < 4; dx += 1) {
      const sumX = x + dx;
      const sumY = y + dy;
      if (sumX > 999 || sumY > 999 || sumX < 0 || sumY < 0) { continue; }
      coordinates.push({ x: sumX, y: sumY });
    }
  }
  return coordinates;
};
