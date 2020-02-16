import React from "react"

export type NotificationType = "error" | "warning" | "info" | "success"

export interface Notification {
  id: number
  message: string
  type: NotificationType
  onClick?: () => void
}

// tslint:disable-next-line
let trackErrorImplementation: (error: any) => void = console.error

export function trackError(error: any) {
  trackErrorImplementation(error)
}

interface NotificationOptions {
  onClick?: () => void
}

export interface NotificationContextType {
  notifications: Notification[]
  showError(error: any): void
  showNotification(type: NotificationType, message: string, props?: NotificationOptions): void
}

interface Props {
  children: React.ReactNode
}

const NotificationsContext = React.createContext<NotificationContextType>({
  notifications: [],
  showError: () => undefined,
  showNotification: () => undefined
})

export function NotificationsProvider(props: Props) {
  // Not in the state, since state updates would be performed asyncronously
  const nextIDRef = React.useRef(1)
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const showNotification = (type: NotificationType, message: string, options: NotificationOptions = {}) => {
    const id = nextIDRef.current++

    setNotifications(prevNotifications => prevNotifications.concat({ ...options, id, message, type }))
  }
  
  const showError = (error: any) => {
    showNotification("error", String(error.message || error))
    
    // tslint:disable-next-line:no-console
    console.error(error)
  }

  trackErrorImplementation = showError

  const contextValue: NotificationContextType = {
    showError,
    showNotification,
    notifications
  }
  return <NotificationsContext.Provider value={contextValue}>{props.children}</NotificationsContext.Provider>
}

export { NotificationsContext }
