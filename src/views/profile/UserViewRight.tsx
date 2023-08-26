// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** States
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Demo Components Imports
import PasswordForm from 'src/views/user/PasswordForm'
import SettingsForm from 'src/views/user/SettingsForm'
import AgentSettingsForm from '../user/AgentSettingsForm'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius
  }
}))

interface PageProp {
  settingsFlag: boolean
  agentEditFlag?: boolean
  toggle: () => void
  userData: any
}

const UserViewRight = (props: PageProp) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('security')
  const store = useSelector((state: RootState) => state.user)
  // const userRole = JSON.parse(window.localStorage.getItem('userRoles') || '{}')
  const userRole = props.userData?.roles?.id

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='security' label='Security' icon={<Icon fontSize='1.125rem' icon='tabler:lock' />} />
        {props.settingsFlag && (
          <Tab value='settings' label='Settings' icon={<Icon fontSize='1.125rem' icon='tabler:settings' />} />
        )}
      </TabList>
      <Box sx={{ mt: 6 }}>
        <TabPanel sx={{ p: 0 }} value='security'>
          <PasswordForm currentUser={store.selectedUser} toggle={props.toggle} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='settings'>
          {props.agentEditFlag ? (
            <AgentSettingsForm currentUser={store.selectedUser} toggle={props.toggle} role={userRole} />
          ) : (
            <SettingsForm currentUser={store.selectedUser} toggle={props.toggle} role={userRole} />
          )}
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default UserViewRight
