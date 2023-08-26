/* eslint-disable react-hooks/exhaustive-deps */
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

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import { IconButton, Tooltip } from '@mui/material'
import { fDateTime } from 'src/utils/formatTime'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
  getInternalNotesByCustomerId,
  markNoteAsRead,
  // deletInternalNote
} from 'src/store/general/internalNote'
import { AppDispatch } from 'src/store'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import ScrollBar from 'react-perfect-scrollbar'

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
  importedId: string
}

const NoteItem = ({ importedId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const notes = useSelector((state: any) => state.internalnote?.notes)

  useEffect(() => {
    dispatch(getInternalNotesByCustomerId(importedId))
      .catch(error => {
        toast.error(error.message || 'Error Fetching Notes')
      })
  }, [importedId])

  const markAllASRead = (id: string) => {
    dispatch(markNoteAsRead(importedId, { id: id }))
      .then(res => {
        toast.success(res.message || 'All Notes Marked As Read')
        dispatch(getInternalNotesByCustomerId(importedId))
      })
      .catch(error => {
        toast.error(error.message || 'Unable To Update Note')
      })
  }
  const markAsRead = (noteId: string) => {
    dispatch(markNoteAsRead(importedId, { noteId: noteId }))
      .then(res => {
        toast.success(res.message || 'Note Marked As Read')
        dispatch(getInternalNotesByCustomerId(importedId))
      })
      .catch(error => {
        toast.error(error.message || 'Unable To Update Note')
      })
  }

  // const deleteNote = (id: string) => {
  //   dispatch(deletInternalNote(importedId, id))
  //     .then(res => {
  //       toast.success(res.message || 'Get Notes Successfull ')
  //       dispatch(getInternalNotesByCustomerId(importedId))
  //     })
  //     .catch(error => {
  //       toast.error(error.message || 'Get Notes Successfull ')
  //     })
  // }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            <Icon fontSize='1.25rem' icon='tabler:list-details' />
            <Typography>Personal Notes</Typography>
            <Tooltip title='Mark All As read' placement='bottom'>
              <IconButton
                onClick={() => markAllASRead(notes.length > 0 && notes[0]._id)}
                sx={{
                  ml: 5
                }}
              >
                <Icon icon='solar:unread-bold' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <ScrollBar style={{ maxHeight: '80vh' }}>
          <Timeline sx={{ my: 0, py: 0 }}>
            {notes?.length > 0 &&
              notes[0].notes?.length > 0 &&
              notes[0].notes?.map((note: any, index: number) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={note.msgstatus ? 'success' : 'warning'} sx={{ mt: 1.5 }} />
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
                      <Box>
                        <Typography sx={{ mr: 2, fontWeight: 500 }}>{note?.title} </Typography>{' '}
                        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                          {`   (${fDateTime(note?.createdAt, 'MMMM dd yyyy p')})`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          mb: 0.5,
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Tooltip title='Mark As read' placement='bottom'>
                          <IconButton onClick={() => markAsRead(note._id)}>
                            <Icon icon='solar:unread-bold' fontSize={20} />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title='Delete Note' placement='bottom'>
                          <IconButton onClick={() => deleteNote(note._id)}>
                            <Icon icon='material-symbols:delete' fontSize={20} />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        mb: 0.5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mb: 2.5, color: 'text.secondary' }}> {note.note}</Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            {notes?.length === 0 && (
              <Typography sx={{ mr: 2, fontWeight: 500 }}>No Notes Added For This Customer </Typography>
            )}
          </Timeline>
        </ScrollBar>
      </CardContent>
    </Card>
  )
}

export default NoteItem
