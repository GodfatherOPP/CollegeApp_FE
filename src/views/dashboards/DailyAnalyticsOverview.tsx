import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Card, Divider, Grid, useMediaQuery } from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getDailyAnalyticsOverview } from 'src/store/dashboard'
import { useSelector } from 'react-redux'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { fCurrency } from 'src/utils/formatNumber'

type ApexChartSeries = NonNullable<ApexOptions['series']>

type Props = {
  title?: string
  subTitle?: string
  agents?: any
}
const DailyAnalyticsOverview = ({ title, subTitle }: Props) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [transactionData, settransactionData] = useState([
    { label: 'Card', value: '' },
    { label: 'Cash', value: '' },
    // { label: "ACH", value: "" },
    { label: 'Gift Card', value: '' }
  ])

  const [analyticsData, setAnalyticsData] = useState([
    { label: 'Autopay', value: 0 },
    { label: 'Failed Autopay', value: 0 },
    { label: 'Repossessed', value: 0 },
    { label: 'Charge Off', value: 0 },
    { label: 'Out For Repo', value: 0 }
  ])
  const [callingData, setCallingData] = useState([
    { label: 'Total Calls', value: 0 },
    { label: 'Inbounds', value: 0 },
    { label: 'Outbounds', value: 0 },
    { label: 'Not Answered', value: 0 },
    { label: 'Rejected ', value: 0 }
  ])
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const dailyAnalyticsOverview = useSelector((state: any) => state.dashboard.dailyAnalyticsOverview)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const islgScreen = useMediaQuery(theme.breakpoints.up('xl'))

  useEffect(() => {
    dispatch(getDailyAnalyticsOverview())
  }, [])
  useEffect(() => {
    // Dispatch the initial action when the component mounts
    dispatch(getDailyAnalyticsOverview())
    // Set up an interval to dispatch the action every 10 seconds
    const intervalId = setInterval(() => {
      dispatch(getDailyAnalyticsOverview())
    }, 10000) // 5000 milliseconds = 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch])

  useEffect(() => {
    setTotalAmount(dailyAnalyticsOverview?.transaction?.TotalAuxvaultAmount)
    let tempsales = 0
    dailyAnalyticsOverview?.response?.map((data: any) => (tempsales = tempsales + data?.totalsales))
    setTotalSales(tempsales)

    const temp = transactionData
    temp[0].value = fCurrency(dailyAnalyticsOverview?.transaction?.todayTotalCardAmount || 0)
    temp[1].value = fCurrency(dailyAnalyticsOverview?.transaction?.todayTotalCashAmount || 0)
    // temp[2].value = fCurrency(dailyAnalyticsOverview?.transaction?.todayTotalAchAmount || 0)
    temp[2].value = fCurrency(dailyAnalyticsOverview?.transaction?.todayTotalGiftCardAmount || 0)
    settransactionData(temp)

    const tempAnaytic = analyticsData
    tempAnaytic[0].value = dailyAnalyticsOverview?.transaction?.autopayToday || 0
    tempAnaytic[1].value = dailyAnalyticsOverview?.transaction?.failedAutopayToday || 0
    tempAnaytic[2].value = dailyAnalyticsOverview?.transaction?.repossessedToday || 0
    tempAnaytic[3].value = dailyAnalyticsOverview?.transaction?.chargeOffToday || 0
    tempAnaytic[4].value = dailyAnalyticsOverview?.transaction?.outForRepo || 0

    setAnalyticsData(tempAnaytic)

    const tempCallData = callingData
    tempCallData[0].value = dailyAnalyticsOverview?.transaction?.totalCalls || 0
    tempCallData[1].value = dailyAnalyticsOverview?.transaction?.totalCallsIn || 0
    tempCallData[2].value = dailyAnalyticsOverview?.transaction?.totalCallsOut || 0
    tempCallData[3].value = dailyAnalyticsOverview?.transaction?.totalNoAnswerCall || 0
    tempCallData[4].value = dailyAnalyticsOverview?.transaction?.totalRejectedCall || 0
    setCallingData(tempCallData)
  }, [dailyAnalyticsOverview?.transaction])

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: '80vh',
        color: 'common.white',
        backgroundColor: '#27293a',
        boxShadow: 'none',
        margin: 0
      }}
    >
      <CardHeader
        sx={{ textAlign: 'center' }}
        title={title || ''}
        subheader={subTitle || ''}
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
      />
      <CardContent
        sx={{
          '& .MuiTabPanel-root': { p: 0 },
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0
        }}
      >
        <Grid container spacing={isMobile ? 6 : 3} mt={5}>
          <Grid item xs={12} md={5} lg={3.5}>
            <Card
              sx={{
                color: 'common.white',
                background: '#2f3349',
                padding: '15px 15px 10px 15px',
                margin: '0 auto',
                height: '100%',
                display: 'flex !important',
                flexDirection: 'column'
              }}
            >
              <Typography
                noWrap
                sx={{
                  fontSize: islgScreen ? '1.6rem' : '1.3rem',
                  textAlign: 'center',
                  marginBottom: '30px'
                }}
              >
                Today's Live Sales
              </Typography>
              <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                {dailyAnalyticsOverview?.response?.map((data: any, index: number) => {
                  return (
                    <Box
                      key={index}
                      mt={2}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        textAlign: 'left',
                        justifyContent: 'space-between',
                        marginTop: '15px'
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: islgScreen ? '1.3rem' : '1rem',
                          textAlign: 'right'
                        }}
                      >
                        {data?.location}
                      </Typography>
                      <CustomAvatar
                        color='primary'
                        variant='rounded'
                        sx={{
                          mr: 2,
                          width: 'fit-content',
                          minWidth: 48,
                          height: 30,
                          fontSize: islgScreen ? '1rem' : '0.87rem',
                          color: 'common.white'
                          // backgroundColor: 'primary.dark'
                        }}
                      >
                        {data?.totalsales || 0}
                      </CustomAvatar>
                    </Box>
                  )
                })}
                <Box mt={2} sx={{ width: '100%', textAlign: 'center', margin: 'auto auto 0 auto' }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: islgScreen ? '1.6rem' : '1.3rem',
                      textAlign: 'center'
                    }}
                  >
                    Total Sales
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: islgScreen ? '1.6rem' : '1.3rem',
                      textAlign: 'center'
                    }}
                  >
                    {totalSales || 0}
                  </Typography>
                </Box>
              </div>
            </Card>
          </Grid>

          <Grid container item xs={12} md={5} lg={3.5} spacing={isMobile ? 6 : 3} sx={{ margin: '0 auto' }}>
            <Card
              sx={{ color: 'common.white', width: '100%', background: '#2f3349', padding: '10px', margin: '0 auto' }}
            >
              {analyticsData?.map((data: any, index: number) => {
                return (
                  <Box
                    key={index}
                    mt={2}
                    sx={{ display: 'flex', width: '100%', textAlign: 'left', justifyContent: 'space-between' }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem',
                        textAlign: 'right'
                      }}
                    >
                      {data?.label}
                    </Typography>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 'fit-content',
                        minWidth: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white'
                        // backgroundColor: 'primary.dark'
                      }}
                    >
                      {data?.value || 0}
                    </CustomAvatar>
                  </Box>
                )
              })}
              <Divider variant='fullWidth' style={{ background: 'white', margin: '30px 0 ' }} />
              {callingData?.map((data: any, index: number) => {
                return (
                  <Box
                    key={index}
                    mt={2}
                    sx={{ display: 'flex', width: '100%', textAlign: 'left', justifyContent: 'space-between' }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem',
                        textAlign: 'right'
                      }}
                    >
                      {data?.label}
                    </Typography>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 'fit-content',
                        minWidth: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white'
                        // backgroundColor: 'primary.dark'
                      }}
                    >
                      {data?.value || 0}
                    </CustomAvatar>
                  </Box>
                )
              })}
            </Card>
            {/* <Grid item xs={12} sx={{ background: '#2f3349', paddingBottom: "10px", margin: '0' }}>
              <Card sx={{ color: 'common.white', background: '#2f3349', paddingBottom: "10px", margin: '0 auto' }}>
                {analyticsData?.map((data: any, index: number) => {
                  return <Box key={index} mt={2} sx={{ display: 'flex', width: "100%", textAlign: "left", justifyContent: "space-between" }} >

                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem',
                        textAlign: "right"
                      }}
                    >
                      {data?.label}
                    </Typography>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: "fit-content",
                        minWidth: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        // backgroundColor: 'primary.dark'
                      }}
                    >
                      {data?.value || 0}
                    </CustomAvatar>
                  </Box>
                })}
              </Card>
            </Grid> */}
            {/* <Grid item xs={12} sx={{ background: '#2f3349', paddingBottom: "10px", margin: '10px 0 0 0' }}>
              <Card sx={{ color: 'common.white', background: '#2f3349', paddingBottom: "10px", margin: '0 auto' }}>
                {callingData?.map((data: any, index: number) => {
                  return <Box key={index} mt={2} sx={{ display: 'flex', width: "100%", textAlign: "left", justifyContent: "space-between" }} >

                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem',
                        textAlign: "right"
                      }}
                    >
                      {data?.label}
                    </Typography>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: "fit-content",
                        minWidth: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        // backgroundColor: 'primary.dark'
                      }}
                    >
                      {data?.value || 0}
                    </CustomAvatar>
                  </Box>
                })}
              </Card>
            </Grid> */}
          </Grid>

          <Grid item xs={12} md={5} lg={3.5}>
            <Card
              sx={{
                color: 'common.white',
                height: '100%',
                background: '#2f3349',
                padding: '15px 15px 10px 15px',
                margin: '0 auto',
                display: 'flex !important',
                flexDirection: 'column'
              }}
            >
              <Typography
                noWrap
                sx={{
                  fontSize: islgScreen ? '1.6rem' : '1.3rem',
                  textAlign: 'center',
                  marginBottom: '30px'
                }}
              >
                Money
              </Typography>
              <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                {transactionData?.map((data: any, index: number) => {
                  return (
                    <Box
                      key={index}
                      mt={2}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        textAlign: 'left',
                        justifyContent: 'space-between',
                        marginTop: '15px'
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: islgScreen ? '1.3rem' : '1rem',
                          textAlign: 'right'
                        }}
                      >
                        {data?.label}
                      </Typography>
                      <CustomAvatar
                        color='primary'
                        variant='rounded'
                        sx={{
                          mr: 2,
                          width: 'fit-content',
                          minWidth: 48,
                          height: 30,
                          padding: '2px 5px',
                          fontSize: islgScreen ? '1rem' : '0.87rem',
                          color: 'common.white'
                          // backgroundColor: 'primary.dark'
                        }}
                      >
                        {data?.value || 0}
                      </CustomAvatar>
                    </Box>
                  )
                })}

                <Box mt={2} sx={{ width: '100%', textAlign: 'center', margin: 'auto auto 0 auto' }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: islgScreen ? '1.6rem' : '1.3rem',
                      textAlign: 'center'
                    }}
                  >
                    Total Collected
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: islgScreen ? '1.6rem' : '1.3rem',
                      textAlign: 'center'
                    }}
                  >
                    {fCurrency(totalAmount) || 0}
                  </Typography>
                </Box>
              </div>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DailyAnalyticsOverview
