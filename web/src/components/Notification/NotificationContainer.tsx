import React from "react"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import { NotificationsContext, Notification } from "../../context/notifications"

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

function NotificationsContainer() {
  const { notifications } = React.useContext(NotificationsContext)
  const [lastClosedNotificationID, setLastClosedNotificationID] = React.useState(0)
  const lastShownNotification = React.useRef<Notification | null>(null)

  const latestNotificationItem = notifications[notifications.length - 1] || null
  const open = latestNotificationItem && latestNotificationItem.id !== lastClosedNotificationID

  // Fall back to the values of a just-removed notification if necessary
  // Reason: Notification might still be visible / in closing transition when it suddenly gets removed
  const visibleNotification = latestNotificationItem || lastShownNotification.current

  const closeNotification = React.useCallback(() => setLastClosedNotificationID(visibleNotification.id), [
    visibleNotification
  ])

  if (latestNotificationItem && latestNotificationItem !== lastShownNotification.current) {
    lastShownNotification.current = latestNotificationItem
  }

  const onNotificationClick = React.useCallback(() => {
    if (visibleNotification && visibleNotification.onClick) {
      visibleNotification.onClick()
    }
  }, [visibleNotification])

  return (
    <>
      <Snackbar
        autoHideDuration={5000}
        onClick={onNotificationClick}
        onClose={closeNotification}
        open={open}
      >
        <Alert onClose={closeNotification} severity={visibleNotification && visibleNotification.type}>
          {visibleNotification?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default NotificationsContainer
