// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ShortenNumber, fCurrency } from 'src/utils/formatNumber'



type Props = {
  data: any;
  time: number;
}
const CrmRevenueGrowthDaily = ({ data, time }: Props) => {
  
  const [seriesWeek, setSeriesWeek] = useState([{ data: [0, 0, 0, 0, 0, 0, 0] }])
  const theme = useTheme()
  const [growth, setGrowth] = useState({
    value: 0,
    state: true
  })
  
  function calculateProfitOrLoss(current: number, past: number) {
    const difference = current - past
    const percentage = past !== 0 ? (difference / past) * 100 : 100
    if (difference > 0) {
      setGrowth({ value: parseFloat(parseFloat(percentage?.toString()).toFixed(2)) || 0, state: true })
    } else if (difference < 0) {
      setGrowth({ value: parseFloat(parseFloat(percentage?.toString()).toFixed(2)) || 0, state: false })
    } else {
      setGrowth({ value: 0, state: true })
    }
  }

  useEffect(() => {
    calculateProfitOrLoss(
      parseFloat(data?.details?.TodayTransactionAmount) || 0,
      parseFloat(data?.details?.yesterdayTransactionAmount) || 0
    )
    setSeriesWeek(
      [{
        data: [
          data?.details?.firstIntervalAmount,
          data?.details?.secondIntervalAmount,
          data?.details?.thirdIntervalAmount,
          data?.details?.forthIntervalAmount,
          data?.details?.fifthIntervalAmount,
          data?.details?.sixthIntervalAmount,
          data?.details?.lastIntervalAmount
        ]
      }]
    );
  }, [time])

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const optionsWeek: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '32%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { 
      show: false 
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -4,
        left: -7,
        right: -5,
        bottom: -12
      }
    },
    xaxis: {
      categories: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '14px',
          colors: '#FFF',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card sx={{ height: '100%', backgroundColor: '#2f3349' }}>
      <CardContent>
        <Box
          sx={{
            gap: 2,
            display: isMdScreen ? 'flex' : 'block',
            alignItems: 'stretch',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                Money Collected
              </Typography>
              <Typography variant='body2'>Daily Report (Intervals)</Typography>
            </div>
            <div>
              <Typography variant='h5' sx={{ mb: 2, mt: 1 }}>
             ${" "}
                {fCurrency(data?.details?.TodayTransactionAmount || 0)}
              </Typography>
              <CustomChip
                rounded
                size='small'
                skin='light'
                color={growth?.state ? 'success' : 'error'}
                label={`${growth?.value || 0} %`}
              />
              <Typography sx={{ mb: 2 }}>
                Vs Last Day
              </Typography>
            </div>
          </Box>
          <ReactApexcharts
            type='bar'
            width={isMdScreen ? 270 : '100%'}
            height={isMdScreen ? 178 : '100%'}
            series={seriesWeek}
            options={optionsWeek}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmRevenueGrowthDaily
