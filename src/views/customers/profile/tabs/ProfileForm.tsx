/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Alert from '@mui/material/Alert'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, FieldError } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { updateUser, addUser } from 'src/store/management/user'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'

// ** Constants
import { countries, timezone } from 'src/assets/data'
import { FormControlLabel, Switch, Typography } from '@mui/material'

interface ProfileFormProps {
  toggle: () => void
  isEdit?: boolean
  currentUser?: any
  showRole?: boolean
  showStatus?: boolean
}

const ProfileForm = (props: ProfileFormProps) => {
  // ** Props
  const { isEdit, currentUser, showRole, showStatus, toggle } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const userData = JSON.parse(window.localStorage.getItem('userData') || '{}')
  const userRole = JSON.parse(window.localStorage.getItem('userRoles') || '{}')

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter valid Email').required('Email is required'),
    password: !isEdit
      ? yup.string().required('Password is required').min(8, 'Minimum Length Should Be 8')
      : yup.string(),
    phone: yup
      .string()
      .min(9, 'Invalid Phone Number')
      .max(11, 'Invalid Phone Number')
      .required('Phone Number is required'),
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
      id: currentUser?._id || null,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      phone: currentUser?.phone || '',
      companyName: currentUser?.companyName || '',
      address: {
        fullAddress: currentUser?.address?.fullAddress || '',
        city: currentUser?.address?.city || '',
        state: currentUser?.address?.state || '',
        zipcode: currentUser?.address?.zipcode || '',
        country: currentUser?.address?.country || 'United States'
      },
      about: currentUser?.about || '',
      role: currentUser?.roles?.id || userRole.id + 1,
      status: currentUser?.status === 0 ? 0 : 1,
      createdBy: currentUser?.createdBy || userData._id,
      timeZone: currentUser?.timeZone || 'America/Los_Angeles'
    }),
    [currentUser]
  )

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
  }, [isEdit, currentUser])

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
      const response = isEdit ? await dispatch(updateUser(data)) : await dispatch(addUser(data))
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: ['wrap', 'nowrap'],
        pt: theme => `${theme.spacing(2)} !important`,
        pb: theme => `${theme.spacing(8)} !important`,
        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
      }}
    >
      {store.error && (
        <Alert severity='error' sx={{ width: '100%', mb: 5 }}>
          {store.error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          {!isEdit && (
            <Grid item md={6} xs={12}>
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
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.password as FieldError).message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
          <Grid item md={6} xs={12}>
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
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.companyName as FieldError).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
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
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel
                id='validation-country-select'
                error={Boolean(errors.role)}
                htmlFor='validation-country-select'
              >
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
          </Grid>
          {showRole && (
            <Grid item md={6} xs={12}>
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
                      <MenuItem value={1}>MASTER ADMIN</MenuItem>
                      <MenuItem value={2}>ADMIN</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          <Grid item md={6} xs={12}>
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
                    {timezone.map((zone: any) => {
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          {showStatus && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
              <Button variant='outlined' onClick={toggle}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default ProfileForm
