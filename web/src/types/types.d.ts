declare module "react-router-transition" {
  export class AnimatedSwitch extends React.Component<any> {}
}

declare module "colorthief" {
  type Color = [number, number, number]
  export type ColorArray = Array<Color>
  export default class ColorThief {
    getPalette(image: Element, colorCount?: number, quality?: number): ColorArray
  }
}
