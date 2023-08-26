// ** MUI Imports
import Grid from '@mui/material/Grid'

import UserViewLeft from './UserViewLeft'
import UserViewRight from './UserViewRight'

interface PageProp {
  settingsFlag: boolean
  agentEditFlag?: boolean
  toggle: () => void
  userData: any
}

const ProfileView = (props: PageProp) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft toggle={props.toggle} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight settingsFlag={props.settingsFlag} agentEditFlag={props.agentEditFlag || false} toggle={props.toggle} userData={props.userData} />
      </Grid>
    </Grid>
  )
}

export default ProfileView
