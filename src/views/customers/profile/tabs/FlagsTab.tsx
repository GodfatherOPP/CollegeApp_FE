/* eslint-disable react-hooks/exhaustive-deps */
// ** React data
import { useEffect, useMemo, useState, SyntheticEvent } from 'react'

// ** MUI data
import Grid from '@mui/material/Grid'
// ** Third Party data
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

// ** Store data
import { useDispatch, useSelector } from 'react-redux'

// ** Types data
import { AppDispatch } from 'src/store'
import { Typography } from '@mui/material'

// ** Custom Components
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { RHFMultiCheckbox } from 'src/hooks/hook-form/RHFCheckbox'
import { LoadingButton } from '@mui/lab'
import { useAuth } from 'src/hooks/useAuth'
import { getAllFlagsByadminId, updateImport } from 'src/store/finance/customers'
import { getUserDetails } from 'src/store/management/user'
import { toast } from 'react-hot-toast'
import { RHFTextField } from 'src/hooks/hook-form'
import { Accordion, AccordionSummary, AccordionDetails } from './CustomComponent'
import IconifyIcon from 'src/@core/components/icon'

type Props = {
  importedId: string
}

const FlagsTab = ({ importedId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const data = useSelector((state: any) => state.customers.flags)
  const selectedCustomer = useSelector((state: any) => state?.customers?.selectedCustomer)
  const adminSettings = useSelector((state: any) => state?.user?.selectedUser?.adminSetting)
  const [flags, setFlags] = useState([{ label: 'No Flags Yet', value: '' }])
  const [dbSelectedFlags, setDbSelectedFlags] = useState([{ Flag: '' }])
  const [expanded, setExpanded] = useState<any>({ panel1: true, panel2: true })

  useEffect(() => {
    const id = user?.roles?.id === 3 ? user?.createdBy?._id : user?._id
    const fetchData = async () => {
      await dispatch(getAllFlagsByadminId(id))
      await dispatch(getUserDetails(id?.toString() || ''))
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    if (data?.length > 0) {
      const arr1: any = []
      const arr2: any = []
      data?.map((tempFlag: any) => {
        if (adminSettings?.flags?.find((f: string) => f === tempFlag._id)) {
          return arr1.push({ label: tempFlag.Flag, value: tempFlag._id })
        }

        return arr2.push({ label: tempFlag.Flag, value: tempFlag._id })
      })
      setFlags([...arr1, ...arr2])
      // if (selectedCustomer?.ApiData?.Acct_ID) setSelectedFlags(selectedCustomer?.ApiData?.Flags);
      if (selectedCustomer?.data?.flags) setDbSelectedFlags(selectedCustomer?.data?.flags)
      else if (selectedCustomer?.flags) setDbSelectedFlags(selectedCustomer?.flags)
    }
  }, [data, selectedCustomer?.data?.flags, selectedCustomer?.flags])

  const activeFlags = useMemo(() => {
    const flagsArray: any[] = []
    flags?.forEach((flag: any) => {
      const temp = dbSelectedFlags?.find(Data => Data?.Flag === flag.label || Data === flag.value)
      if (temp) flagsArray.push(flag.value)
    })

    return flagsArray
  }, [dbSelectedFlags, flags])

  const CampaignSchema = Yup.object().shape({
    flags: Yup.array().nullable()
  })
  const defaultValues: any = useMemo(
    () => ({
      flags: activeFlags
    }),
    [activeFlags]
  )

  const methods = useForm({
    resolver: yupResolver(CampaignSchema),
    defaultValues
  })

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    if (data) {
      reset(defaultValues)
    }
  }, [data])

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setValue('flags', activeFlags) // Set the default values for 'flags' field after a delay
      }, 100)
    }
  }, [data, activeFlags, setValue])

  const onSubmit = async (formData: any) => {
    const DataFlags = formData?.flags.filter((flag: any) => flag !== '')
    try {
      dispatch(
        updateImport({
          id: importedId,
          flags: DataFlags
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
    } catch (error) {
      console.error(error)
    }
  }

  const AppBarSchema = Yup.object().shape({
    appBar: Yup.string()
  })

  const appBarDefaultValues: any = useMemo(
    () => ({
      appBar: selectedCustomer?.appBar || ''
    }),
    [activeFlags]
  )

  const appBarMethods = useForm({
    resolver: yupResolver(AppBarSchema),
    defaultValues: appBarDefaultValues
  })

  const submitAppBar = appBarMethods.handleSubmit
  const isSubmitingAppBar = appBarMethods?.formState?.isSubmitting

  const onSubmitAppBar = async (formData: any) => {
    try {
      dispatch(
        updateImport({
          id: importedId,
          appBar: formData.appBar
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
    } catch (error) {
      console.error(error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded((prevState: any) => ({
      ...prevState,
      [panel]: !prevState[panel]
    }))
  }
  const expandIcon = (value: string) => <IconifyIcon icon={expanded[value] ? 'tabler:minus' : 'tabler:plus'} />

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion expanded={expanded['panel1']} onChange={handleChange('panel1')}>
            <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel1')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:list' />
              <Typography ml={2}>Flag List</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <RHFMultiCheckbox
                      name='flags'
                      options={flags}
                      defaultSelected={[]}
                      grid
                      gridColumn={5}
                      icon={undefined}
                      checkedIcon={undefined}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                      Update
                    </LoadingButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded['panel2']} onChange={handleChange('panel2')}>
            <AccordionSummary id='panel-header-2' aria-controls='panel-content-2' expandIcon={expandIcon('panel2')}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:bulb' />
              <Typography ml={2}>Alert Text</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormProvider methods={appBarMethods} onSubmit={submitAppBar(onSubmitAppBar)}>
                <Grid container spacing={6}>
                  <Grid item md={6} sm={8} xs={12}>
                    <RHFTextField name='appBar' label='Enter Alert Text' size='small' />
                  </Grid>
                  <Grid item md={6} sm={2} xs={12}>
                    <LoadingButton type='submit' variant='contained' loading={isSubmitingAppBar}>
                      Add
                    </LoadingButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  )
}

export default FlagsTab
