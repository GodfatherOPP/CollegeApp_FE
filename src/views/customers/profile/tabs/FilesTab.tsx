import * as Yup from 'yup'
import { useMemo, useEffect, useState, SyntheticEvent } from 'react'
import { useSelector } from 'react-redux'
// form
import { useForm } from 'react-hook-form'
// Redux
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Grid, Typography, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getFiles, uploadFile } from 'src/store/general/files'
import FormProvider from 'src/hooks/hook-form/FormProvider'
import { CustomerFileRecentCard } from 'src/views/files'
import FileNewFolderDialog from 'src/views/files/FileNewFolderDialog'
import { toast } from 'react-hot-toast'
import { Accordion, AccordionSummary, AccordionDetails } from './CustomComponent'
import IconifyIcon from 'src/@core/components/icon'

type Props = {
  importedId: string
  user: any
}

export default function TabFiles({ importedId, user }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [openUploadFile, setOpenUploadFile] = useState(false)
  const [expanded, setExpanded] = useState<any>({ panel1: true })
  const files = useSelector((state: any) => state.files.files)
  const [category, setCategory] = useState<string>('Insurance declaration')
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getFiles({ customer: importedId }))
    }
    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const FileSchema = Yup.object().shape({
    file: Yup.array()
  })

  const defaultValues: any = useMemo(
    () => ({
      file: null
    }),
    []
  )

  const methods = useForm({
    resolver: yupResolver(FileSchema),
    defaultValues
  })

  const { setValue, getValues } = methods

  const onSubmit = async () => {
    try {
      const fileData = getValues('file')
      dispatch(uploadFile({ files: fileData, createdBy: user?._id, customer: importedId, type: category }))
        .then((response: any) => {
          if (response?.statusCode === 200) {
            toast.success(response?.message)
            dispatch(getFiles({ customer: importedId }))
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

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true)
  }

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false)
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Accordion expanded={expanded['panel1']} onChange={handleChange('panel1')}>
          <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel1')}>
            <IconifyIcon fontSize='1.25rem' icon='tabler:upload' />
            <Typography ml={2}>Recent Files</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormProvider methods={methods}>
              {(!files || files?.length === 0) && (
                <Typography variant='h4' p={10} textAlign={'center'} color='secondary'>
                  No uploaded files
                </Typography>
              )}
              {files?.map((file: any, index: any) => (
                <CustomerFileRecentCard key={index} file={file} />
              ))}
              <Grid item xs={12} mt={4}>
                <Button variant='contained' onClick={handleOpenUploadFile}>
                  Add Files
                </Button>
              </Grid>
              <FileNewFolderDialog
                open={openUploadFile}
                onClose={handleCloseUploadFile}
                setValue={setValue}
                type
                onSubmit={() => {
                  onSubmit()
                  handleCloseUploadFile()
                }}
                category={category}
                setCategory={setCategory}
              />
            </FormProvider>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  )
}
