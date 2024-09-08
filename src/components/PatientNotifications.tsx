import axios from 'axios'
import React, { useState, useEffect } from 'react'

// Define Notification Type
interface Notification {
  id: string;
  date: string;
  message: string;
  type?: string;
}

function PatientNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get<{ notifications: Notification[] }>('/api/controllers/patient/notifications')
        setNotifications(response.data.notifications)
      } catch (error) {
        setError('Failed to fetch notifications.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  // Formatting Date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto p-4 bg-blue-950">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Loading Indicator */}
      {loading && <p>Loading notifications...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Notifications List */}
      {!loading && notifications.length === 0 && (
        <p>No notifications to display.</p>
      )}

      {!loading && notifications.length > 0 && (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-4 bg-white rounded shadow-md"
            >
              <p className="text-gray-700">{notification.message}</p>
              <p className="text-sm text-gray-500">
                {formatDate(notification.date)}
              </p>
              {notification.type && (
                <span className="text-xs text-gray-400">
                  Type: {notification.type}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PatientNotifications
