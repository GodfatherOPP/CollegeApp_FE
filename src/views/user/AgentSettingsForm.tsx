/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import FormProvider, { RHFTextField } from '../../hooks/hook-form'
import { LoadingButton } from '@mui/lab'
import { TreeView } from '@mui/lab'
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem'
import NewUserSettingFields from './NewUserSettingFields'
import { Stack } from '@mui/system'
import RHFSwitch from 'src/hooks/hook-form/RHFSwitch'

// ** Third Party Imports
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { getUserDetails, updateUserSettings } from 'src/store/management/user'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { Card, CardContent, Typography } from '@mui/material'
import { getSideBarPermission } from 'src/store/sideBarPermission'
import { useAuth } from 'src/hooks/useAuth'
// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

type StyledTreeItemProps = TreeItemProps & {
  labelText: string
  labelIcon: string
  labelInfo?: string
}

// Styled TreeItem component
const StyledTreeItemRoot = styled(TreeItem)<TreeItemProps>(({ theme }) => ({
  '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiTreeItem-content': {
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .MuiTreeItem-label': {
    fontWeight: 'inherit',
    paddingRight: theme.spacing(3)
  },
  '& .MuiTreeItem-group': {
    marginLeft: 0,
    '& .MuiTreeItem-content': {
      paddingLeft: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular
    }
  }
}))

const StyledTreeItem = (props: StyledTreeItemProps) => {
  // ** Props
  const { labelText, labelIcon, labelInfo, children, ...other } = props

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          <Icon icon={labelIcon} color='inherit' />
          <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: '100' }}>
            {labelText}
          </Typography>
          {labelInfo ? (
            <Typography variant='caption' color='inherit'>
              {labelInfo}
            </Typography>
          ) : null}
        </Box>
      }
    >
      <Box
        rowGap={3}
        columnGap={2}
        display='grid'
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)'
          // md: 'repeat(2, 1fr)'
        }}
        sx={{ py: 1, ml: 10 }}
      >
        {children}
      </Box>
    </StyledTreeItemRoot>
  )
}

