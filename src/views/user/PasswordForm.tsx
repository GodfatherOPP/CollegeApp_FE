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

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, FieldError } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { getUserDetails, updateUserPassword } from 'src/store/management/user'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { AlertTitle, Card, CardContent, CardHeader } from '@mui/material'
import { LoadingButton } from '@mui/lab'

interface PasswordFormProps {
    currentUser?: any
    toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const PasswordForm = (props: PasswordFormProps) => {
    // ** Props
    const { currentUser, toggle } = props
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.user)

    const schema = yup.object().shape({
        password: yup.string().required('Please enter your password').min(8, 'Minimum Length Should Be 8'),
        confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
    })

    const defaultValues = useMemo(
        () => ({
            id: currentUser?._id || null,
            password: '',
            confirm: ''
        }),
        [currentUser]
    )

    useEffect(() => {
        if (currentUser) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

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
        const response = await dispatch(updateUserPassword(data))
        if (response?.statusCode === 200) {
            await dispatch(getUserDetails(response.data._id));
            toast.success(response?.message);
            reset()
            toggle()
        } else {
            toast.error(response?.message);
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Change Password' />
                    <CardContent>
                        <Alert icon={false} severity='info' sx={{ mb: 4 }}>
                            <AlertTitle
                                sx={{ fontWeight: 500, fontSize: '1.25rem', mb: theme => `${theme.spacing(2.5)} !important` }}
                            >
                                Ensure that these requirements are met
                            </AlertTitle>
                            -&nbsp;Minimum 8 characters long
                        </Alert>
                        {store.error && (
                            <Header sx={{ m: 0, pb: 0 }}>
                                <Alert severity='error' sx={{ width: '100%' }}>{store.error}</Alert>
                            </Header>
                        )}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='password'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    size="small"
                                                    type="password"
                                                    label='Password'
                                                    onChange={onChange}
                                                    error={Boolean(errors.password)}
                                                />
                                            )}
                                        />
                                        {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{(errors.password as FieldError).message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='confirm'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type="password"
                                                    size="small"
                                                    value={value}
                                                    label='Confirm Password'
                                                    onChange={onChange}
                                                    error={Boolean(errors.confirm)}
                                                />
                                            )}
                                        />
                                        {errors.confirm && <FormHelperText sx={{ color: 'error.main' }}>{(errors.confirm as FieldError).message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LoadingButton
                                            sx={{ mr: 3 }}
                                            type='submit'
                                            loading={store.isLoading}
                                            variant="contained"
                                            disabled={store.isLoading}
                                        >
                                            Submit
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default PasswordForm
