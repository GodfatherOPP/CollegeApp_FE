// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'
import MasterAdminNavigation from 'src/navigation/vertical/masterAdminNav'
import AdminNavigation from 'src/navigation/vertical/adminNav'
import AgentNavigation from 'src/navigation/vertical/agentNav'
import StudentNavigation from 'src/navigation/vertical/studentNav'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import OnlySideBarLayout from 'src/@core/layouts/OnlySideBarLayout'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const BasicLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const userRoles = JSON.parse(window.localStorage.getItem('userRoles') || '{}')

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  const getNavigationOptions = () => {
    switch (userRoles.id) {
      case 1:
        return MasterAdminNavigation()
        break
      case 2:
        return AdminNavigation()
        break
      case 3:
        return AgentNavigation()
        break
      case 4:
        return StudentNavigation()
        break
      default:
        return VerticalNavItems()
    }
  }

  return (
    <OnlySideBarLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: getNavigationOptions()

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems()

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}

      {/* use This Element for audio call */}
      <audio id='mediaElement' style={{ display: 'none' }} />

      {/* use call ringtone play  */}
      <audio id='connectingRingTone' src='/sounds/ringtone.mp3' style={{ display: 'none' }} loop />
      <audio id='InComingConnectingRingTone' src='/sounds/ringtone.mp3' style={{ display: 'none' }} loop />
    </OnlySideBarLayout>
  )
}

export default BasicLayout
