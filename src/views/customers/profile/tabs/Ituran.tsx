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
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import React, { useEffect, useState } from 'react'
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
import { getDeviceDetail, getcommandDetail, getcommandList } from 'src/store/ituran'

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

const Ituran = ({ selectedCustomer }: { selectedCustomer: any }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { commandList, commandDetails, deviceDetails } = useSelector((state: any) => state.ituran)
  const [selectedCommand, setSelectedCommand] = useState('')
  const [deviceDetail, setDeviceDetails] = useState<any>({})

  useEffect(() => {
    selectedCustomer && dispatch(getcommandList({ ip: selectedCustomer?.ip || '59.186.1.89' }))
    selectedCustomer && dispatch(getDeviceDetail({ ip: selectedCustomer?.ip || '59.186.1.89' }))
  }, [selectedCustomer])

  useEffect(() => {
    selectedCommand !== '' &&
      dispatch(getcommandDetail({ ip: selectedCustomer?.ip || '59.186.1.89', commands: selectedCommand }))
  }, [selectedCommand])

  useEffect(() => {
    setDeviceDetails(deviceDetails[0]?.Report[0]?.Record)
  }, [deviceDetails])
  console.log(deviceDetail)

  return (
    <Card sx={{ padding: '10px', maxHeight: '90vh', overflowY: 'scroll' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            <Typography>Perform GPS Actions</Typography>
          </Box>
        }
        action={
          <FormControl fullWidth>
            <InputLabel id='select-actions' size='small'>
              Command
            </InputLabel>
            <Select
              sx={{ minWidth: '200px' }}
              size='small'
              fullWidth
              labelId='select-actions'
              label='Select'
              defaultValue='1'
              onChange={e => setSelectedCommand(e.target.value)}
            >
              {commandList?.map((command: any, index: number) => {
                return (
                  <MenuItem value={command?.CommandName[0]} key={index}>
                    {command?.DisplayName[0]}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        {selectedCommand === 'LOC' && (
          <>
            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20, margin: '10px 0 10px 0 ' }}>
              Command Details:{' '}
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Address : </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                  (commandDetails && commandDetails[0]?.Location?.[0]?.Address[0]) || ''
                }`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Date : </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                  (commandDetails && commandDetails[0]?.Location?.[0]?.Date[0]) || ''
                }`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Speed : </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                  (commandDetails && commandDetails[0]?.Location?.[0]?.Speed[0]) || ''
                } ${(commandDetails && commandDetails[0]?.Location?.[0]?.SpeedUnits[0]) || ''}`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Heading : </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                  (commandDetails && commandDetails[0]?.Location?.[0]?.Heading[0]) || ''
                }`}</Typography>
              </Grid>
            </Grid>
          </>
        )}

        <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20, margin: '50px 0 10px 0 ' }}>
          Device Details:{' '}
        </Typography>
        {deviceDetail && (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Address : </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                deviceDetail[0]?.Location?.[0]?.Address[0] || ''
              }`}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Date : </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                deviceDetail[0]?.Location?.[0]?.Date[0] || ''
              }`}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Speed : </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                deviceDetail[0]?.Location?.[0]?.Speed[0] || ''
              } ${deviceDetail[0]?.Location?.[0]?.SpeedUnits[0] || ''}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 20 }}>Heading : </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{`${
                deviceDetail[0]?.Location?.[0]?.Heading[0] || ''
              }`}</Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default Ituran
