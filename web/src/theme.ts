import { createMuiTheme } from "@material-ui/core/styles"

export const brandColor = {
  dark: "#b92b27",
  main: "#1565c0",
  light: "#fa669d"
}

export const textColorDark = {
  primary: "#FFFFFF",
  secondary: "#d81b60"
}

export const textColorLight = {
  primary: "#212121",
  secondary: "#b92b27"
}

export const backgroundColor = {
  dark: "#212121",
  light: "#E0E0E0"
}

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      dark: brandColor.dark,
      main: brandColor.main,
      light: brandColor.light
    },
    text: {
      primary: textColorDark.primary,
      secondary: textColorDark.secondary
    }
  },
  overrides: {
    MuiPaper: {}
  }
})

export default theme
