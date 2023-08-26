/* eslint-disable react-hooks/exhaustive-deps */
// ** React data
import { SyntheticEvent, useEffect, useMemo, useState } from 'react'

// ** MUI data
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// ** Third Party data
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

// ** Store data
import { useDispatch, useSelector } from 'react-redux'

// ** Types data
import { AppDispatch, RootState } from 'src/store'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { RHFSelect, RHFTextField } from 'src/hooks/hook-form'
import { RHFCheckbox } from 'src/hooks/hook-form/RHFCheckbox'
import { LoadingButton } from '@mui/lab'
import { getCustomerDetail, getPtp, updateAutoPay, updateImport } from 'src/store/finance/customers'
import { toast } from 'react-hot-toast'
import { isValid, parse, parseISO } from 'date-fns'
import IconifyIcon from 'src/@core/components/icon'
import RHFDatePicker from 'src/hooks/hook-form/RHFDatePicker'
import { Accordion, AccordionSummary, AccordionDetails } from './CustomComponent'
import PTPListTable from '../PTPListTable'
import moment from 'moment'
import { updateInsurance } from 'src/store/general/insurance'

// const roleColors: ThemeColor[] = ['error', 'error', 'warning', 'info', 'success']
const statusColors: ThemeColor[] = ['error', 'success']
interface InsuranceFormValuesProps {
  company: string
  policy: string
  policyExpire: string
  note: string
  cpc: boolean
  policyStatus: any
  vin: any
}
interface EmployerFormValuesProps {
  employerName: string
  employerIncome: string
}
interface AutoPayFormValuesProps {
  autoPaytransactionStatus: string
}
const General = () => {
  // ** Props
  const store = useSelector((state: RootState) => state.customers)
  const data: any = store.selectedCustomer
  const dispatch = useDispatch<AppDispatch>()

  const [openInsurance, setInsuranceOpen] = useState(false)
  const [openEmployer, setOpenEmployer] = useState(false)
  const [openAutoPay, setOpenAutoPay] = useState(false)
  const [showCpcCheckbox, setShowCpcCheckbox] = useState(false)
  const [expanded, setExpanded] = useState<any>({ panel1: true, panel2: true, panel3: true, panel4: true })
  const [ptpData, setPtpData] = useState([])

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded((prevState: any) => ({
      ...prevState,
      [panel]: !prevState[panel]
    }))
  }
  const expandIcon = (value: string) => <IconifyIcon icon={expanded[value] ? 'tabler:minus' : 'tabler:plus'} />

  const InsuranceSchema = Yup.object().shape({
    company: Yup.string().required('Company Name is required'),
    policy: Yup.string().required('Policy is required'),
    policyExpire: Yup.string().required('Policy Expire is required'),
    policyStatus: Yup.string().required('Policy Status is required'),
    note: Yup.string(),
    cpc: Yup.boolean()
  })

  const defaultValues: any = useMemo(
    () => ({
      company: data?.data?.insurancedetails?.companyName || '',
      policyStatus: data?.data?.insurancedetails?.policyStatus === "Cancelled Policy" ? "cancelledPolicy" : data?.data?.insurancedetails?.policyStatus === "Active Policy" ? "activePolicy" : "expiredPolicy" || 'activePolicy',
      policyExpire: data?.data?.insurancedetails?.expireDate,
      note: '',
      cpc: data?.data?.insurance?.cpc || false,
      policy: data?.data?.insurancedetails?.policy
    }),
    [data]
  )

  const methods = useForm<InsuranceFormValuesProps>({
    resolver: yupResolver(InsuranceSchema),
    defaultValues
  })

  const handleSubmitInsurance = methods.handleSubmit
  const setInsuranceFormValue = methods.setValue
  const watchInsuranceFormValue = methods.watch
  const isSubmittingInsurance = methods.formState.isSubmitting

  const insuranceFormValues = watchInsuranceFormValue()
  const handleInsuranceOpen = () => {
    setInsuranceFormValue('company', defaultValues.company)
    setInsuranceFormValue('policyExpire', defaultValues.policyExpire)
    setInsuranceFormValue('policy', defaultValues.policy)
    setInsuranceFormValue('cpc', defaultValues.cpc)
    setInsuranceFormValue('policyStatus', defaultValues.policyStatus)
    setInsuranceOpen(true)
  }

  const handleInsuranceClose = () => {
    setInsuranceOpen(false)
  }

  useEffect(() => {
    if (insuranceFormValues?.policy === 'cancelledPolicy') setShowCpcCheckbox(true)
    else setShowCpcCheckbox(false)
  }, [insuranceFormValues])

  useEffect(() => {
    const customerId = data?.data?._id
    getPtpData(customerId)
  }, [data])

  const getPtpData = async (id: any) => {
    const response = await dispatch(getPtp(id))
    setPtpData(response.data)
  }

  const onSubmitInsurance = async (Data: InsuranceFormValuesProps) => {
    try {
      dispatch(
        updateInsurance({
          id: data?.data?.insurancedetails?._id,
          _id: data?.data?._id,
          insurance: {
            insStatus: data?.ApiData?.InsStatus || '',
            tag: data?.data?.insurance?.tag || '',
            company: Data?.company,
            policy: Data?.policy,
            policyExpire: Data?.policyExpire,
            cpc: Data?.cpc,
            note: Data?.note,
            policyStatus: Data?.policyStatus,
          }
        })
      )
        .then(async (response: any) => {
          if (response?.statusCode === 200) {
            await dispatch(getCustomerDetail(data?.data?._id));
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
          handleInsuranceClose()
        })
        .catch(error => {
          toast.error(error?.message)
          handleInsuranceClose()
        })
    } catch (error) {
      console.error(error)
      handleInsuranceClose()
    }
  }

  const AutoPaySchema = Yup.object().shape({
    autoPaytransactionStatus: Yup.string().required('AutoPay Status is required')
  })

  const autoPaydefaultValues = useMemo(
    () => ({
      autoPaytransactionStatus: data?.data?.autoPaydetails?.autoPaytransactionStatus || ''
    }),
    [data]
  )

  const autoPayMethods = useForm<AutoPayFormValuesProps>({
    resolver: yupResolver(AutoPaySchema),
    defaultValues: autoPaydefaultValues
  })

  const handleSubmitAutoPay = autoPayMethods.handleSubmit
  const setAutoPayFormValue = autoPayMethods.setValue
  const isSubmittingAutoPay = autoPayMethods.formState.isSubmitting

  const handleAutoPayOpen = () => {
    setAutoPayFormValue('autoPaytransactionStatus', autoPaydefaultValues?.autoPaytransactionStatus)
    setOpenAutoPay(true)
  }

  const handleAutoPayClose = () => {
    setOpenAutoPay(false)
  }

  const onSubmitAutoPay = async (autoPayData: AutoPayFormValuesProps) => {
    try {
      dispatch(
        updateAutoPay({
          CustomerId: data?.data?._id,
          status: autoPayData?.autoPaytransactionStatus
        })
      )
        .then((response: any) => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      handleAutoPayClose()
    } catch (error) {
      console.error(error)
      handleAutoPayClose()
    }
  }

  const EmployerSchema = Yup.object().shape({
    employerName: Yup.string().required('Employer Name is required'),
    employerIncome: Yup.string().required('Employer Income is required')
  })

  const EmployerdefaultValues = useMemo(
    () => ({
      employerName: data?.data?.borrower1EmployerName || '',
      employerIncome: data?.data?.borrower1EmploymentIncome || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const employerMethods = useForm<EmployerFormValuesProps>({
    resolver: yupResolver(EmployerSchema),
    defaultValues: EmployerdefaultValues
  })

  const handleSubmitEmployer = employerMethods.handleSubmit
  const setEmployerFormValue = employerMethods.setValue
  const isSubmittingEmployer = employerMethods.formState.isSubmitting

  const handleEmployerOpen = () => {
    setEmployerFormValue('employerName', EmployerdefaultValues.employerName)
    setEmployerFormValue('employerIncome', EmployerdefaultValues.employerIncome)
    setOpenEmployer(true)
  }

  const handleEmployerClose = () => {
    setOpenEmployer(false)
  }

  const onSubmitEmployer = async (EmployerData: EmployerFormValuesProps) => {
    try {
      dispatch(
        updateImport({
          id: data?.data?._id,
          borrower1EmployerName: EmployerData?.employerName,
          borrower1EmploymentIncome: EmployerData?.employerIncome
        })
      )
        .then((response: any) => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      handleEmployerClose()
    } catch (error) {
      console.error(error)
      handleEmployerClose()
    }
  }

  const formatAutopayDate = () => {
    const dateOnly = new Date(data?.data?.autoPaydetails?.PaymentDate);
    let formatDate = moment.utc(dateOnly);
    const today = moment().utc()
    if (formatDate.isAfter(today)) {
      return `${formatDate.format('MMMM, DD, YYYY')}`
    }
    formatDate = formatDate.add(1, 'months');
    
    return `${formatDate.format('MMMM, DD, YYYY')}`
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion expanded={expanded['panel1']} onChange={handleChange('panel1')}>
            <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel1')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:user' />
              <Typography ml={2}>Account Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Account Status</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{`${
                    data?.data?.accountStatusDesc || ''
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Account Id</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{data?.data?.accountId || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Vehicle Stock Number</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{data?.data?.stkNumber || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Vehicle Make & Model</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                    {data?.data?.colletralDesc || ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Vehicle VIN</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{data?.data?.vin || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Last Located</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{`${data?.data?.city || ''} / ${
                    data?.data?.state || ''
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Loan Origination</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{`${data?.data?.city || ''} / ${
                    data?.data?.state || ''
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>IDMS AutoPay</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data?.data?.autoPay === 'TRUE' ? 'ON' : 'OFF'}
                    color={statusColors[data?.data?.autoPay === 'TRUE' ? 1 : 0]}
                    sx={{
                      textTransform: 'capitalize',
                      fontSize: 18
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>AuXDRIVE AutoPay</Typography>
                  <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      label={data?.data?.auxdriveAutopayStatus ? 'ON' : 'OFF'}
                      color={statusColors[data?.data?.auxdriveAutopayStatus ? 1 : 0]}
                      sx={{
                        textTransform: 'capitalize',
                        fontSize: 18
                      }}
                    />
                    {data?.data?.auxdriveAutopayStatus && (
                      <Tooltip title='Edit AutoPay status'>
                        <IconButton
                          color='inherit'
                          sx={{ width: 'fit-content', height: 'fit-content', p: 0, ml: 4 }}
                          onClick={handleAutoPayOpen}
                        >
                          <IconifyIcon icon='eva:edit-fill' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </Grid>
                {data?.data?.autoPaydetails?.PaymentDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>AutoPay Date</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{formatAutopayDate()}</Typography>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded['panel2']} onChange={handleChange('panel2')}>
            <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel2')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:shield' />
              <Typography ml={2}>Insurance Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={6}>
                {data?.data?.insurance?.tag && data?.data?.insurance?.tag !== '' && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Tag</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 16, textTransform: 'capitalize' }}>
                      {data?.data?.insurance?.tag || ''}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Company</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                    data?.data?.insurancedetails?.companyName || ''
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Policy #</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    {data?.data?.insurancedetails?.policy || ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Policy Status</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      label={data?.data?.insurancedetails?.policyStatus || ''}
                      color={data?.data?.insurancedetails?.policyStatus === 'Active Policy' ? 'success' : 'error'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Policy Expire</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    {data?.data?.insurancedetails?.expireDate ? moment(data.data.insurancedetails.expireDate).format('YYYY-MM-DD') : "-"}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', mt: 10 }}>
                <Button variant='contained' onClick={handleInsuranceOpen}>
                  Edit
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded['panel3']} onChange={handleChange('panel3')}>
            <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel3')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:briefcase' />
              <Typography ml={2}>Employer Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Employer Name</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                    data?.data?.borrower1EmployerName || ''
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Employment Status</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    {data?.data?.borrower1EmploymentStatus || ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Employment Income</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
                    {data?.data?.borrower1EmploymentIncome || ''}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', mt: 10 }}>
                <Button variant='contained' onClick={handleEmployerOpen}>
                  Edit
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded['panel4']} onChange={handleChange('panel4')}>
            <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel4')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:list' />
              <Typography ml={2}>PTP</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PTPListTable ptp={ptpData} />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Dialog Box for Insurance Submittion */}
      <Dialog open={openInsurance} onClose={handleInsuranceClose} maxWidth='sm' fullWidth>
        <FormProvider methods={methods} onSubmit={handleSubmitInsurance(onSubmitInsurance)}>
          <DialogTitle>Edit Insurance Detail</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)'
                  }}
                  mt={3}
                >
                  <RHFTextField name='company' label='Company' size='small' />
                  <RHFTextField name='policy' label='Policy #' size='small' />
                  <RHFSelect native name='policyStatus' label='Policy Status' size='small'>
                    <option key='1' value='activePolicy' label='Active Policy' />
                    <option key='2' value='expiredPolicy' label='Expired Policy' />
                    <option key='3' value='cancelledPolicy' label='Cancelled Policy' />
                  </RHFSelect>
                  <RHFDatePicker name='policyExpire' label='Policy Expired' size='small' />
                  <RHFTextField name='note' multiline rows={5} label='Add Insurance Note' size='small' />
                  {showCpcCheckbox && <RHFCheckbox defaultChecked={false} name='cpc' label='Force CPC' />}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInsuranceClose} color='inherit'>
              Cancel
            </Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmittingInsurance}>
              Update
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      {/* Dialog Box for Employer Detail Submittion */}
      <Dialog open={openEmployer} onClose={handleEmployerClose} maxWidth='sm' fullWidth>
        <FormProvider methods={employerMethods} onSubmit={handleSubmitEmployer(onSubmitEmployer)}>
          <DialogTitle>Edit Employer Detail</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)'
                  }}
                  mt={3}
                >
                  <RHFTextField name='employerName' label='Employer Name' />
                  <RHFTextField name='employerIncome' label='Employer Income' />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEmployerClose} color='inherit'>
              Cancel
            </Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmittingEmployer}>
              Update
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <Dialog open={openAutoPay} onClose={handleAutoPayClose} maxWidth='sm' fullWidth>
        <FormProvider methods={autoPayMethods} onSubmit={handleSubmitAutoPay(onSubmitAutoPay)}>
          <DialogTitle>AuXDRIVE AutoPay Status</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)'
                  }}
                  mt={3}
                >
                  <RHFSelect native name='autoPaytransactionStatus' label='Auto Pay Status'>
                    <option key='0' />
                    <option key='2' value='false' label='Pause' />
                    <option key='3' value='true' label='Continue' />
                    <option key='1' value='cancelled' label='Cancelled' />
                  </RHFSelect>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAutoPayClose} color='inherit'>
              Cancel
            </Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmittingAutoPay}>
              Update
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  )
}

export default General
