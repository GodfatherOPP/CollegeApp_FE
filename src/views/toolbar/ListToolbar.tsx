import * as Yup from 'yup'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
// @mui
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Tooltip } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
//
// import { getCalleridByCreatedBy } from 'src/redux/slices/callerId';
// import { RHFAutocomplete, RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
// import FormProvider from 'src/components/hook-form/FormProvider';
//
// import { SessionState } from 'sip.js';
// import { getPaymentReqResponse } from 'src/redux/slices/paymentlink';
// =======
// import { detectAudioVideoPermission } from 'src/utils/sipUtilsFunc';
// redux
// import { PATH_DASHBOARD } from 'src/routes/paths'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/hooks/hook-form'
import { RHFCheckbox } from 'src/hooks/hook-form/RHFCheckbox'
import { AppDispatch } from 'src/store'
import { sendTemplateMessage } from 'src/store/general/templateMessage'
import { getPaymentReqResponse } from 'src/store/general/paymentlink'

import { createTemplate, getTemplates } from 'src/store/management/templates'
import { detectAudioVideoPermission, getObjectCount } from 'src/utils/sipUtilsFunc'
import { getCalleridByCreatedBy } from 'src/store/dialer/callerId'
import {
  CallDirection,
  CallFunctionalityUsed,
  CallReasonFor,
  setSelectdPhoneNumber,
  updateSipState
} from 'src/store/dialer/sips'
import { SessionState } from 'sip.js'
import SendPaymentLink from '../sip/SendPaymentLink'
import { toast } from 'react-hot-toast'
import { PATH_DASHBOARD } from 'src/routes/paths'
// import useDialCall from 'src/hooks/useDialCall';
// import {
//   CallReasonFor,
//   ConnectingStatus,
//   setSelectdPhoneNumber,
//   updateSipState,
// } from 'src/redux/slices/sips';
// component
// import SendPaymentLink from 'src/pages/components/sip/TemplateMessageModal/SendPaymentLink';

// =======

// ----------------------------------------------------------------------

type Props = {
  options_Flags: any
  selected: string[]
  showPayReqDialogue?: any
  setRowSelectionModel?: any
}

// type SimProps = {
//   start: VoidFunction;
// };

interface FormValuesProps {
  saveTemplate: boolean
  template: any
  message: string
  selectedFields: Array<{}>
  name: string
}

