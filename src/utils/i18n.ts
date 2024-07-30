import i18n from "i18n"
import { join } from "path"

console.log("Loading i18n...")

i18n.configure({
  directory: join(__dirname, "..", "..", "locales"),
  objectNotation: true,
  register: global,
  parser: JSON,

  logWarnFn(msg: any) {
    console.log(msg)
  },

  logErrorFn(msg: any) {
    console.log(msg)
  },

  missingKeyFn(locale: any, value: any) {
    console.log("Missing key: ", value, " in locale: ", locale)
    return value
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false,
  },
})

console.log("i18n loaded", i18n.getLocales(), i18n.getCatalog())

i18n.setLocale("en")

export { i18n }
