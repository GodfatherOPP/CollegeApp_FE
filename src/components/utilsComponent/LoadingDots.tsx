import { Stack } from '@mui/material'
import React from 'react'

const LoadingDots = () => {
  const pointerColor = '#555'
  const size = '3px'

  return (
    <Stack
      direction='row'
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: ' 100%',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        zIndex: '100000',
        '& .loader__element': {
          borderRadius: ' 100%',
          border: `${size} solid ${pointerColor}`,
          margin: `calc(${size}*2)`
        },

        '& .loader__element:nth-child(1)': {
          animation: 'preloader .6s ease-in-out alternate infinite'
        },
        '& .loader__element:nth-child(2)': {
          animation: 'preloader .6s ease-in-out alternate .2s infinite'
        },

        '& .loader__element:nth-child(3)': {
          animation: 'preloader .6s ease-in-out alternate .4s infinite'
        },
        '@keyframes preloader': {
          '100%': { transform: 'scale(2)' }
        }
      }}
    >
      <span className='loader__element'></span>
      <span className='loader__element'></span>
      <span className='loader__element'></span>
    </Stack>
  )
}

export default LoadingDots
