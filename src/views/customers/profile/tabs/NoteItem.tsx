// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import MuiCardHeader, { CardHeaderProps } from '@mui/material/CardHeader'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { fDateTime } from 'src/utils/formatTime'
import { getInitials } from 'src/@core/utils/get-initials'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

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
  title: string
  showDropDown?: boolean
  onChangeOptions?: any
  notes: any
}

const NoteItem = ({ title, showDropDown, notes, onChangeOptions }: Props) => {
  return (
    <Card style={{ boxShadow: 'none' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            <Icon fontSize='1.25rem' icon='tabler:list-details' />
            <Typography>{title}</Typography>
          </Box>
        }
        action={
          showDropDown && (
            <FormControl fullWidth>
              <InputLabel id='select-actions' size='small'>Select</InputLabel>
              <Select
                size='small'
                fullWidth
                labelId='select-actions'
                label='Select'
                defaultValue='1'
                onChange={e => onChangeOptions(e.target.value)}
              >
                <MenuItem value='1'>General</MenuItem>
                <MenuItem value='2'>Insurance</MenuItem>
                <MenuItem value='3'>Amendment</MenuItem>
                <MenuItem value='4'>Repo</MenuItem>
                <MenuItem value='6'>Flags</MenuItem>
              </Select>
            </FormControl>
          )
        }
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          {notes?.length > 0 &&
            notes?.map((note: any, index: number) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color='warning' sx={{ mt: 1.5 }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pt: 0, mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
                  <Box
                    sx={{
                      mb: 0.5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>{note?.title}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {`   (${fDateTime(note?.createdAt, 'MMMM dd yyyy p')})`}
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2.5, color: 'text.secondary' }}> {note.note}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' color={'primary'} sx={{ fontSize: '1rem', width: '2.5rem', height: '2.5rem', mr: 2 }}>
                      {getInitials(note?.createdBy?.name)}
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontWeight: 500 }}>{note?.createdBy?.name}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{note?.createdBy?.roles?.name}</Typography>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}
          {notes?.length === 0 && (
            <Typography sx={{ mr: 2, fontWeight: 500 }}>No Notes Added For This Customer </Typography>
          )}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default NoteItem