interface SettingsFormProps {
  currentUser?: any
  toggle: () => void
  role: number
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AgentSettingsForm = (props: SettingsFormProps) => {
  // ** Props
  const { user } = useAuth()
  const { currentUser, toggle, role } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const sideBarPermission = useSelector(
    (state: any) => state.sideBarPermission?.AgentPermission?.Permission?.sidebarPermission
  )
  const ExpandIcon = <Icon icon='tabler:chevron-left' />

  useEffect(() => {
    if (currentUser?.agentId && currentUser?.agentId != '') dispatch(getSideBarPermission(currentUser?.agentId))
    else dispatch(getSideBarPermission(currentUser?._id))
  }, [currentUser])
 
  const sideBarPermissionSchema =
    sideBarPermission &&
    Object.keys(sideBarPermission).reduce((acc, item) => {
      return { ...acc, [item]: Yup.boolean() }
    }, {})

  const schema = Yup.object().shape({
    settings: Yup.array(),
    selectFrom: Yup.string(),
    selectEnd: Yup.string(),
    selectedColor: Yup.string(),
    supervisor: Yup.boolean(),
    p2pFlag: Yup.boolean(),
    rtcFlag: Yup.boolean(),
    currentDueFlag: Yup.boolean(),
    pastDueFlag: Yup.boolean(),
    nextDueFlag: Yup.boolean(),
    noAutoPay: Yup.boolean(),
    needDisabledFlag: Yup.boolean(),
    ptpOpenFlag: Yup.boolean(),
    smsProviderFlag: Yup.boolean(),
    emailFlag: Yup.boolean(),
    editMessageTemplateFlag: Yup.boolean(),
    callDialerFlag: Yup.boolean(),
    techFee: Yup.boolean(),
    sideBarPermission: Yup.object().shape(sideBarPermissionSchema)
  })

  const defaultValues = useMemo(
    () => ({
      selectFrom: currentUser?.agentSetting?.routes[0]?.selectFrom || '',
      selectEnd: currentUser?.agentSetting?.routes[0]?.selectEnd || '',
      selectedColor: currentUser?.agentSetting?.routes[0]?.selectedColor || '',
      settings: currentUser?.agentSetting?.routes.slice(1, currentUser?.agentSetting?.routes.length) || [],
      supervisor: currentUser?.agentSetting?.supervisor || false,
      p2pFlag: currentUser?.agentSetting?.flags?.p2pFlag || false,
      techFee: currentUser?.agentSetting?.flags?.techFee || false,
      rtcFlag: currentUser?.agentSetting?.flags?.rtcFlag || false,
      currentDueFlag: currentUser?.agentSetting?.flags?.currentDueFlag || false,
      pastDueFlag: currentUser?.agentSetting?.flags?.pastDueFlag || false,
      nextDueFlag: currentUser?.agentSetting?.flags?.nextDueFlag || false,
      noAutoPay: currentUser?.agentSetting?.flags?.noAutoPay || false,
      needDisabledFlag: currentUser?.agentSetting?.flags?.needDisabledFlag || false,
      ptpOpenFlag: currentUser?.agentSetting?.flags?.ptpOpenFlag || false,
      smsProviderFlag: currentUser?.agentSetting?.flags?.smsProviderFlag || false,
      emailFlag: currentUser?.agentSetting?.flags?.emailFlag || false,
      editMessageTemplateFlag: currentUser?.agentSetting?.flags?.editMessageTemplateFlag || false,
      callDialerFlag: currentUser?.agentSetting?.flags?.callDialerFlag || false,
      sideBarPermission: sideBarPermission
    }),
    [currentUser, sideBarPermission]
  )

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })
  const {
    reset,
    handleSubmit,
    formState: { }
  } = methods
  const extaRoutes = currentUser?.agentSetting?.routes.slice(1, currentUser?.agentSetting?.routes.length) || []
  
  useEffect(() => {
    if (currentUser) {
      reset(defaultValues)
    }
  }, [currentUser, sideBarPermission])

  const onSubmit = async (data: any) => {
    const routes = [
      {
        selectFrom: data.selectFrom,
        selectEnd: data.selectEnd,
        selectedColor: data.selectedColor
      },
      ...data.settings
    ]
    const flags = {
      p2pFlag: data.p2pFlag,
      techFee: data.techFee,
      rtcFlag: data.rtcFlag,
      currentDueFlag: data.currentDueFlag,
      nextDueFlag: data.nextDueFlag,
      pastDueFlag: data.pastDueFlag,
      noAutoPay: data.noAutoPay,
      needDisabledFlag: data.needDisabledFlag,
      ptpOpenFlag: data.ptpOpenFlag,
      smsProviderFlag: data.smsProviderFlag,
      emailFlag: data.emailFlag,
      editMessageTemplateFlag: data.editMessageTemplateFlag,
      callDialerFlag: data.callDialerFlag,
      virtualTerminal: data.virtualTerminal,
      calendar: data.calendar
    }

    const sidebarPermission = data.sideBarPermission
    const formData = { id: currentUser._id, routes, flags, sidebarPermission, supervisor: data?.supervisor }
    const response = await dispatch(updateUserSettings(formData, role))
    if (response?.statusCode === 200) {
      toast.success(response?.message)
      await dispatch(getUserDetails(currentUser._id))
      reset()
      toggle()
    } else {
      toast.error(response?.message)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {store.error && (
              <Header sx={{ m: 0, pb: 0 }}>
                <Alert severity='error' sx={{ width: '100%' }}>
                  {store.error}
                </Alert>
              </Header>
            )}
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant={'h6'} mb={4}>
                    Routes
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(4, 1fr)'
                    }}
                  >
                    <RHFTextField name='selectFrom' label='Select Start' size='small' />
                    <RHFTextField name='selectEnd' label='Select End' size='small' />
                    <RHFTextField name='selectedColor' label='Select Color' size='small' />
                  </Box>
                  <NewUserSettingFields length={extaRoutes.length} />

                  <Typography variant={'h6'} my={4}>
                    Tasks
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(3, 1fr)'
                    }}
                  >
                    <RHFSwitch name='p2pFlag' label='P2P' />
                    <RHFSwitch name='rtcFlag' label='RTC' />
                    <RHFSwitch name='currentDueFlag' label='Current Due' />

                    <RHFSwitch name='pastDueFlag' label='PastDue' />
                    <RHFSwitch name='nextDueFlag' label='NextDue' />
                    <RHFSwitch name='noAutoPay' label='Call References' />

                    <RHFSwitch name='ptpOpenFlag' label='PTP Open' />
                    <RHFSwitch name='smsProviderFlag' label='SMS' />

                    <RHFSwitch name='emailFlag' label='Email' />
                    <RHFSwitch name='editMessageTemplateFlag' label='Edit Message Template' />
                    <RHFSwitch name='callDialerFlag' label='Call Dialer' />
                    <RHFSwitch name='techFee' label='Tech Fee' />
                  </Box>

                  <Typography variant={'h6'} my={4}>
                    Account
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(3, 1fr)'
                    }}
                  >
                    <RHFSwitch name='supervisor' label='Supervisor' />
                  </Box>


                  {user?.roles?.id === 2 && (
                    <Typography variant={'h6'} my={4}>
                      SideBar Permissions
                    </Typography>
                  )}

                  {user?.roles?.id === 2 && (
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display='grid'
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)'
                      }}
                    >
                      <TreeView
                        sx={{ minHeight: 240 }}
                        defaultExpanded={[]}
                        defaultExpandIcon={ExpandIcon}
                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                      >
                        {sideBarPermission?.hasOwnProperty('dashboardPermission') && (
                          <StyledTreeItem nodeId='1' labelText='Dashboard' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.dashboardPermission' label='Dashboard' />
                          </StyledTreeItem>
                        )}

                        {sideBarPermission?.hasOwnProperty('virtualTerminal') && (
                          <StyledTreeItem nodeId='14' labelText='Virtual Terminal' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.virtualTerminal' label='Virtual Terminal' />
                          </StyledTreeItem>
                        )}

                        {sideBarPermission?.hasOwnProperty('calendar') && (
                          <StyledTreeItem nodeId='15' labelText='Calendar' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.calendar' label='Calendar' />
                          </StyledTreeItem>
                        )}

                        <StyledTreeItem nodeId='2' labelText='Department' labelIcon='tabler:badge'>
                          {sideBarPermission?.hasOwnProperty('sales') && (
                            <RHFSwitch name='sideBarPermission.sales' label='Sales' />
                          )}

                          {sideBarPermission?.hasOwnProperty('customers') && (
                            <RHFSwitch name='sideBarPermission.customers' label='Customers' />
                          )}
                          {sideBarPermission?.hasOwnProperty('arrangement') && (
                            <RHFSwitch name='sideBarPermission.arrangement' label='Arrangement' />
                          )}
                          {sideBarPermission?.hasOwnProperty('queues') && (
                            <RHFSwitch name='sideBarPermission.queues' label='Queues' />
                          )}
                          {sideBarPermission?.hasOwnProperty('repos') && (
                            <RHFSwitch name='sideBarPermission.repos' label='Repos' />
                          )}
                          {sideBarPermission?.hasOwnProperty('insurance') && (
                            <RHFSwitch name='sideBarPermission.insurance' label='Insurance' />
                          )}
                        </StyledTreeItem>

                        {(sideBarPermission?.hasOwnProperty('idms') ||
                          sideBarPermission?.hasOwnProperty('text') ||
                          sideBarPermission?.hasOwnProperty('callTemp') ||
                          sideBarPermission?.hasOwnProperty('email') ||
                          sideBarPermission?.hasOwnProperty('note') ||
                          sideBarPermission?.hasOwnProperty('agent') ||
                          sideBarPermission?.hasOwnProperty('flags') ||
                          sideBarPermission?.hasOwnProperty('imports') ||
                          sideBarPermission?.hasOwnProperty('impoundCompany')) && (
                            <StyledTreeItem nodeId='3' labelText='Management' labelIcon='tabler:badge'>
                              {sideBarPermission?.hasOwnProperty('agent') && (
                                <RHFSwitch name='sideBarPermission.agent' label='Agent' />
                              )}

                              {sideBarPermission?.hasOwnProperty('flags') && (
                                <RHFSwitch name='sideBarPermission.flags' label='Flags' />
                              )}

                              {sideBarPermission?.hasOwnProperty('imports') && (
                                <RHFSwitch name='sideBarPermission.imports' label='Imports' />
                              )}
                              {sideBarPermission?.hasOwnProperty('impoundCompany') && (
                                <RHFSwitch name='sideBarPermission.impoundCompany' label='Impound Company' />
                              )}
                              {(sideBarPermission?.hasOwnProperty('idms') ||
                                sideBarPermission?.hasOwnProperty('text') ||
                                sideBarPermission?.hasOwnProperty('callTemp') ||
                                sideBarPermission?.hasOwnProperty('email') ||
                                sideBarPermission?.hasOwnProperty('note')) && (
                                  <StyledTreeItem nodeId='4' labelText='Templates' labelIcon='tabler:badge'>
                                    {sideBarPermission?.hasOwnProperty('idms') && (
                                      <RHFSwitch name='sideBarPermission.idms' label='IDMS Templates' />
                                    )}

                                    {sideBarPermission?.hasOwnProperty('text') && (
                                      <RHFSwitch name='sideBarPermission.text' label='Text Templates' />
                                    )}

                                    {sideBarPermission?.hasOwnProperty('callTemp') && (
                                      <RHFSwitch name='sideBarPermission.callTemp' label='Call Templates' />
                                    )}

                                    {sideBarPermission?.hasOwnProperty('email') && (
                                      <RHFSwitch name='sideBarPermission.email' label='Email Templates' />
                                    )}

                                    {sideBarPermission?.hasOwnProperty('note') && (
                                      <RHFSwitch name='sideBarPermission.note' label='Note Templates' />
                                    )}
                                  </StyledTreeItem>
                                )}
                            </StyledTreeItem>
                          )}

                        {sideBarPermission?.hasOwnProperty('workflow') && (
                          <StyledTreeItem nodeId='5' labelText='Automation' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.workflow' label='Workflow' />
                          </StyledTreeItem>
                        )}

                        {(sideBarPermission?.hasOwnProperty('callcenterNumbers') ||
                          sideBarPermission?.hasOwnProperty('callcenterQueues') ||
                          sideBarPermission?.hasOwnProperty('callcenterIvr') ||
                          sideBarPermission?.hasOwnProperty('callcenterAudio')) && (
                            <StyledTreeItem nodeId='6' labelText='Call Center' labelIcon='tabler:badge'>
                              {sideBarPermission?.hasOwnProperty('callcenterNumbers') && (
                                <RHFSwitch name='sideBarPermission.callcenterNumbers' label='Call Center Numbers' />
                              )}
                              {sideBarPermission?.hasOwnProperty('callcenterQueues') && (
                                <RHFSwitch name='sideBarPermission.callcenterQueues' label='Call Center Queues' />
                              )}
                              {sideBarPermission?.hasOwnProperty('callcenterIvr') && (
                                <RHFSwitch name='sideBarPermission.callcenterIvr' label='Call Center IVR' />
                              )}
                              {sideBarPermission?.hasOwnProperty('callcenterAudio') && (
                                <RHFSwitch name='sideBarPermission.callcenterAudio' label='Call Center Audio' />
                              )}
                            </StyledTreeItem>
                          )}

                        {(sideBarPermission?.hasOwnProperty('call') ||
                          sideBarPermission?.hasOwnProperty('transaction') ||
                          sideBarPermission?.hasOwnProperty('autopay') ||
                          sideBarPermission?.hasOwnProperty('failedAutopay')) && (
                            <StyledTreeItem nodeId='7' labelText='Reports' labelIcon='tabler:badge'>
                              {sideBarPermission?.hasOwnProperty('call') && (
                                <RHFSwitch name='sideBarPermission.call' label='Call Report' />
                              )}
                              {sideBarPermission?.hasOwnProperty('transaction') && (
                                <RHFSwitch name='sideBarPermission.transaction' label='Transaction Report' />
                              )}
                              {sideBarPermission?.hasOwnProperty('autopay') && (
                                <RHFSwitch name='sideBarPermission.autopay' label='Autopay Report' />
                              )}
                              {sideBarPermission?.hasOwnProperty('failedAutopay') && (
                                <RHFSwitch name='sideBarPermission.failedAutopay' label='Failed Autopay Report' />
                              )}
                            </StyledTreeItem>
                          )}

                        {(sideBarPermission?.hasOwnProperty('callerId') ||
                          sideBarPermission?.hasOwnProperty('phoneScripts') ||
                          sideBarPermission?.hasOwnProperty('callCampaign') ||
                          sideBarPermission?.hasOwnProperty('callDialer')) && (
                            <StyledTreeItem nodeId='8' labelText='Dialer' labelIcon='tabler:badge'>
                              {sideBarPermission?.hasOwnProperty('callerId') && (
                                <RHFSwitch name='sideBarPermission.callerId' label='Caller ID' />
                              )}
                              {sideBarPermission?.hasOwnProperty('phoneScripts') && (
                                <RHFSwitch name='sideBarPermission.phoneScripts' label='Phone Scripts' />
                              )}
                              {sideBarPermission?.hasOwnProperty('callCampaign') && (
                                <RHFSwitch name='sideBarPermission.callCampaign' label='Call Campaign' />
                              )}
                              {sideBarPermission?.hasOwnProperty('callDialer') && (
                                <RHFSwitch name='sideBarPermission.callDialer' label='Call Dialer' />
                              )}
                            </StyledTreeItem>
                          )}
                        {sideBarPermission?.hasOwnProperty('ticketPermission') && (
                          <StyledTreeItem nodeId='9' labelText='Ticket' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.ticketPermission' label='Ticket' />
                          </StyledTreeItem>
                        )}
                        {sideBarPermission?.hasOwnProperty('customerTicket') && (
                          <StyledTreeItem nodeId='10' labelText='Customer Ticket' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.customerTicket' label='Ticket' />
                          </StyledTreeItem>
                        )}
                        {sideBarPermission?.hasOwnProperty('customerAccident') && (
                          <StyledTreeItem nodeId='11' labelText='Customer Accident Ticket' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.customerAccident' label='Ticket' />
                          </StyledTreeItem>
                        )}
                        {sideBarPermission?.hasOwnProperty('chatPermission') && (
                          <StyledTreeItem nodeId='12' labelText='Chat' labelIcon='tabler:badge'>
                            <RHFSwitch name='sideBarPermission.chatPermission' label='Chat' />
                          </StyledTreeItem>
                        )}

                        {sideBarPermission?.hasOwnProperty('callDisposition') && (
                          <StyledTreeItem nodeId='13' labelText='Other' labelIcon='tabler:badge'>
                            <RHFSwitch
                              name='sideBarPermission.callDisposition'
                              label='Call Disposition Templates Management'
                            />
                          </StyledTreeItem>
                        )}
                      </TreeView>
                    </Box>
                  )}
                  <LoadingButton type='submit' variant='contained' loading={store.isLoading} sx={{ mt: 10 }}>
                    Save Changes
                  </LoadingButton>
                </Grid>
              </Grid>
            </FormProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AgentSettingsForm
