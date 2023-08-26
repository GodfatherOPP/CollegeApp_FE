import NextLink from 'next/link'
// @mui
import { Stack, Button, Typography, StackProps, IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
// components

// ----------------------------------------------------------------------

interface Props extends StackProps {
  title: string
  subTitle?: string
  link?: string
  onOpen?: VoidFunction
  collapse?: boolean
  onCollapse?: VoidFunction
}

export default function FilePanel({ title, subTitle, link, onOpen, collapse, onCollapse, sx, ...other }: Props) {
  return (
    <Stack direction='row' alignItems='center' sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction='row' alignItems='center' spacing={1} flexGrow={1}>
          <Typography variant='h6'> {title} </Typography>

          <IconButton
            size='small'
            color='success'
            onClick={onOpen}
            sx={{
              p: 0,
              width: 24,
              height: 24,
              color: 'common.white',
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.main'
              }
            }}
          >
            <IconifyIcon icon='eva:plus-fill' />
          </IconButton>
        </Stack>

        <Typography variant='body2' sx={{ color: 'text.disabled', mt: 0.5 }}>
          {subTitle}
        </Typography>
      </Stack>

      {link && (
        <Button
          component={NextLink}
          href={link}
          size='small'
          color='inherit'
          endIcon={<IconifyIcon icon='eva:chevron-right-fill' />}
        >
          View All
        </Button>
      )}

      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <IconifyIcon icon={collapse ? 'eva:chevron-down-fill' : 'eva:chevron-up-fill'} />
        </IconButton>
      )}
    </Stack>
  )
}
