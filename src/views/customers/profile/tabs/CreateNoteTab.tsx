import * as Yup from 'yup'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiCardHeader, { CardHeaderProps } from '@mui/material/CardHeader'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import { Grid, Stack } from '@mui/material'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { RHFTextField } from 'src/hooks/hook-form'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { createNote, getNotes } from 'src/store/general/notes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { toast } from 'react-hot-toast'

// Styled  component
const CardHeader = styled(MuiCardHeader)<CardHeaderProps>(({ theme }) => ({
  '& .MuiTypography-root': {
    lineHeight: 1.6,
    fontWeight: 500,
    fontSize: '1.125rem',
    letterSpacing: '0.15px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem'
    }
  }
}))

type Props = {
  importedId: string
}

const NoteItem = ({ importedId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const NotesSchema = Yup.object().shape({
    notes: Yup.string().required()
  })
  const defaultValues = { notes: '' }
  const methods = useForm({
    resolver: yupResolver(NotesSchema),
    defaultValues
  })
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods
  useEffect(() => {
    reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      dispatch(
        createNote({
          note: data.notes,
          ImportedDataId: importedId,
          category: 1
        })
      )
        .then(response => {
          console.debug('response', response)
          if (response?.statusCode === 200) {
            reset()
            dispatch(getNotes({ id: importedId }))
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

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            <Icon fontSize='1.25rem' icon='tabler:list-details' />
            <Typography>Create New Note</Typography>
          </Box>
        }
      />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3} alignItems='flex-end' sx={{ mt: 2 }}>
                <RHFTextField name='notes' size="small" multiline rows={5} label='Notes' />
              </Stack>
            </Grid>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting} sx={{ float: 'right', mt: 5, ml: 'auto' }}>
            Save Note
            </LoadingButton>
          </Grid>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default NoteItem
