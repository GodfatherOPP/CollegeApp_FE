// ** React Imports
import { useMemo, useState } from 'react'
import * as Yup from 'yup'
// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { Drawer, IconButton, keyframes, styled } from '@mui/material'
import { RHFTextField } from 'src/hooks/hook-form'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { getCustomerDetail, updateDndStatus, updateImport } from 'src/store/finance/customers'
import { toast } from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import ConfirmDialog from 'src/views/confirm-dialog/ConfirmDialog'
import AuthorizedPersonForm from './AuthorizedPersonForm'

const statusColors: ThemeColor[] = ['error', 'success', 'warning']

interface PageProp {
  toggle: () => void
  customers: any
  PRIORITY_FLAG: any
  imports: any
}

interface FormValuesProps {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  homePhone: string
  cellPhone: string
  workPhone: string
  email: string
}

const REPO_STATUS_OPTIONS = [
  { id: 0, label: 'Out For Repo' },
  { id: 1, label: 'Pending Pickup (72HRS)' },
  { id: 2, label: "Can't Find" },
  { id: 3, label: 'Skip Trace' },
  { id: 4, label: ' Repossess' },
  { id: 5, label: 'Un recovered' }
]

const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
`
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const BlinkingDiv = styled('div')`
  animation: ${blinkAnimation} 1.5s infinite;
