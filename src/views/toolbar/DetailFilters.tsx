import * as Yup from 'yup'
import { useMemo, useState, useEffect, useRef } from 'react'
// @mui
import {
  Stack,
  Dialog,
  DialogActions,
  Box,
  Button,
  Tooltip,
  IconButton,
  Drawer,
  styled,
  BoxProps,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material'

// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { PDFViewer } from '@react-pdf/renderer'
// components
//
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { RHFSelect, RHFTextField } from 'src/hooks/hook-form'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { createAmendments } from 'src/store/general/amendment'
import { createInsuranceNote } from 'src/store/general/insurance'
import { RTCPDF } from '../doc'
import { toast } from 'react-hot-toast'
import { createInternalNotes } from 'src/store/general/internalNote'
import RHFDatePicker from 'src/hooks/hook-form/RHFDatePicker'
import { createPtp, getCustomerDetail } from 'src/store/finance/customers'
// ----------------------------------------------------------------------

const AMENDMENT_OPTIONS = [
  { label: 'Pending', value: 0 },
  { label: 'Completed', value: 1 },
  { label: 'Waiting For Docs', value: 2 },
  { label: 'Needs Follow-Up', value: 3 },
  { label: 'Rejected', value: 4 }
]

const AMENDMENT_Type = [
  { label: 'AMENDMENT', value: 'AMENDMENT' },
  { label: 'FRESH START', value: 'FRESH_START' },
  { label: 'SPLIT PAYMENT', value: 'SPLIT_PAYMENT' },
  { label: 'DEFERMENT', value: 'DEFERMENT' }
]

type Props = {
  options_Flags: any
  imports: any
  completeImportData: any
}

interface AmendmentFormValuesProps {
  description: string
  status: number
  type: string
  amount: string
}

interface InsuranceFormValuesProps {
  note: string
  InsuranceStatus: string
}

interface RTCFormValuesProps {
  amount: string
  description: string
}
interface PTPFormValuesProps {
  amount: string
  date: string
  deliveryMethod: string
  note: string
}
interface InternalNoteFormValuesProps {
  title: string
  note: string
}
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

export default function DetailFilters({ imports, completeImportData }: Props) {
  const isFirstRender = useRef(true)

  const [selectedAction, setSelectedAction] = useState('')
  const [openRTC, setRTCOpen] = useState(false)
  const [openPTP, setPTPOpen] = useState(false)
  const [openInternalNotes, setOpenInternalNotes] = useState(false)
  const [openInsurance, setInsuranceOpen] = useState(false)
  const [openAmendment, setAmendmentOpen] = useState(false)
  const [filePDF, setFilePDF] = useState<React.ReactElement>()
  const [openPreview, setOpenPreview] = useState(false)
  const [emailRtc, setEmailRtc] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const dealerId = user?.roles?.id === 3 ? user?.createdBy._id : user?._id

  const AmendmentSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Amendment Type is required'),
    status: Yup.number().required('Status is required')
  })

  const InsuranceSchema = Yup.object().shape({
    note: Yup.string().required('Note is required'),
    InsuranceStatus: Yup.string().required('Status is required')
  })

  const RTCSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is required'),
    description: Yup.string().required('Description is required')
  })
  const PTPSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is required'),
    date: Yup.string().required('Date is required'),
    note: Yup.string().required('Note is required'),
    deliveryMethod: Yup.string().required('Delivery Method is required')
  })
  const InternalNoteSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    note: Yup.string().required('Note is required')
  })

  const defaultValues = useMemo(
    () => ({
      description: '',
      status: 0,
      note: '',
      type: 'AMENDMENT',
      InsuranceStatus: 'pending',
      amount: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const InternalNoteDefaultValues = useMemo(
    () => ({
      title: '',
      note: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const PTPDefaultValues = useMemo(
    () => ({
      amount: '',
      deliveryMethod: 'Unknown',
      date: new Date().toString(),
      note: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const methods = useForm<AmendmentFormValuesProps>({
    resolver: yupResolver(AmendmentSchema),
    defaultValues
  })
  const InternalNoteMethods = useForm<InternalNoteFormValuesProps>({
    resolver: yupResolver(InternalNoteSchema),
    defaultValues: InternalNoteDefaultValues
  })

  const methods2 = useForm<InsuranceFormValuesProps>({
    resolver: yupResolver(InsuranceSchema),
    defaultValues
  })

  const methods3 = useForm<RTCFormValuesProps>({
    resolver: yupResolver(RTCSchema),
    defaultValues
  })
  const methodsPtp = useForm<PTPFormValuesProps>({
    resolver: yupResolver(PTPSchema),
    defaultValues: PTPDefaultValues
  })
  const handleSubmitAmendment = methods.handleSubmit
  const resetAmendment = methods.reset

  const handleSubmitInsurance = methods2.handleSubmit
  const resetInsurance = methods2.reset

  const handleSubmitRTC = methods3.handleSubmit
  const resetRTC = methods3.reset
  const values = methods3.watch()

  const handleSubmitPTP = methodsPtp.handleSubmit
  const resetPTP = methodsPtp.reset
  const ptpValues = methodsPtp.watch()

  const handleSubmitInternalNote = InternalNoteMethods.handleSubmit
  const resetInternalNote = InternalNoteMethods.reset

  useEffect(() => {
    setFilePDF(<RTCPDF data={values} imports={imports} />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.amount, values.description])

  const handleAmendmentOpen = () => {
    setAmendmentOpen(true)
  }

  const handleAmendmentClose = () => {
    setAmendmentOpen(false)
  }

  const handleInsuranceOpen = () => {
    setInsuranceOpen(true)
  }

  const handleInsuranceClose = () => {
    setInsuranceOpen(false)
  }

  const handleRTCOpen = () => {
    setRTCOpen(true)
  }

  const handleRTCClose = () => {
    setRTCOpen(false)
  }
  const handlePTPOpen = () => {
    setPTPOpen(true)
  }

  const handlePTPClose = () => {
    setPTPOpen(false)
  }
  const handleInternalNotesOpen = () => {
    setOpenInternalNotes(true)
  }

  const handleInternalNotesClose = () => {
    setOpenInternalNotes(false)
  }

  const handleOpenPreview = () => {
    setOpenPreview(true)
  }

  const handleClosePreview = () => {
    setOpenPreview(false)
  }

  const onSubmitAmendment = async (data: AmendmentFormValuesProps) => {
    try {
      await dispatch(
        createAmendments({
          customer: imports?._id,
          createdBy: user?._id,
          dealer: dealerId,
          ...data
        })
      )
        .then(response => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      resetAmendment()
      handleAmendmentClose()
    } catch (error) {
      console.error(error)
      handleAmendmentClose()
    }
  }

  const onSubmitInsurance = async (data: InsuranceFormValuesProps) => {
    try {
      const newInsuranceDetails = {
        ImportedDataId: completeImportData?.data?._id || '',
        borrowerName: completeImportData?.ApiData?.BorrowerName,
        acct: completeImportData?.data?.accountId,
        stk: completeImportData?.data?.stkNumber,
        InsuranceStatus: data?.InsuranceStatus,
        cellPhone: completeImportData?.data?.cellNumber,
        daysPD: completeImportData?.data?.daysPastDue,
        curDueAmt: completeImportData?.data?.curDueAmt,

        insStatus: completeImportData?.ApiData?.InsStatus,
        lastNote: completeImportData?.ApiData?.LastNoteDate,
        promiseDate: completeImportData?.ApiData?.LastPromiseDate,
        promisedDate: completeImportData?.ApiData?.LastPromiseDueDate,
        promisedAmt: completeImportData?.ApiData?.LastPromiseAmount,
        promiseStatus: completeImportData?.ApiData?.LastPromiseStatus,
        totalBalance: completeImportData?.data?.acctCurTotalBalance,
        coBorrowerName: completeImportData?.ApiData?.CoBorrowerName,
        loan: completeImportData?.ApiData?.LoanNumber,
        insExp: completeImportData?.ApiData?.ExpDate,
        collateralDescription: `${completeImportData?.ApiData?.Collateral_Year} ${completeImportData?.ApiData?.Collateral_Make} ${completeImportData?.ApiData?.Collateral_Model}`,
        // totalCurSideLoanBalance: data?.Row?.TotalCurSideLoanBalance,
        // recency: data?.Row?.Recency,
        // homePhone: data?.Row?.HomePhone,
        // insLoanCPICurPrinBal: data?.Row?.InsLoanCPICurPrinBal,
        insurance: {
          insStatus: data?.InsuranceStatus,
          company: completeImportData?.data?.insurance?.company,
          policy: completeImportData?.data?.insurance?.policy,
          policyExpire: completeImportData?.data?.insurance?.policyExpire
        }
      }
      await dispatch(
        createInsuranceNote({
          data: {
            customer: imports?._id,
            createdBy: user?._id,
            dealer: dealerId,
            type: 'Insurance',
            note: data?.note,
            newInsuranceDetails
          }
        })
      )
        .then((response: any) => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch((error: any) => {
          toast.error(error?.message)
        })
      resetInsurance()
      handleInsuranceClose()
    } catch (error) {
      console.error(error)
      handleInsuranceClose()
    }
  }

  const handleRtcSubmitClick = (x: boolean) => {
    setEmailRtc(x)
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      onSubmitRTC(values)
    }
  }, [emailRtc]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitRTC = async (data: RTCFormValuesProps) => {
    try {
      await dispatch(
        createAmendments({
          customer: imports?._id,
          createdBy: user?._id,
          dealer: dealerId,
          CustomerData: imports,
          isEmail: emailRtc,
          ...data
        })
      )
        .then(response => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })

      resetRTC()
      handleRTCClose()
    } catch (error) {
      console.error(error)
      handleRTCClose()
    }
  }
  const onSubmitPTP = async (data: PTPFormValuesProps) => {
    try {
      await dispatch(
        createPtp({
          customerId: imports?._id,
          payment_date: data.date,
          delivery_method: data.deliveryMethod,
          amount: data.amount,
          note: data.note
        })
      )
        .then(async response => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
            await dispatch(getCustomerDetail(imports?._id))
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })

      resetPTP()
      handlePTPClose()
    } catch (error) {
      console.error(error)
      handlePTPClose()
    }
  }

  const onSubmitInternalNote = async (data: InternalNoteFormValuesProps) => {
    try {
      await dispatch(
        createInternalNotes({
          customerId: imports?._id,
          ...data
        })
      )
        .then(response => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      resetInternalNote()
      handleInternalNotesClose()
    } catch (error) {
      console.error(error)
      handleRTCClose()
    }
  }
  const handleChange = (val: string) => {
    setSelectedAction(val)
    switch (val) {
      case 'ptp':
        handlePTPOpen()
        break

      case 'rtc':
        handleRTCOpen()
        break
      case 'insurance':
        handleInsuranceOpen()
        break
      case 'amendment':
        handleAmendmentOpen()
        break
      case 'internalNote':
        handleInternalNotesOpen()
        break
      default:
        break
    }
  }

  return (
    <Stack>
      <FormControl fullWidth>
        <InputLabel id='select-actions' size='small'>
          Actions
        </InputLabel>
        <Select
          size='small'
          labelId='select-actions'
          label='Actions'
          value={selectedAction}
          onChange={e => handleChange(e.target.value)}
          onOpen={() => setSelectedAction('')}
        >
          <MenuItem value=''>None</MenuItem>
          <MenuItem value='ptp'>PTP</MenuItem>
          <MenuItem value='rtc'>RTC</MenuItem>
          <MenuItem value='insurance'>Insurance</MenuItem>
          <MenuItem value='amendment'>Arrangement</MenuItem>
          <MenuItem value='internalNote'>
            <IconifyIcon icon='tabler:pencil' fontSize='1.125rem' />
            &nbsp; Note Pad
          </MenuItem>
        </Select>
      </FormControl>
      {/* Drawer for Amendment Submittion */}
      <Drawer
        open={openAmendment}
        anchor='right'
        variant='temporary'
        onClose={handleAmendmentClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Create Amendment</Typography>
          <IconButton
            size='small'
            onClick={handleAmendmentClose}
            sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
          >
            <IconifyIcon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <FormProvider methods={methods} onSubmit={handleSubmitAmendment(onSubmitAmendment)}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)'
              }}
              mt={3}
            >
              <RHFTextField name='description' label='Description' multiline minRows={8} />
              <RHFSelect native name='type' label='Type'>
                <option />
                {AMENDMENT_Type?.map((option, index) => (
                  <option key={index} value={option?.value} label={option?.label} />
                ))}
              </RHFSelect>
              <RHFSelect native name='status' label='Status'>
                <option />
                {AMENDMENT_OPTIONS?.map((option, index) => (
                  <option key={index} value={option?.value} label={option?.label} />
                ))}
              </RHFSelect>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
              <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                Create
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleAmendmentClose}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Drawer>
      {/* Drawer for Insurance Submittion */}
      <Drawer
        open={openInsurance}
        anchor='right'
        variant='temporary'
        onClose={handleInsuranceClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Create Insurance</Typography>
          <IconButton
            size='small'
            onClick={handleInsuranceClose}
            sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
          >
            <IconifyIcon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <FormProvider methods={methods2} onSubmit={handleSubmitInsurance(onSubmitInsurance)}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)'
              }}
              mt={3}
            >
              <RHFTextField name='note' label='Add Note' multiline minRows={8} size='small' />
              <RHFSelect native name='InsuranceStatus' label='Status' placeholder='Status' size='small'>
                <option key={0} value='pending' label='Pending' />
                <option key={1} value='completed' label='Completed' />
                <option key={2} value='renewed' label='Renewed' />
                <option key={3} value='new' label='New' />
                <option key={4} value='expired' label='Expired' />
                <option key={5} value='cancelled' label='Cancelled' />
              </RHFSelect>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
              <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                Create
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleInsuranceClose}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Drawer>
      {/* Dialog Box for PTP Submittion */}
      <Drawer
        open={openPTP}
        anchor='right'
        variant='temporary'
        onClose={handlePTPClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Create PTP</Typography>
          <IconButton
            size='small'
            onClick={handlePTPClose}
            sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
          >
            <IconifyIcon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <FormProvider methods={methodsPtp} onSubmit={handleSubmitPTP(onSubmitPTP)}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)'
              }}
              mt={3}
            >
              <RHFTextField name='amount' label='Amount' />
              <RHFDatePicker name='date' label='Select Date' />
              <RHFSelect native name='deliveryMethod' label='Delivery Method'>
                <option value='Unknown'>Unknown</option>
                <option value='Walk_In'>Walk In</option>
                <option value='Mail'>Mail</option>
                <option value='Phone'>Phone</option>
                <option value='Web'>Web</option>
                <option value='Fax'>Fax</option>
                <option value='LockboxEmail'>Lockbox Email</option>
                <option value='Text'>Text</option>
                <option value='IVR'>IVR</option>
                <option value='Kiosk'>Kiosk</option>
              </RHFSelect>
              <RHFTextField name='note' label='Note' multiline rows={8} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5, justifyContent: 'space-between' }}>
              <Button type='submit' variant='contained' sx={{ mr: 3, ml: 3 }}>
                Create
              </Button>
              <Button variant='outlined' color='secondary' onClick={handlePTPClose}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Drawer>
      {/* Dialog Box for RTC Submittion */}
      <Drawer
        open={openRTC}
        anchor='right'
        variant='temporary'
        onClose={handleRTCClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Create RTC</Typography>
          <IconButton
            size='small'
            onClick={handleRTCClose}
            sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
          >
            <IconifyIcon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <FormProvider methods={methods3} onSubmit={handleSubmitRTC(onSubmitRTC)}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)'
              }}
              mt={3}
            >
              <RHFTextField name='amount' label='Amount' />
              <RHFTextField name='description' label='Description' multiline rows={8} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5, justifyContent: 'space-between' }}>
              <Button
                variant='contained'
                startIcon={<IconifyIcon icon='eva:eye-fill' />}
                onClick={() => {
                  if (values.amount && values.amount !== '' && values.description && values.description !== '')
                    handleOpenPreview()
                }}
              >
                Preview
              </Button>
              {/* <Button type='submit' variant='contained' sx={{ mr: 3, ml: 3 }}>
                Create
              </Button> */}
              <Button variant='outlined' color='secondary' onClick={handleRTCClose}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Drawer>

      {/* Dialog Box for Internal Notes */}
      <Drawer
        open={openInternalNotes}
        anchor='right'
        variant='temporary'
        onClose={handleInternalNotesClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Create Internal Note</Typography>
          <IconButton
            size='small'
            onClick={handleInternalNotesClose}
            sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
          >
            <IconifyIcon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <FormProvider methods={InternalNoteMethods} onSubmit={handleSubmitInternalNote(onSubmitInternalNote)}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)'
              }}
              mt={3}
            >
              <RHFTextField name='title' label='Title' />
              <RHFTextField name='note' label='Description' multiline minRows={8} placeholder='Enter note here.....' />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
              <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                Create
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleInternalNotesClose}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Drawer>
      <Dialog fullScreen open={openPreview}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important'
              // boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title='Create'>
              <IconButton color='inherit' onClick={() => handleRtcSubmitClick(false)}>
                <IconifyIcon icon='cil:send' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Create And Email'>
              <IconButton color='inherit' onClick={() => handleRtcSubmitClick(true)}>
                <IconifyIcon icon='carbon:email-new' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Close'>
              <IconButton color='inherit' onClick={handleClosePreview}>
                <IconifyIcon icon='eva:close-fill' />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              {filePDF}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Stack>
  )
}
