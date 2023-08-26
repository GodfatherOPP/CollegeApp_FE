// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const [userAuth, setUserAuth] = useState<boolean>(false)
  // ** Hook
  const auth = useAuth()

  useEffect(() => {
    setUserAuth(auth.user ? true : false)
  }, [auth.user])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        {/* {userAuth && <Autocomplete hidden={hidden} settings={settings} />} */}
      </Box>

      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* {[SessionState.Initial, SessionState.Establishing, SessionState.Established].includes(incomingSessionState) &&
          callDirection === CallDirection.Inbound &&
          !IncomingCallModalToggle &&
          getObjectCount(sessions) > 0 && <OnGoingCallingstripe />} */}
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />

        {userAuth && <>{/* <ShortcutsDropdown settings={settings} shortcuts={shortcuts} /> */}</>}
      </Box>
    </Box>
  )
}

export default AppBarContent
