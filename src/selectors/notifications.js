export const getVisibleNotifications = state =>
  state.notifications.currentVisible.map(id => state.notifications.log[id])
