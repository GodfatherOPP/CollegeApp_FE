import {
  StaticDatePicker,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@mui/lab'
import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import React, { useEffect } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import CustomChip from 'src/@core/components/mui/chip'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getCustomersCallLogs } from 'src/store/reports/calls'
import { useSelect } from '@mui/base'
import { useSelector } from 'react-redux'
import moment from 'moment'
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

const CallLogs = ({ phonenumber }: { phonenumber: any }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { customerscallLogs } = useSelector((state: any) => state.calls)

  useEffect(() => {
    dispatch(getCustomersCallLogs({ phonenumber: phonenumber }))
  }, [phonenumber])

  return (
    <Card sx={{ padding: '10px', maxHeight: '90vh', overflowY: 'scroll' }}>
      <Typography variant='h5'>Call Logs</Typography>
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          {customerscallLogs &&
            customerscallLogs.map((call: any) => (
              <TimelineItem key={call?.id}>
                <TimelineSeparator>
                  <TimelineDot color='warning' sx={{ mt: 1.5 }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pt: 0, mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
                  <Stack>
                    <Box
                      sx={{
                        mb: 0.5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>
                        <CustomChip
                          rounded
                          skin='light'
                          size='small'
                          label={
                            [undefined, null, ''].includes(call?.custom_disposition)
                              ? 'Other'
                              : call?.custom_disposition
                          }
                          color='success'
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {moment(call?.start_stamp).format('DD/MM/YYYY HH:MM:SS A')}
                      </Typography>
                    </Box>
                    <Stack sx={{ margin: '20px 0' }} direction='row' spacing={2}>
                      <Box>
                        <Typography sx={{ fontWeight: '900' }}>Call Direction:</Typography>

                        <Typography sx={{ fontWeight: '900' }}>Call Answer:</Typography>
                      </Box>
                      <Box>
                        <Typography>
                          {' '}
                          {[undefined, null, ''].includes(call?.direction) ? 'OUTBOUND' : call?.direction}
                        </Typography>

                        <Typography>{call?.disposition === 'NORMAL_CLEARING' ? 'Yes' : 'No'}</Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar
                        skin='light'
                        color={'primary'}
                        sx={{ fontSize: '1rem', width: '2.5rem', height: '2.5rem', mr: 2 }}
                      >
                        {getInitials(`${call?.name}`)}
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontWeight: 500 }}>{call?.name}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}></Typography>
                      </Box>
                    </Box>
                  </Stack>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default CallLogs
