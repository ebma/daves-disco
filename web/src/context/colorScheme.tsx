import React from "react"

type ColorScheme = "dark" | "light"
const defaultScheme: ColorScheme = "dark"

export interface ColorSchemeContextType {
  toggleColorScheme: () => void
  colorScheme: ColorScheme
}

interface Props {
  children: React.ReactNode
}

const ColorSchemeContext = React.createContext<ColorSchemeContextType>({
  toggleColorScheme: () => undefined,
  colorScheme: "dark"
})

function getPreferredTheme() {
  const preferredColorScheme = localStorage.getItem("color-scheme") as ColorScheme
  return preferredColorScheme
}

export function ColorSchemeProvider(props: Props) {
  const [scheme, setScheme] = React.useState<ColorScheme>(getPreferredTheme() || defaultScheme)

  const toggleTheme = React.useCallback(() => {
    const newScheme = scheme === "dark" ? "light" : "dark"
    localStorage.setItem("color-scheme", newScheme)
    setScheme(newScheme)
  }, [scheme])

  const contextValue: ColorSchemeContextType = {
    colorScheme: scheme,
    toggleColorScheme: toggleTheme
  }
  return <ColorSchemeContext.Provider value={contextValue}>{props.children}</ColorSchemeContext.Provider>
}

export { ColorSchemeContext }
