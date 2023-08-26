/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect, useMemo } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Alert, FormControlLabel, Switch } from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, FieldError, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Actions Imports
import { addUser } from 'src/store/management/user'

// ** Data Imports
import { countries, timezone } from 'src/assets/data'
import { LoadingButton } from '@mui/lab'

interface UserFormType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const UserForm = (props: UserFormType) => {
  const { open, toggle } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const userData = JSON.parse(window.localStorage.getItem('userData') || '{}')
  const userRole = JSON.parse(window.localStorage.getItem('userRoles') || '{}')

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter valid Email').required('Email is required'),
    password: yup.string().required('Password is required').min(8, 'Minimum Length Should Be 8'),
    phone: yup
      .string()
      .min(9, 'Invalid Phone Number')
      .max(11, 'Invalid Phone Number')
      .required('Phone Number is required'),
      supervisor: yup.boolean().required('Field is required'),
    companyName: yup.string().required('Company Name is required'),
    address: yup.object().shape({
      fullAddress: yup.string().required('Address Name is required'),
      city: yup.string().required('City Name is required'),
      state: yup.string().required('State Name is required'),
      zipcode: yup.string().required('Zipcode Name is required'),
      country: yup.string().required('Country Name is required')
    }),
    timeZone: yup.string(),
    about: yup.string()
  })

  const defaultValues = useMemo(
    () => ({
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      companyName: '',
      address: {
        fullAddress: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'United States'
      },
      about: '',
      role: userRole.id + 1,
      user_type: 1,
      status: 1,
      createdBy: userData._id,
      timeZone: 'America/Los_Angeles',
      supervisor:0
    }),
    []
  )

  useEffect(() => {
    reset(defaultValues)
  }, [open])

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: any) => {
    try {
      const response = await dispatch(addUser(data))
      if (response?.statusCode === 200) {
        toast.success(response?.message)
        reset()
        toggle()
      } else {
        toast.error(response?.message)
      }
    } catch (error) {
      console.error(error)
      reset()
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add {userRole.id === 1 ? 'Dealer' : 'Agent'}</Typography>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {store.error && (
            <Header sx={{ m: 0, pb: 0 }}>
              <Alert severity='error' sx={{ width: '100%' }}>
                {store.error}
              </Alert>
            </Header>
          )}

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} size='small' label='Name' onChange={onChange} error={Boolean(errors.name)} />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.name as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  size='small'
                  label='Mobile No'
                  onChange={onChange}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.phone as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  size='small'
                  label='Email'
                  onChange={onChange}
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.email as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='password'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='password'
                  value={value}
                  size='small'
                  label='Password'
                  onChange={onChange}
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.password as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='companyName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size='small'
                  label='Company Name'
                  onChange={onChange}
                  error={Boolean(errors.companyName)}
                />
              )}
            />
            {errors.companyName && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.companyName as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address.fullAddress'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size='small'
                  label='Address'
                  onChange={onChange}
                  error={Boolean(errors.address?.fullAddress)}
                />
              )}
            />
            {errors.address?.fullAddress && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.address?.fullAddress as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address.city'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size='small'
                  label='City'
                  onChange={onChange}
                  error={Boolean(errors.address?.city)}
                />
              )}
            />
            {errors.address?.city && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.address?.city as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address.state'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size='small'
                  label='State'
                  onChange={onChange}
                  error={Boolean(errors.address?.state)}
                />
              )}
            />
            {errors.address?.state && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.address?.state as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address.zipcode'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size='small'
                  label='Zip code'
                  onChange={onChange}
                  error={Boolean(errors.address?.zipcode)}
                />
              )}
            />
            {errors.address?.zipcode && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.address?.zipcode as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='validation-country-select' error={Boolean(errors.role)} htmlFor='validation-country-select'>
              Country
            </InputLabel>
            <Controller
              name='address.country'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  size='small'
                  label='Country'
                  onChange={onChange}
                  error={Boolean(errors.address?.country)}
                  labelId='validation-country-select'
                  aria-describedby='validation-country-select'
                >
                  {countries.map((country: any) => {
                    return (
                      <MenuItem value={country.label} key={country.label}>
                        {country.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              )}
            />
            {errors.address?.country && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.address?.country as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='validation-userRole-select' htmlFor='validation-userRole-select'>
              User Role
            </InputLabel>
            <Controller
              name='role'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  size='small'
                  label='User Role'
                  onChange={onChange}
                  labelId='validation-userRole-select'
                  aria-describedby='validation-userRole-select'
                >
                  {userRole.id === 1 && <MenuItem value={1}> MASTER ADMIN</MenuItem>}
                  {userRole.id === 1 && <MenuItem value={2}>ADMIN</MenuItem>}
                  {userRole.id !== 1 && <MenuItem value={3}>AGENT</MenuItem>}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='validation-supervisor-select' htmlFor='validation-supervisor-select'>
            Supervisor
            </InputLabel>
            <Controller
              name='supervisor'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  size='small'
                  label='Supervisor'
                  onChange={onChange}
                  labelId='validation-supervisor-select'
                  aria-describedby='validation-supervisor-select'
                >
                  <MenuItem value={1}> Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          {userRole.id === 1 && (
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id='validation-user_type-select' htmlFor='validation-user_type-select'>
                User Type
              </InputLabel>
              <Controller
                name='user_type'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    size='small'
                    label='User Type'
                    onChange={onChange}
                    labelId='validation-user_type-select'
                    aria-describedby='validation-user_type-select'
                  >
                    <MenuItem value={1}>IDMS</MenuItem>
                    <MenuItem value={2}>AMS</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          )}

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel
              id='validation-timeZone-select'
              error={Boolean(errors.role)}
              htmlFor='validation-timeZone-select'
            >
              Time Zone
            </InputLabel>
            <Controller
              name='timeZone'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  size='small'
                  label='Time Zone'
                  onChange={onChange}
                  error={Boolean(errors.timeZone)}
                  labelId='validation-timeZone-select'
                  aria-describedby='validation-timeZone-select'
                >
                  {timezone?.map((zone: any) => {
                    return (
                      <MenuItem value={zone} key={zone}>
                        {zone}
                      </MenuItem>
                    )
                  })}
                </Select>
              )}
            />
            {errors.timeZone && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.timeZone as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='about'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  multiline
                  rows={3}
                  value={value}
                  size='small'
                  label='About'
                  onChange={onChange}
                  error={Boolean(errors.about)}
                />
              )}
            />
            {errors.about && (
              <FormHelperText sx={{ color: 'error.main' }}>{(errors.about as FieldError).message}</FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            labelPlacement='end'
            control={
              <Controller
                name='status'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Switch checked={value === 1} onChange={event => onChange(event.target.checked ? 1 : 0)} />
                )}
              />
            }
            label={
              <div>
                <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                  Status
                </Typography>
              </div>
            }
            sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'start' }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton
              sx={{ mr: 3 }}
              type='submit'
              loading={store.isLoading}
              variant='contained'
              disabled={store.isLoading}
            >
              Submit
            </LoadingButton>
            <Button variant='outlined' onClick={toggle}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default UserForm
