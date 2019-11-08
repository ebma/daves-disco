// tslint:disable: no-console
export function trackError(error: Error | string, context?: any) {
  if (context) {
    console.error(error, context)
  } else {
    console.error(error)
  }
}
