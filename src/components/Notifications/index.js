import React, { PropTypes } from 'react'

import './Notifications.less'

const Notifications = ({ notifications, onClick }) => (
  <div className="notifications">
    {notifications.map(({ id, title, icon, message }) => (
      <div key={id} className="notification" onClick={() => onClick()}>
        <div className="notification__title">
          {title}
        </div>
        <div className="notification__icon">
          <div className={`icon icon--${icon}`} />
        </div>
        <div className="notification__message">
          {message}
        </div>
      </div>
      ))}
  </div>
  )

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
}

export default Notifications