export default function ListToolbar({ options_Flags, selected, showPayReqDialogue, setRowSelectionModel }: Props) {
  const { user } = useAuth()

  const [formType, setFormType] = useState('')
  const [open, setOpen] = useState(false)
  const [showSelectedFields, setShowSelectedFields] = useState(false)
  const [Fields, setFields] = useState([''])
  const [options, setOptions] = useState([{ name: '', _id: '' }])
  const [caretPosition, setCaretPosition] = useState(0)
  const templates = useSelector((state: any) => state.templates)
  const { selectedCustomer } = useSelector((state: any) => state.customers)
  const { isLoading } = useSelector((state: any) => state.payments)
  const [autoPayRequest, setAutoPayRequest] = useState(false)

  const {
    selectedPhoneNum,
    sessionState,
    CallStartPage,
    selectedCallStart,
    ongoingSelectedNumId,
    sessions,
    callDirection
  } = useSelector((state: any) => state.sip)
  const { startDialing } = useSelector((state: any) => state.dialer)

  const [openSendPaymetLink, setOpenSendPaymentLinkModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState({
    id: '',
    _id: '',
    name: '',
    data: '',
    status: false,
    fields: [],
    category: ''
  })
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const DataTemplateSchema = Yup.object().shape({
    template: Yup.string(),
    message: Yup.string().required('Message is required'),
    saveTemplate: Yup.boolean().required('It is required'),
    name: Yup.string().test('conditionalNameRequired', 'Name is required when saving template', function (value) {
      const { saveTemplate } = this.parent

      if (saveTemplate) {
        return Yup.string().required().isValidSync(value)
      }

      return true
    }),
    selectedFields: Yup.array().required('Fields is required')
  })

  /* eslint-disable react-hooks/exhaustive-deps */
  const defaultValues = useMemo(
    () => ({
      template: selectedTemplate?._id || '',
      saveTemplate: false,
      name: '',
      message: selectedTemplate?.data || '',
      selectedFields: selectedTemplate?.fields || []
    }),
    [selectedTemplate]
  )

  useEffect(() => {
    setFields(selectedTemplate?.fields)
    setShowSelectedFields(true)
  }, [selectedTemplate?._id])

  const FIELDS_OPTION = [
    'accountStatus',
    'firstName',
    'lastName',
    'email',
    'address',
    'city_state',
    'zipCode',
    'phoneNumber',
    'homeNumber',
    'cellNumber',
    'stkNumber',
    'ssnNum',
    'vin',
    'colletralDesc',
    'loanNumber',
    'loanAmount',
    'currentTotalBalance',
    'daysPastDue',
    'lastPaymentAmount',
    'lastPaidDate',
    'currentPaymentAmount',
    'currentDueDate',
    'nextDueAmount',
    'nextDueDate',
    'promiseDueDate',
    'promiseToPay',
    'autoPay',
    'alerts',
    'acctCurTotalBalance',
    'curDueAmt',
    'acctLastPaidDate',
    'acctLastPaidAmount',
    'lastPromiseDueDate',
    'lastPromiseStatusDesc',
    'balanceType',
    'borrower1EmployerName',
    'borrower1EmploymentStatus',
    'borrower1EmploymentIncome',
    'borrowerName',
    'borrowerSsn',
    'borrowerDob',
    'borrowerEmail',
    'borrowerHomePhone',
    'borrowerCellPhone',
    'bookedDate',
    'paymentLink',
    'autoPaymentLink'
  ]

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(DataTemplateSchema),
    defaultValues
  })

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting }
  } = methods

  const values = watch()

  const handlepaymentReq = () => {
    if (selected.length === 0) {
      toast.error('No row is selected')

      return
    }
    dispatch(getPaymentReqResponse({ selected }))
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
  }

  const handleClickOpen = (type: string) => {
    if (selected.length === 0) {
      toast.error('No row is selected')

      return
    }
    setFormType(type)
    setSelectedTemplate({
      id: '',
      _id: '',
      name: '',
      data: '',
      status: false,
      fields: [],
      category: ''
    })
    setFields([])
    setOpen(true)
    dispatch(
      getTemplates({
        q: '',
        category: type,
        status: 'active'
      })
    )
      .then((response: any) => {
        if (response?.statusCode === 200) {
          setOptions(response.data)
        }
      })
      .catch(error => {
        toast.error(error?.message)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setFormType('')
    setAutoPayRequest(false)
  }

  const handleAutoPayRequest = () => {
    setAutoPayRequest(true)
    handleClickOpen('text')
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data, Fields)
      dispatch(
        sendTemplateMessage(
          {
            template: {
              _id: data?.template,
              data: data?.message,
              fields: Fields,
              name: selectedTemplate?.name
            },
            selected
          },
          formType
        )
      )
        .then((response: any) => {
          if (response?.statusCode === 201) {
            toast.success(response?.message)
            setRowSelectionModel && setRowSelectionModel([])
          } else {
            toast.error(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      if (data.saveTemplate) {
        dispatch(
          createTemplate({
            name: data?.name,
            data: data?.message,
            category: selectedTemplate?.category,
            status: selectedTemplate?.status,
            fields: Fields
          })
        )
          .then((response: any) => {
            if (response?.statusCode === 200) {
              toast.success(response?.message)
              setRowSelectionModel && setRowSelectionModel([])
            } else {
              toast.error(response?.message)
            }
          })
          .catch(error => {
            toast.error(error?.message)
          })
      }
      handleClose()
    } catch (error) {
      handleClose()
    }
  }

  const onSubmitAutopayRequest = async (data: FormValuesProps) => {
    try {
      const template = {
        _id: data?.template,
        data: data?.message,
        fields: Fields,
        name: selectedTemplate?.name
      }

      dispatch(getPaymentReqResponse({ template, selected }))
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

      if (data.saveTemplate) {
        dispatch(
          createTemplate({
            name: data?.name,
            data: data?.message,
            category: selectedTemplate?.category,
            status: selectedTemplate?.status,
            fields: data?.selectedFields
          })
        )
          .then((response: any) => {
            if (response?.statusCode === 200) {
              toast.success(response?.message)
              setRowSelectionModel && setRowSelectionModel([])
            } else {
              toast.error(response?.message)
            }
          })
          .catch(error => {
            toast.error(error?.message)
          })
      }
      handleClose()
    } catch (error) {
      handleClose()
    }
  }

  const makeCall = async () => {
    const check_permission = await detectAudioVideoPermission()
    if (selected.length === 0) {
      toast.error('No row is selected')
    }
    if (![true, 'TRUE'].includes(check_permission)) {
      toast.error(check_permission as string)
    }

    if (selectedPhoneNum.length > 0) {
      await dispatch(getCalleridByCreatedBy())
      dispatch(updateSipState({ key: 'CallStartPage', value: router?.pathname }))
      dispatch(updateSipState({ key: 'ongoingSelectedNumId', value: selectedPhoneNum[0] }))
      dispatch(updateSipState({ key: 'selectedCustomerId', value: selectedPhoneNum[0] }))
      dispatch(updateSipState({ key: 'callcampaignModalToggle', value: true }))
      dispatch(updateSipState({ key: 'notesAddedd', value: false }))
      dispatch(updateSipState({ key: 'sessionState', value: '' }))
      dispatch(updateSipState({ key: 'CallFunctionalityUse', value: CallFunctionalityUsed.SelectedCall }))
    }
  }

  useEffect(() => {
    reset(defaultValues)
    selectedTemplate?.fields
  }, [selectedTemplate])

  useEffect(() => {
    if (values.template !== '') {
      templates.templates?.map((data: any) => data?._id === values.template && setSelectedTemplate(data))
    }
  }, [values.template, templates])

  const handleTextFieldBlur = (e: any) => {
    setCaretPosition(e.target.selectionStart)
  }

  const handleAutocompleteChange = (e: any, val: any) => {
    setFields(val)
    if (val.length > 0) {
      const selectedValue = val[val.length - 1]
      const newTextFieldValue = `${values.message.substring(
        0,
        caretPosition
      )}{${selectedValue}}${values.message.substring(caretPosition)}`
      setSelectedTemplate({ ...selectedTemplate, ...{ data: newTextFieldValue } })
    }
  }

  const SetCallReasonForState = () => {
    switch (router?.pathname) {
      case PATH_DASHBOARD.campaignRepos.list:
        dispatch(updateSipState({ key: 'CallReason', value: CallReasonFor.Repos }))
        break
      case PATH_DASHBOARD.campaignInsurance.root:
        dispatch(updateSipState({ key: 'CallReason', value: CallReasonFor.Insurance }))
        break
      case '/department/finance/arrangement':
        dispatch(updateSipState({ key: 'CallReason', value: CallReasonFor.AMENDMENT }))
        break
      default:
        dispatch(updateSipState({ key: 'CallReason', value: CallReasonFor.Customer }))
    }
  }

  const setSelcetdCustomer = () => {
    if (!selectedCallStart || (selectedCallStart && CallStartPage === router?.pathname)) {
      dispatch(updateSipState({ key: 'ongoingSelectedNumId', value: selected[0] }))
      dispatch(updateSipState({ key: 'selectedCustomerApiCall', value: false }))
      dispatch(setSelectdPhoneNumber(selected))
      SetCallReasonForState()
    }
  }

  useEffect(() => {
    if (callDirection !== CallDirection.Inbound) {
      setSelcetdCustomer()
    }
  }, [selected, router?.pathname, CallStartPage, selectedCallStart, callDirection])

  useEffect(() => {
    if (
      selected.length > 0 &&
      router?.query?.name !== undefined &&
      [SessionState.Terminated, ''].includes(sessionState) &&
      selectedPhoneNum.length === 0 &&
      callDirection !== CallDirection.Inbound
    ) {
      dispatch(updateSipState({ key: 'ongoingSelectedNumId', value: selected[0] }))
      dispatch(setSelectdPhoneNumber(selected))
    }
  }, [selected, router?.query, sessionState, selectedPhoneNum, callDirection])

  const sendPaymentLinkHandler = () => {
    setOpenSendPaymentLinkModal(true)
  }

  const sendPaymentLinkModalClose = () => {
    setOpenSendPaymentLinkModal(false)
  }

  useEffect(() => {
    if (sessionState === SessionState.Terminated && selectedCallStart && selectedPhoneNum.length > 0) {
      setRowSelectionModel && setRowSelectionModel(selectedPhoneNum)
    }
  }, [sessionState, selectedCallStart, selectedPhoneNum])

  useEffect(() => {
    if (
      selectedCallStart &&
      ![undefined, null, ''].includes(ongoingSelectedNumId) &&
      !selected.includes(ongoingSelectedNumId) &&
      !selectedPhoneNum.includes(ongoingSelectedNumId)
    ) {
      setRowSelectionModel && setRowSelectionModel((prev: any) => [ongoingSelectedNumId, ...prev])
    }
  }, [ongoingSelectedNumId, selected, selectedCallStart, selectedPhoneNum])

  return (
    <Stack spacing={2} direction={{ xs: 'row' }} flexWrap={'wrap'} alignItems={{ xs: 'center' }} sx={{ mb: 2 }}>
      <Tooltip title='Back'>
        <Button
          variant='outlined'
          startIcon={<IconifyIcon icon='ic:baseline-arrow-back' />}
          onClick={() => router.back()}
          sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
        />
      </Tooltip>
      {options_Flags?.smsProviderFlag && (
        <Tooltip title='Payment Request'>
          <LoadingButton
            variant='outlined'
            startIcon={<IconifyIcon icon='ic:baseline-payments' />}
            onClick={() => (showPayReqDialogue ? sendPaymentLinkHandler() : handlepaymentReq())}
            sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
            loading={isLoading}
          />
        </Tooltip>
      )}
      {options_Flags?.smsProviderFlag && (
        <Tooltip title='Autopay Request'>
          <LoadingButton
            variant='outlined'
            startIcon={<IconifyIcon icon='mdi:recurring-payment' />}
            onClick={handleAutoPayRequest}
            sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
            loading={isLoading}
          />
        </Tooltip>
      )}
      {options_Flags?.smsProviderFlag && (
        <Tooltip title='Text/SMS'>
          <Button
            variant='outlined'
            startIcon={<IconifyIcon icon='ic:baseline-textsms' />}
            onClick={() => handleClickOpen('text')}
            sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
          />
        </Tooltip>
      )}
      {options_Flags?.emailFlag && (
        <Tooltip title='Email'>
          <Button
            variant='outlined'
            startIcon={<IconifyIcon icon='ic:baseline-email' />}
            onClick={() => handleClickOpen('email')}
            sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
          />
        </Tooltip>
      )}

      {options_Flags?.callDialerFlag && (
        <>
          <Tooltip title='Call'>
            <Button
              variant='outlined'
              startIcon={<IconifyIcon icon='ic:baseline-phone' />}
              sx={{ '& .MuiButton-startIcon': { margin: 0 }, maxWidth: 60 }}
              onClick={makeCall}
              disabled={selectedCallStart || startDialing || (getObjectCount(sessions) > 0 ? true : false)}
            />
          </Tooltip>
        </>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <FormProvider
          methods={methods}
          onSubmit={autoPayRequest ? handleSubmit(onSubmitAutopayRequest) : handleSubmit(onSubmit)}
        >
          <DialogTitle>Select Template</DialogTitle>
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
                  <RHFSelect native name='template' label='Template' size='small'>
                    <option value='' label='' />
                    {options.map((opt, i) => (
                      <option key={i} value={opt?._id} label={opt?.name} />
                    ))}
                  </RHFSelect>
                  <RHFTextField
                    name='message'
                    label='Message'
                    size='small'
                    multiline
                    minRows={8}
                    inputProps={
                      user?.roles?.id === 3 || !options_Flags?.editMessageTemplateFlag
                        ? {
                            readOnly: false
                          }
                        : { readOnly: true }
                    }
                    onBlur={handleTextFieldBlur}
                  />
                  {(user?.roles?.id === 2 || options_Flags?.editMessageTemplateFlag) && values?.saveTemplate && (
                    <RHFTextField name='name' label='New Template Name' />
                  )}

                  {(user?.roles?.id === 2 || options_Flags?.editMessageTemplateFlag) && showSelectedFields && (
                    <RHFAutocomplete
                      multiple
                      size='small'
                      name='selectedFields'
                      label='Select Fields'
                      value={Fields}
                      options={FIELDS_OPTION}
                      getOptionLabel={option => option}
                      filterSelectedOptions
                      onChange={handleAutocompleteChange}
                    />
                  )}
                  {(user?.roles?.id === 2 || options_Flags?.editMessageTemplateFlag) && (
                    <Box
                      columnGap={2}
                      display='grid'
                      gridTemplateColumns={{
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(2, 1fr)'
                      }}
                    >
                      <Button onClick={() => setShowSelectedFields(!showSelectedFields)} color='inherit'>
                        [Selected Fields]
                      </Button>
                      <RHFCheckbox name='saveTemplate' label='Save as Template' />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='inherit'>
              Cancel
            </Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Send
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <SendPaymentLink
        open={openSendPaymetLink}
        handleClose={sendPaymentLinkModalClose}
        customerData={selectedCustomer}
      />
    </Stack>
  )
}
