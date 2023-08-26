// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Backdrop from '@mui/material/Backdrop'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useDropzone } from 'react-dropzone'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

interface FileProp {
  name: string
  type: string
  size: number
  key?: string
  src?: string
}

interface ComponentProp {
  handleImageUpload: (file: File[]) => void
  description: string
  uploadedFiles: any
}

const FileUploaderImage = (props: ComponentProp) => {
  const [files, setFiles] = useState<File[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const { handleImageUpload, description, uploadedFiles } = props;
  const [selectedImage, setSelectedImage] = useState<File | any>(null)
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    setFiles(uploadedFiles);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles.map((file: File) => Object.assign(file));
      setFiles(file)
      handleImageUpload(file)
    },
    onDropRejected: () => {
      setErrorMsg("Image Files less than 10 MB is supported.")
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={file.src ? file.src : URL.createObjectURL(file as any)} onClick={() => previewFile(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const previewFile = (file: FileProp) => {
    setSelectedImage(file);
    setShowImage(true);
  }

  const handleRemoveFile = (file: FileProp) => {
    setFiles([])
    handleImageUpload([])
  }

  const fileList = files?.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  return (
    <DropzoneWrapper >
      <Fragment>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ mb: 2.5 }}>
              {description}
              
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>Allowed *.jpeg, *.jpg, *.png</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>Max file size of 10 MB</Typography>
          </Box>
        </div>
        {files?.length > 0 && (
          <Fragment>
            <List>{fileList}</List>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
              open={showImage}
              onClick={() => setShowImage(false)}
            >
              <IconButton
                size='small'
                onClick={() => setShowImage(false)}
                sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected', top: 10, right: 20, position: 'absolute' }}
              >
                <Icon icon='tabler:x' fontSize='1.125rem' />
              </IconButton>
              {selectedImage && (
                <img width={'80%'}
                  height={'80%'}
                  alt={selectedImage?.name}
                  src={selectedImage?.src ? selectedImage?.src : URL.createObjectURL(selectedImage as any)}
                />
              )}
            </Backdrop>
          </Fragment>
        )}
      </Fragment>
      <Typography variant='body2' color='error.main'>{errorMsg}</Typography>
    </DropzoneWrapper>
  )
}

export default FileUploaderImage
