/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateAuthorizedPersonal } from 'src/store/finance/customers'
import { useDispatch } from 'react-redux'


interface PageProp {
    dialogOpen: boolean
    toggle: () => void
}

const AuthorizedPersonForm = (prop: PageProp) => {
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: any) => state.customers)
    const data: any = store.selectedCustomer
    const { dialogOpen, toggle } = prop;


    const schema = yup.object().shape({
        contact: yup.string().required('Contact Number is required'),
        name: yup.string().required('Name is required'),
        email: yup.string().email('Enter valid Email').required('Email is required'),
        relation: yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            contact: data?.data?.authorizedPerson?.contact || '',
            name: data?.data?.authorizedPerson?.name || '',
            email: data?.data?.authorizedPerson?.email || '',
            relation: data?.data?.authorizedPerson?.relation || '',
            customerId: data?.data?._id
        }),
        [data]
    )

    useEffect(() => {
        if (dialogOpen) {
            reset(defaultValues);
        }
    }, [dialogOpen]);

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
            await dispatch(updateAuthorizedPersonal(data))
            toggle();
        } catch (error) {
            console.error(error)
            toggle();
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={dialogOpen} onClose={toggle}>
            <DialogTitle sx={{ pb: 2 }}>{data?.data.authorizedPerson ? "Edit Authorized Person" : "Add Authorized Person"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='contact'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Contact'
                                            size='small'
                                            onChange={onChange}
                                            error={Boolean(errors.contact)}
                                        />
                                    )}
                                />
                                {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{(errors.contact as FieldError).message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item md={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Name'
                                            size='small'
                                            onChange={onChange}
                                            error={Boolean(errors.name)}
                                        />
                                    )}
                                />
                                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{(errors.name as FieldError).message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item md={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            type='email'
                                            size='small'
                                            label='Email'
                                            onChange={onChange}
                                            error={Boolean(errors.email)}
                                        />
                                    )}
                                />
                                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{(errors.email as FieldError).message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item md={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='relation'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Relation'
                                            size='small'
                                            onChange={onChange}
                                            error={Boolean(errors.relation)}
                                        />
                                    )}
                                />
                                {errors.relation && <FormHelperText sx={{ color: 'error.main' }}>{(errors.relation as FieldError).message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                        Submit
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={toggle}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AuthorizedPersonForm