declare module "react-router-transition" {
  export class AnimatedSwitch extends React.Component<any> {}
}

declare module "colorthief" {
  export type Color = [number, number, number]
  export type ColorArray = Color[]
  export default class ColorThief {
    getPalette(image: Element, colorCount?: number, quality?: number): ColorArray
    getColor(image: Element, quality?: number): Color
  }
}