`
const CustomerViewLeft = (prop: PageProp) => {
  const dispatch = useDispatch<AppDispatch>()
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [dndOpen, setDndOpen] = useState(false)
  const store = useSelector((state: any) => state.customers)
  const data: any = store.selectedCustomer
  const [dialogOpen, setDialogOpen] = useState(false)

  const PersonalSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required'),
    cellPhone: Yup.string().required('Cell Number is required'),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
    homePhone: Yup.string(),
    workPhone: Yup.string()
  })
  const PersonaldefaultValues = useMemo(
    () => ({
      firstName: data?.data?.firstName || '',
      lastName: data?.data?.lastName || '',
      address: data?.data?.address1 || '',
      city: data?.data?.city || '',
      state: data?.data?.state || '',
      zipCode: data?.data?.zipCode || '',
      homePhone: data?.data?.homeNumber || '',
      cellPhone: data?.data?.cellNumber || '',
      workPhone: data?.data?.workNumber || '',
      email: data?.data?.email || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PersonalSchema),
    defaultValues: PersonaldefaultValues
  })

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = methods
  const onSubmitPersonal = async (personalData: FormValuesProps) => {
    try {
      dispatch(
        updateImport({
          id: data?.data?._id,
          firstName: personalData?.firstName,
          lastName: personalData?.lastName,
          address1: personalData?.address,
          city: personalData?.city,
          state: personalData?.state,
          zipCode: personalData?.zipCode,
          homeNumber: personalData?.homePhone,
          cellNumber: personalData?.cellPhone,
          phoneNumber: personalData?.workPhone,
          email: personalData?.email
        })
      )
        .then((response: any) => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
          } else {
            toast.success(response?.message)
          }
        })
        .catch(error => {
          toast.error(error?.message)
        })
      handleEditClose()
    } catch (error) {
      console.error(error)
      handleEditClose()
    }
  }
  // Handle Edit dialog
  const handleEditClickOpen = () => {
    setValue('firstName', PersonaldefaultValues.firstName)
    setValue('lastName', PersonaldefaultValues.lastName)
    setValue('address', PersonaldefaultValues.address)
    setValue('city', PersonaldefaultValues.city)
    setValue('state', PersonaldefaultValues.state)
    setValue('zipCode', PersonaldefaultValues.zipCode)
    setValue('homePhone', PersonaldefaultValues.homePhone)
    setValue('cellPhone', PersonaldefaultValues.cellPhone)
    setValue('workPhone', PersonaldefaultValues.workPhone)
    setValue('email', PersonaldefaultValues.email)
    setOpenEdit(true)
  }
  const handleEditClose = () => setOpenEdit(false)

  const handleDndUpdate = () => {
    dispatch(updateDndStatus(data?.data?._id, data?.data?.dndStatus === 'on' ? 'off' : 'on'))
      .then(res => {
        dispatch(getCustomerDetail(data?.data?._id))

        toast.success(res.message)
      })
      .catch(err => {
        toast.error(err.message || 'Some Error Occured')
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pb: 5 }}>
            <CustomChip
              rounded
              skin='light'
              size='small'
              label={`DND : ${data?.data?.dndStatus === 'on' ? 'ON' : 'OFF'}`}
              color='warning'
              sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
              onClick={() => setDndOpen(true)}
            />
            <ConfirmDialog
              open={dndOpen}
              onClose={() => setDndOpen(false)}
              title='Do Not Disturb'
              content={`Are you sure want to turn DND ${
                data?.data?.dndStatus === 'on' ? 'OFF' : 'ON'
              } for this Customer?`}
              action={
                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  onClick={() => {
                    handleDndUpdate()
                    setDndOpen(false)
                  }}
                >
                  Apply
                </Button>
              }
            />
          </CardContent>
          <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar
              skin='light'
              variant='rounded'
              color='success'
              sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
            >
              {getInitials(`${data?.data?.firstName || ''} ${data?.data?.lastName || ''}`)}
            </CustomAvatar>
            <Typography variant='h5' sx={{ mb: 3 }}>
              {`${data?.data?.firstName || ''} ${data?.data?.lastName || ''}`}
            </Typography>
            <CustomChip
              rounded
              skin='light'
              size='small'
              label={`# ${data?.data?.stkNumber || ''}`}
              color='success'
              sx={{ textTransform: 'capitalize' }}
            />
          </CardContent>

          <CardContent>
            {prop?.imports?.promiseToPay && (
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={`PTP : ${prop?.imports?.promiseToPay}`}
                color={
                  statusColors[
                    prop?.imports?.promiseToPay === 'kept' ? 1 : prop?.imports?.promiseToPay === 'Broken' ? 2 : 0
                  ]
                }
                sx={{
                  textTransform: 'capitalize',
                  mr: 2,
                  mt: 2
                }}
              />
            )}
            {prop?.imports?.accountStatus && (
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={`Status : ${
                  prop?.imports?.accountStatus === 'Current' || prop?.imports?.accountStatus === 'current'
                    ? `${prop?.imports?.accountStatus}`
                    : `Past Due ( ${prop?.imports?.daysPastDue} )`
                }`}
                color={
                  statusColors[
                    prop?.imports?.accountStatus === 'Current' || prop?.imports?.accountStatus === 'current' ? 1 : 0
                  ]
                }
                sx={{
                  textTransform: 'capitalize',
                  mr: 2,
                  mt: 2
                }}
              />
            )}
            {prop?.customers?.isRepo && prop?.customers?.isRepo?._id && (
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={REPO_STATUS_OPTIONS?.map(statusOption => {
                  if (statusOption?.id === prop?.customers?.isRepo?.status) {
                    return `Repo: ${statusOption?.label}`
                  }
                })}
                color={statusColors[1]}
                sx={{
                  textTransform: 'capitalize',
                  mr: 2,
                  mt: 2
                }}
              />
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {prop?.PRIORITY_FLAG?.map((flag: any, index: number) => (
                <CustomChip
                  key={index}
                  rounded
                  skin='light'
                  size='small'
                  label={flag?.Flag}
                  color={statusColors[1]}
                  sx={{
                    textTransform: 'capitalize',
                    mr: 2,
                    mt: 2
                  }}
                />
              ))}
            </div>
          </CardContent>

          {data?.data?.appBar && data?.data?.appBar !== '' && (
            <BlinkingDiv style={{ width: '80%', textAlign: 'center', alignItems: 'center', margin: 'auto' }}>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={`${data?.data?.appBar || ''}`}
                // color='error'
                sx={{
                  textTransform: 'capitalize',
                  animation: 'blink 1s infinite',
                  mb: 3,
                  fontSize: 15,
                  color: 'white',
                  backgroundColor: 'red'
                }}
              />
            </BlinkingDiv>
          )}
          <Divider sx={{ my: '0 !important', mx: 6 }} />

          <CardContent sx={{ pb: 4 }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              ABOUT
            </Typography>
            <Box sx={{ pt: 4, pb: 4 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>SSN Number:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{`${data?.data?.ssnNum || ''}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Email:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.email || ''}</Typography>
              </Box>
            </Box>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              CONTACT
            </Typography>
            <Box sx={{ pt: 4, pb: 4 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Cell Phone Number:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.cellNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Home Phone Number:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.homeNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Work Phone Number:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.phoneNumber}</Typography>
              </Box>
            </Box>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              ADDRESS
            </Typography>
            <Box sx={{ pt: 4, pb: 4 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Address</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.address1}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>City</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.city}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>State</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.state}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Zipcode</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.data?.zipCode}</Typography>
              </Box>
            </Box>

            {data?.data?.borrowerName ||
              data?.data?.borrowerSsn ||
              data?.data?.borrowerDob ||
              data?.data?.borrowerEmail ||
              (data?.data?.borrowerHomePhone &&
                data?.data?.borrowerHomePhone !== '0' &&
                data?.data?.borrowerHomePhone !== '') ||
              (data?.data?.borrowerCellPhone &&
                data?.data?.borrowerCellPhone !== '0' &&
                data?.data?.borrowerCellPhone !== '' && (
                  <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                    Borrower Detail
                  </Typography>
                ))}
            <Box sx={{ pt: 4, pb: 4 }}>
              {data?.data?.borrowerName && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 Full Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerName}</Typography>
                </Box>
              )}
              {data?.data?.borrowerSsn && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 SSN Last 4:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerSsn}</Typography>
                </Box>
              )}
              {data?.data?.borrowerDob && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 Date Of Birth:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerDob}</Typography>
                </Box>
              )}
              {data?.data?.borrowerEmail && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerEmail}</Typography>
                </Box>
              )}
              {data?.data?.borrowerHomePhone &&
                data?.data?.borrowerHomePhone !== '0' &&
                data?.data?.borrowerHomePhone !== '' && (
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 Home Phone 1:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerHomePhone}</Typography>
                  </Box>
                )}
              {data?.data?.borrowerCellPhone &&
                data?.data?.borrowerCellPhone !== '0' &&
                data?.data?.borrowerCellPhone !== '' && (
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Borrower 2 Cell Phone:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.data?.borrowerCellPhone}</Typography>
                  </Box>
                )}
            </Box>
            {(data?.data?.authorizedPerson?.relation ||
              data?.data?.authorizedPerson?.contact ||
              data?.data?.authorizedPerson?.name ||
              data?.data?.authorizedPerson?.email) && (
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Authorized Person Detail
              </Typography>
            )}
            <Box sx={{ pt: 4, pb: 4 }}>
              {data?.data?.authorizedPerson?.contact && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Contact:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.authorizedPerson?.contact}</Typography>
                </Box>
              )}
              {data?.data?.authorizedPerson?.name && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Name: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.authorizedPerson?.name}</Typography>
                </Box>
              )}
              {data?.data?.authorizedPerson?.email && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.authorizedPerson?.email}</Typography>
                </Box>
              )}
              {data?.data?.authorizedPerson?.relation && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Relation:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.data?.authorizedPerson?.relation}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'left' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Edit
            </Button>
            <Button variant='text' onClick={() => setDialogOpen(true)}>
              {data?.data.authorizedPerson ? 'Edit Authorized Person' : 'Add Authorized Person'}
            </Button>
          </CardActions>

          <Drawer
            open={openEdit}
            anchor='right'
            variant='temporary'
            onClose={handleEditClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
          >
            <Header>
              <Typography variant='h6'>Edit Personal Detail</Typography>
              <IconButton
                size='small'
                onClick={handleEditClose}
                sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
              >
                <Icon icon='tabler:x' fontSize='1.125rem' />
              </IconButton>
            </Header>
            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitPersonal)}>
                <Box
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)'
                  }}
                >
                  <RHFTextField name='firstName' label='First Name' size='small' />
                  <br />
                  <RHFTextField name='lastName' label='Last Name' size='small' />
                  <br />
                  <RHFTextField name='email' label='Email' size='small' />
                  <br />
                  <RHFTextField name='homePhone' label='Home Phone' size='small' />
                  <br />
                  <RHFTextField name='cellPhone' label='Cell Phone' size='small' />
                  <br />
                  <RHFTextField name='workPhone' label='Work Phone' size='small' />
                  <br />
                  <RHFTextField name='address' label='Address' size='small' />
                  <br />
                  <RHFTextField name='city' label='City' size='small' />
                  <br />
                  <RHFTextField name='state' label='State' size='small' />
                  <br />
                  <RHFTextField name='zipCode' label='Zip Code' size='small' />
                  <br />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LoadingButton
                    sx={{ mr: 3 }}
                    type='submit'
                    loading={isSubmitting}
                    variant='contained'
                    disabled={isSubmitting}
                  >
                    Update
                  </LoadingButton>
                  <Button variant='outlined' onClick={handleEditClose}>
                    Cancel
                  </Button>
                </Box>
              </FormProvider>
            </Box>
          </Drawer>

          <AuthorizedPersonForm dialogOpen={dialogOpen} toggle={() => setDialogOpen(false)} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CustomerViewLeft
