import { useState, useEffect } from 'react'
// form
import { useWatch } from 'react-hook-form'
import { PDFViewer } from '@react-pdf/renderer'
// @mui
import { Box, Stack, Tooltip, IconButton, Button, Dialog, DialogActions } from '@mui/material'
// components
//
import { FieldServicesPDF, EliteSkippersPDF } from '../doc'
import IconifyIcon from 'src/@core/components/icon'
// ----------------------------------------------------------------------

export default function RepoToolbar({ impounds }: any) {
  const values = useWatch()

  const [openPreview, setOpenPreview] = useState(false)
  const [filePDF, setFilePDF] = useState<React.ReactElement>()

  useEffect(() => {
    if (impounds && impounds?.key === 'field-services') {
      setFilePDF(<FieldServicesPDF data={values} impounds={impounds} />)
    } else {
      setFilePDF(<EliteSkippersPDF data={values} impounds={impounds} />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const handleOpenPreview = () => {
    setOpenPreview(true)
  }

  const handleClosePreview = () => {
    setOpenPreview(false)
  }

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent='space-between'
      alignItems={{ sm: 'center' }}
      sx={{ mb: 4 }}
    >
      <Stack direction='row' spacing={3}>
        <Button
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='eva:eye-fill' />}
          onClick={() => {
            handleOpenPreview()
          }}
        >
          Preview
        </Button>
      </Stack>

      <Dialog fullScreen open={openPreview}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important'
              // boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title='Close'>
              <IconButton color='inherit' onClick={handleClosePreview}>
                <IconifyIcon icon='eva:close-fill' />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              {filePDF}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Stack>
  )
}
