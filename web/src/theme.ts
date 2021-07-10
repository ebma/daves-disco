import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"

export const breakpoints = createBreakpoints({})

export const lightShades = {
  dim: "#F0F0F0",
  bright: "#F4F4F4",
  brightTransparent: "#F4F4F499",
  brightest: "#FFFFFF"
}

export const darkShades = {
  dim: "#303030",
  bright: "#3d3d3d",
  brightTransparent: "#3d3d3d99",
  brightest: "#484848"
}

export const primaryColor = {
  main: "#c62828",
  light: "#ff5f52",
  dark: "#8e0000"
}

export const secondaryColor = {
  main: "#dd2c00",
  light: "#ff6434",
  dark: "#a30000"
}
export const textColorDark = {
  primary: "#FFFFFF",
  secondary: secondaryColor.main
}

export const textColorLight = {
  primary: "#212121",
  secondary: secondaryColor.main
}

const createTheme = (darkMode: boolean) =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: darkMode ? "dark" : "light",
        primary: primaryColor,
        text: {}
      },
      overrides: {
        MuiPaper: {
          root: {
            backgroundColor: darkMode ? darkShades.brightTransparent : lightShades.brightTransparent
          }
        },
        MuiTab: {
          root: {
            [breakpoints.down("sm")]: {
              fontSize: "0.7rem"
            }
          }
        }
      }
    })
  )

export default createTheme
