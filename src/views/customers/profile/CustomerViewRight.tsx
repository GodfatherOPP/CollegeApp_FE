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
// ** Demo Components Imports
import General from './tabs/General'
import PaymentTabs from './tabs/PaymentTabs'
import FlagsTab from './tabs/FlagsTab'
import FilesTab from './tabs/FilesTab'
import { useAuth } from 'src/hooks/useAuth'
import NotesTab from './tabs/NotesTab'
import CallLogs from './tabs/CallLogs'
import Ituran from './tabs/Ituran'
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
  toggle: () => void
  idmsCustomerId: string
}

const CustomerViewRight = (props: PageProp) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('general')
  const store = useSelector((state: any) => state.customers)
  // const userRole = JSON.parse(window.localStorage.getItem('userRoles') || '{}')
  const { user } = useAuth()
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
        <Tab value='general' label='Dashboard' icon={<Icon fontSize='1.125rem' icon='ic:round-account-box' />} />
        <Tab value='payment' label='Payment' icon={<Icon fontSize='1.125rem' icon='gg:dollar' />} />
        <Tab
          value='communication'
          label='Communication'
          icon={<Icon fontSize='1.125rem' icon='material-symbols:add-notes' />}
        />
        <Tab value='flags' label='Flags' icon={<Icon fontSize='1.125rem' icon='ant-design:tags-filled' />} />
        <Tab value='files' label='Files' icon={<Icon fontSize='1.125rem' icon='mdi:files' />} />
        <Tab value='call_logs' label='Call Logs' icon={<Icon fontSize='1.125rem' icon='clarity:list-solid' />} />
        <Tab value='ituran' label='Ituran' icon={<Icon fontSize='1.125rem' icon='mdi:cellphone-gps' />} />
      </TabList>
      <Box sx={{ mt: 6 }}>
        <TabPanel sx={{ p: 0 }} value='general'>
          <General />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='payment'>
          <PaymentTabs
            transcations={store?.selectedCustomer?.data?.transactions || []}
            autoPaydetails={store?.selectedCustomer?.data?.autoPaydetails}
          />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='communication'>
          <NotesTab importedId={props?.idmsCustomerId.toString()} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='flags'>
          <FlagsTab importedId={props?.idmsCustomerId.toString()} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='files'>
          <FilesTab importedId={props?.idmsCustomerId.toString()} user={user} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='call_logs'>
          <CallLogs phonenumber={store?.selectedCustomer?.data?.cellNumber} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='ituran'>
          <Ituran selectedCustomer={store?.selectedCustomer?.data} />
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default CustomerViewRight
