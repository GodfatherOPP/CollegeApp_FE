// ** React Imports
import { useEffect, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, FieldError } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { getUserDetails, updateUserSettings } from 'src/store/management/user'
import { getFlagsByCreatorId } from 'src/store/management/flags'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { Card, CardContent, Typography } from '@mui/material'
import { LoadingButton, TreeView } from '@mui/lab'
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem'
import RHFSwitch from 'src/hooks/hook-form/RHFSwitch'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { useAuth } from 'src/hooks/useAuth'

interface SettingsFormProps {
  currentUser?: any
  toggle: () => void
  role: number
}

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'
import FileUploaderImage from './FileUploaderImage'

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

const SettingsForm = (props: SettingsFormProps) => {
  const { user } = useAuth()
  const { currentUser, role } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const flag_store = useSelector((state: RootState) => state.flags)
  const ExpandIcon = <Icon icon='tabler:chevron-left' />

  const schema = yup.object().shape({
    email: yup.string().email('Enter valid Email'),
    institutionId: yup.number().typeError('Institution Id must be a number').required('Institution Id required'),
    password: yup.string(),
    auxChatApiKey: yup.string(),
    fromNumber: yup.string().nullable(),
    merchantId: yup.string(),
    signatureName: yup.string(),
    flags: yup.array(),
    appName: yup.string(),
    files: yup.array(),
    sidebarPermission: yup.object().shape({
      dashboardPermission: yup.boolean(),
      ticketPermission: yup.boolean(),
      customerTicket: yup.boolean(),
      customerAccident: yup.boolean(),
      chatPermission: yup.boolean(),
      call: yup.boolean(),
      transaction: yup.boolean(),
      autopay: yup.boolean(),
      failedAutopay: yup.boolean(),
      callerId: yup.boolean(),
      phoneScripts: yup.boolean(),
      callCampaign: yup.boolean(),
      callDialer: yup.boolean(),
      workflow: yup.boolean(),
      agent: yup.boolean(),
      flags: yup.boolean(),
      imports: yup.boolean(),
      impoundCompany: yup.boolean(),
      idms: yup.boolean(),
      text: yup.boolean(),
      callTemp: yup.boolean(),
      email: yup.boolean(),
      note: yup.boolean(),
      callDisposition: yup.boolean(),
      sales: yup.boolean(),
      customers: yup.boolean(),
      arrangement: yup.boolean(),
      queues: yup.boolean(),
      repos: yup.boolean(),
      insurance: yup.boolean(),
      callcenterNumbers: yup.boolean(),
      callcenterQueues: yup.boolean(),
      callcenterIvr: yup.boolean(),
      callcenterAudio: yup.boolean(),
      virtualTerminal: yup.boolean(),
      calendar: yup.boolean()
    })
  })

  const formatLogoImage = (location: any) => {
    if (!location) {
      return []
    }
    const image = {
      name: "logo.png",
      type: "image",
      src: location,
      size: 1024000
    }
    
    return [image]
  };

  const defaultValues = useMemo(
    () => ({
      id: currentUser?._id || null,
      email: currentUser?.adminSetting?.email || '',
      institutionId: currentUser?.adminSetting?.institutionId || '',
      password: currentUser?.adminSetting?.password || '',
      auxChatApiKey: currentUser?.adminSetting?.auxChatApiKey || '',
      fromNumber: currentUser?.adminSetting?.fromNumber || '',
      merchantId: currentUser?.adminSetting?.merchantId || '',
      signatureName: currentUser?.adminSetting?.signatureName || '',
      flags: currentUser?.adminSetting?.flags || [],
      appName: currentUser?.adminSetting?.appName || '',
      files: formatLogoImage(currentUser?.adminSetting?.logo),
      sidebarPermission: {
        dashboardPermission: currentUser?.adminSetting?.sidebarPermission?.dashboardPermission || false,
        ticketPermission: currentUser?.adminSetting?.sidebarPermission?.ticketPermission || false,
        customerTicket: currentUser?.adminSetting?.sidebarPermission?.customerTicket || false,
        customerAccident: currentUser?.adminSetting?.sidebarPermission?.customerAccident || false,
        chatPermission: currentUser?.adminSetting?.sidebarPermission?.chatPermission || false,
        call: currentUser?.adminSetting?.sidebarPermission?.call || false,
        transaction: currentUser?.adminSetting?.sidebarPermission?.transaction || false,
        autopay: currentUser?.adminSetting?.sidebarPermission?.autopay || false,
        failedAutopay: currentUser?.adminSetting?.sidebarPermission?.failedAutopay || false,
        callerId: currentUser?.adminSetting?.sidebarPermission?.callerId || false,
        phoneScripts: currentUser?.adminSetting?.sidebarPermission?.phoneScripts || false,
        callCampaign: currentUser?.adminSetting?.sidebarPermission?.callCampaign || false,
        callDialer: currentUser?.adminSetting?.sidebarPermission?.callDialer || false,
        workflow: currentUser?.adminSetting?.sidebarPermission?.workflow || false,
        agent: currentUser?.adminSetting?.sidebarPermission?.agent || false,
        flags: currentUser?.adminSetting?.sidebarPermission?.flags || false,
        imports: currentUser?.adminSetting?.sidebarPermission?.imports || false,
        impoundCompany: currentUser?.adminSetting?.sidebarPermission?.impoundCompany || false,
        idms: currentUser?.adminSetting?.sidebarPermission?.idms || false,
        text: currentUser?.adminSetting?.sidebarPermission?.text || false,
        callTemp: currentUser?.adminSetting?.sidebarPermission?.call || false,
        email: currentUser?.adminSetting?.sidebarPermission?.email || false,
        note: currentUser?.adminSetting?.sidebarPermission?.note || false,
        callDisposition: currentUser?.adminSetting?.sidebarPermission?.callDisposition || false,
        sales: currentUser?.adminSetting?.sidebarPermission?.sales || false,
        customers: currentUser?.adminSetting?.sidebarPermission?.customers || false,
        arrangement: currentUser?.adminSetting?.sidebarPermission?.arrangement || false,
        queues: currentUser?.adminSetting?.sidebarPermission?.queues || false,
        repos: currentUser?.adminSetting?.sidebarPermission?.repos || false,
        insurance: currentUser?.adminSetting?.sidebarPermission?.insurance || false,
        callcenterNumbers: currentUser?.adminSetting?.sidebarPermission?.callcenterNumbers || false,
        callcenterQueues: currentUser?.adminSetting?.sidebarPermission?.callcenterQueues || false,
        callcenterIvr: currentUser?.adminSetting?.sidebarPermission?.callcenterIvr || false,
        callcenterAudio: currentUser?.adminSetting?.sidebarPermission?.callcenterAudio || false,
        virtualTerminal: currentUser?.adminSetting?.sidebarPermission?.virtualTerminal || false,
        calendar: currentUser?.adminSetting?.sidebarPermission?.calendar || false
      }
    }),
    [currentUser]
  )

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues)
      const { _id } = currentUser
      if (_id) {
        dispatch(getFlagsByCreatorId(_id))
      }
    }
  }, [currentUser])

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = methods

  const formValue = watch();

  const onSubmit = async (data: any) => {
    const sidebarPermission = {
      dashboardPermission: data.sidebarPermission.dashboardPermission,
      ticketPermission: data.sidebarPermission.ticketPermission,
      customerTicket: data.sidebarPermission.customerTicket,
      customerAccident: data.sidebarPermission.customerAccident,
      chatPermission: data.sidebarPermission.chatPermission,
      call: data.sidebarPermission.call,
      transaction: data.sidebarPermission.transaction,
      autopay: data.sidebarPermission.autopay,
      failedAutopay: data.sidebarPermission.failedAutopay,
      callerId: data.sidebarPermission.callerId,
      phoneScripts: data.sidebarPermission.phoneScripts,
      callCampaign: data.sidebarPermission.callCampaign,
      callDialer: data.sidebarPermission.callDialer,
      workflow: data.sidebarPermission.workflow,
      agent: data.sidebarPermission.agent,
      flags: data.sidebarPermission.flags,
      imports: data.sidebarPermission.imports,
      impoundCompany: data.sidebarPermission.impoundCompany,
      idms: data.sidebarPermission.idms,
      text: data.sidebarPermission.text,
      callTemp: data.sidebarPermission.callTemp,
      email: data.sidebarPermission.email,
      note: data.sidebarPermission.note,
      callDisposition: data.sidebarPermission.callDisposition,
      sales: data.sidebarPermission.sales,
      customers: data.sidebarPermission.customers,
      arrangement: data.sidebarPermission.arrangement,
      queues: data.sidebarPermission.queues,
      repos: data.sidebarPermission.repos,
      insurance: data.sidebarPermission.insurance,
      callcenterNumbers: data.sidebarPermission.callcenterNumbers,
      callcenterQueues: data.sidebarPermission.callcenterQueues,
      callcenterIvr: data.sidebarPermission.callcenterIvr,
      callcenterAudio: data.sidebarPermission.callcenterAudio,
      virtualTerminal: data.sidebarPermission.virtualTerminal,
      calendar: data.sidebarPermission.calendar
    }
    const formData = { id: currentUser._id, ...data, sidebarPermission }
    const response = await dispatch(updateUserSettings(formData, role))
    if (response?.statusCode === 200) {
      await dispatch(getUserDetails(data?.id))
      toast.success(response?.message)
      reset()
    } else {
      toast.error(response?.message)
    }
  }

  const handleImageUpload = (files: any) => {
    setValue('files', files);
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
                  <Typography variant='body1'>IDMS Settings</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='email'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          size='small'
                          type='email'
                          label='Email'
                          onChange={onChange}
                          autoComplete='off'
                          error={Boolean(errors.email)}
                        />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.email as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='institutionId'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          size='small'
                          label='Institution Id'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.institutionId)}
                        />
                      )}
                    />
                    {errors.institutionId && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.institutionId as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='password'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='password'
                          size='small'
                          label='Password'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.password)}
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.password as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>AuxChat</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='auxChatApiKey'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='API Key'
                          size='small'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.auxChatApiKey)}
                        />
                      )}
                    />
                    {errors.auxChatApiKey && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.auxChatApiKey as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='fromNumber'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          size='small'
                          label='From Number'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.fromNumber)}
                        />
                      )}
                    />
                    {errors.fromNumber && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.fromNumber as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>AuxVault</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='merchantId'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          size='small'
                          label='Merchant Id'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.merchantId)}
                        />
                      )}
                    />
                    {errors.merchantId && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.merchantId as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>Repo PDF</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='signatureName'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          size='small'
                          label='Signature Name'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.merchantId)}
                        />
                      )}
                    />
                    {errors.merchantId && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.merchantId as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                <Grid item xs={12}>
                  <Typography variant='body1'>App Details</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='appName'
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          size='small'
                          label='Name'
                          autoComplete='off'
                          onChange={onChange}
                          error={Boolean(errors.appName)}
                        />
                      )}
                    />
                    {errors.appName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.appName as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FileUploaderImage
                    description={"Upload Logo for you Application"}
                    uploadedFiles={formValue?.files}
                    handleImageUpload={handleImageUpload}
                  />
                </Grid>


                <Grid item xs={12}>
                  <Typography variant='body1'>Flags</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel
                      id='validation-does-select'
                      size='small'
                      error={Boolean(errors.flags)}
                      htmlFor='validation-does-select'
                    >
                      Select Flags
                    </InputLabel>
                    <Controller
                      name='flags'
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          size='small'
                          label='Select Flags'
                          onChange={onChange}
                          error={Boolean(errors.flags)}
                          labelId='validation-flags-select'
                          aria-describedby='validation-flags-select'
                          multiple
                        >
                          {flag_store?.flags?.length === 0 && <MenuItem disabled>No Flags Available</MenuItem>}
                          {flag_store?.flags.map((flag: any) => {
                            return (
                              <MenuItem key={flag._id} value={flag._id}>
                                {flag.Flag}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                    />
                    {errors.flags && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {(errors.flags as FieldError).message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                {user?.roles?.id === 1 && (
                  <Grid item sm={12}>
                    <Typography variant={'h6'} my={4}>
                      SideBar Permissions
                    </Typography>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display='grid'
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)'
                      }}
                    >
                      <TreeView
                        sx={{ minHeight: 240 }}
                        defaultExpanded={[]}
                        defaultExpandIcon={ExpandIcon}
                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                      >
                        <StyledTreeItem nodeId='1' labelText='Dashboard' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.dashboardPermission' label='Dashboard Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='12' labelText='Virtual Terminal' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.virtualTerminal' label='Virtual Terminal Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='13' labelText='Calendar' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.calendar' label='Calendar Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='2' labelText='Department' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.sales' label='Sales Department Permission' />
                          <RHFSwitch name='sidebarPermission.customers' label='Finance Customers Permission' />
                          <RHFSwitch name='sidebarPermission.arrangement' label='Finance Arrangement Permission' />
                          <RHFSwitch name='sidebarPermission.queues' label='Finance Queues Permission' />
                          <RHFSwitch name='sidebarPermission.repos' label='Finance Repos Permission' />
                          <RHFSwitch name='sidebarPermission.insurance' label='Finance Insurance Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='3' labelText='Management' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.agent' label='Agent Management Permission' />
                          <RHFSwitch name='sidebarPermission.flags' label='Flags Management Permission' />
                          <RHFSwitch name='sidebarPermission.imports' label='Imports Management Permission' />
                          <RHFSwitch
                            name='sidebarPermission.impoundCompany'
                            label='Impound Company Management Permission'
                          />
                          <StyledTreeItem nodeId='4' labelText='Templates' labelIcon='tabler:badge'>
                            <RHFSwitch name='sidebarPermission.idms' label='IDMS Templates Management Permission' />
                            <RHFSwitch name='sidebarPermission.text' label='Text Templates Management Permission' />
                            <RHFSwitch name='sidebarPermission.callTemp' label='Call Templates Management Permission' />
                            <RHFSwitch name='sidebarPermission.email' label='Email Templates Management Permission' />
                            <RHFSwitch name='sidebarPermission.note' label='Note Templates Management Permission' />
                          </StyledTreeItem>
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='5' labelText='Automation' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.workflow' label='Workflow Automation Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='6' labelText='Call Center' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.callcenterNumbers' label='Call Center Numbers' />
                          <RHFSwitch name='sidebarPermission.callcenterQueues' label='Call Center Queues' />
                          <RHFSwitch name='sidebarPermission.callcenterIvr' label='Call Center IVR' />
                          <RHFSwitch name='sidebarPermission.callcenterAudio' label='Call Center Audio' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='7' labelText='Reports' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.call' label='Call Report Permission' />
                          <RHFSwitch name='sidebarPermission.transaction' label='Transaction Report Permission' />
                          <RHFSwitch name='sidebarPermission.autopay' label='Autopay Report Permission' />
                          <RHFSwitch name='sidebarPermission.failedAutopay' label='Failed Autopay Report Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='8' labelText='Dialer' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.callerId' label='Caller ID Permission' />
                          <RHFSwitch name='sidebarPermission.phoneScripts' label='Phone Scripts Permission' />
                          <RHFSwitch name='sidebarPermission.callCampaign' label='Call Campaign Permission' />
                          <RHFSwitch name='sidebarPermission.callDialer' label='Call Dialer Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='9' labelText='Ticket' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.ticketPermission' label='Ticket Permission' />
                          <RHFSwitch name='sidebarPermission.customerTicket' label='Customer Ticket Permission' />
                          <RHFSwitch name='sidebarPermission.customerAccident' label='Customer Accident Ticket Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='10' labelText='Chat' labelIcon='tabler:badge'>
                          <RHFSwitch name='sidebarPermission.chatPermission' label='Chat Permission' />
                        </StyledTreeItem>

                        <StyledTreeItem nodeId='11' labelText='Other' labelIcon='tabler:badge'>
                          <RHFSwitch
                            name='sidebarPermission.callDisposition'
                            label='Call Disposition Templates Management Permission'
                          />
                        </StyledTreeItem>

                      </TreeView>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LoadingButton
                    sx={{ mr: 3, mt: 5 }}
                    type='submit'
                    loading={store.isLoading}
                    variant='contained'
                    disabled={store.isLoading}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Grid>
            </FormProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsForm
