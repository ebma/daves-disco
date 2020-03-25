import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"

export const breakpoints = createBreakpoints({})

export const brandColor = {
  dark: "#b92b27",
  main: "#039be5",
  light: "#fa669d"
}

export const textColorDark = {
  primary: "#FFFFFF",
  secondary: "#d81b60"
}

export const textColorLight = {
  primary: "#212121",
  secondary: "#d81b60"
}

export const backgroundColor = {
  dark: "#212121",
  light: "#E0E0E0"
}

const createTheme = (darkMode: boolean) =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: darkMode ? "dark" : "light",
        primary: {
          dark: brandColor.dark,
          main: brandColor.main,
          light: brandColor.light
        },
        text: {
          primary: darkMode ? textColorDark.primary : textColorLight.primary,
          secondary: darkMode ? textColorDark.secondary : textColorLight.secondary
        }
      },
      overrides: {
        MuiPaper: {},
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
