import Grid from '@mui/material/Grid'
import CustomerViewLeft from './CustomerViewLeft'
import CustomerViewRight from './CustomerViewRight'
import { Box, Button, Card, CardContent, CircularProgress, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { IUserAccountGeneral } from 'src/types/apps/userTypes'
import ListToolbar from 'src/views/toolbar/ListToolbar'
import { useAuth } from 'src/hooks/useAuth'
import DetailFilters from 'src/views/toolbar/DetailFilters'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateSipState } from 'src/store/dialer/sips'
import IconifyIcon from 'src/@core/components/icon'
import { setCustomerStk } from 'src/store/virtual-terminal'
import { useRouter } from 'next/router'

interface PageProp {
  toggle: () => void
  idmsCustomerId: string
}


const ProfileView = (props: PageProp) => {
  const router = useRouter()
  const { user } = useAuth()
  const dispatch: any = useDispatch<AppDispatch>()
  const imports = useSelector((state: any) => state.customers.selectedCustomer?.data)
  const selectedCustomer = useSelector((state: any) => state.customers.selectedCustomer)
  const currentUser: IUserAccountGeneral = useSelector((state: any) => state.user.selectedUser)
  const sideBarPermission = useSelector(
    (state: any) => state.sideBarPermission.selectedUserPermission?.Permission?.sidebarPermission
  )
  const options_Flags =
    user?.roles?.id === 3
      ? currentUser?.agentSetting?.flags
      : {
        p2pFlag: true,
        rtcFlag: true,
        currentDueFlag: true,
        pastDueFlag: true,
        nextDueFlag: true,
        noAutoPay: true,
        needDisabledFlag: true,
        smsProviderFlag: true,
        emailFlag: true,
        editMessageTemplateFlag: false,
        callDialerFlag: true
      }

  const PRIORITY_FLAG = imports?.flags?.filter((selectedFlag: any) =>
    currentUser?.adminSetting?.flags?.find((id: any) => selectedFlag?._id === id)
  )
  const customers = useSelector((state: any) => state.customers.selectedCustomer?.data)

  useEffect(() => {
    dispatch(updateSipState({ key: 'selectedCustomerApiCall', value: true }))
  }, [selectedCustomer])

  const handleVT = () => {
    dispatch(setCustomerStk(selectedCustomer?.data?.stkNumber || ""))
    router.push('/virtual-terminal')
  }

  return (
    <>
      {' '}
      {!selectedCustomer?.data?._id ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{ p: 2, pb: '0.5rem !important' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <ListToolbar options_Flags={options_Flags} selected={[imports?._id]} showPayReqDialogue />
                <div style={{ display: 'flex' }}>
                    {sideBarPermission?.virtualTerminal && (
                      <Tooltip title='Virtual Terminal'>
                        <Button
                          variant='contained'
                          startIcon={<IconifyIcon icon='ic:baseline-terminal' />}
                          onClick={() => handleVT()}
                          sx={{ '& .MuiButton-startIcon': { margin: 0, marginRight: 2 }, padding: 0, marginRight: 2 }}
                        >
                          VT
                        </Button>
                      </Tooltip>
                    )}
                  <DetailFilters options_Flags={options_Flags} imports={imports} completeImportData={selectedCustomer} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomerViewLeft
              toggle={props.toggle}
              PRIORITY_FLAG={PRIORITY_FLAG}
              imports={imports}
              customers={customers}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CustomerViewRight toggle={props.toggle} idmsCustomerId={props.idmsCustomerId} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ProfileView
