export interface ObjectSpecs {
  position: Array<number>;
  rotation: Array<number>;
  isVisible: boolean;
  isSemiTransparent: boolean;
}

export interface MappedPlots {
  [x: number]: {
    [y: number]: PlotInfo
  }
}

export interface PlotInfo {
  isOwner: boolean,
  isPlantOwner: boolean,
  isUnminted: boolean,
  plantType: string | undefined,
  color: PlotColor
}

export interface PlotColor {
  rgb: { r: number, g: number, b: number },
  rgbHover: { r: number, g: number, b: number },
  hex: string
}
