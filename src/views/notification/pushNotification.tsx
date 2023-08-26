import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import IconifyIcon from 'src/@core/components/icon'

export type NotificationsType = {
  title: string
  body: {
    title: string
    userId: string
    description: string
    url: string
    notification_type: string
  }
}

const PushNotification = ({ notification }: { notification: NotificationsType }) => {
  toast.info(<Display />, {
    icon: <IconifyIcon fontSize='1.25rem' icon='mdi:bell-outline' />,
    theme: "dark"
  })
  function Display() {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
          <Typography variant='subtitle1'>
            {notification.title?.length > 25 ? `${notification.title?.slice(0, 22)}...` : notification.title}
          </Typography>
          <Typography variant='body2'>
            {notification.body.description?.length > 60
              ? `${notification?.body?.description?.slice(0, 55)} .....`
              : notification.body?.description}
          </Typography>
        </Box>
      </Box>
    )
  }

  return <ToastContainer />
}

export default PushNotification
