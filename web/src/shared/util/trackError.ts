// tslint:disable: no-console
export function trackError(error: Error | string, context?: string) {
  if (context) {
    console.error("Context:", context, "||", error)
  } else {
    console.error(error)
  }
}
