import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"

export const breakpoints = createBreakpoints({})

export const brandColor = {
  dark: "#d81b60",
  main: "#039be5",
  light: "#fa669d"
}

export const textColorDark = {
  primary: "#FFFFFF",
  secondary: "#f42620"
}

export const textColorLight = {
  primary: "#212121",
  secondary: "#f42620"
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
        },
        MuiAppBar: {
          colorPrimary: { backgroundColor: brandColor.dark }
        },
        MuiIconButton: {
          colorPrimary: { color: darkMode ? textColorDark.primary : textColorLight.primary }
        }
      }
    })
  )

export default createTheme
