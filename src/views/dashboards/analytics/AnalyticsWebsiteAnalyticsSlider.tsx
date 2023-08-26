/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { useMediaQuery } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import IconifyIcon from 'src/@core/components/icon'
import { useSelector } from 'react-redux'
import DailyAgentOverview from '../crm/DailyAgentOverview'
import WeeklyAgentOverview from '../crm/WeeklyAgentOverview'
import MonthlyAnalyticsOverview from '../MonthlyAnalyticsOverview'
import DailyAnalyticsOverview from '../DailyAnalyticsOverview'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getAgentCreatedBy, getDashboardAnalytics } from 'src/store/dashboard'

const CardTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  lineHeight: 1.6,
  fontWeight: 500,
  fontSize: '1.125rem',
  letterSpacing: '0.15px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.25rem'
  }
}))

const campainDetail: any = [
  {
    title: 'Calls Made',
    key: 'totalCalls'
  },
  {
    title: 'Call Time',
    key: 'callTime'
  },
  {
    title: 'Call Answered',
    key: 'totalAnsweredCall'
  },
  {
    title: 'Call Rejected',
    key: 'totalRejectedCall'
  },
  {
    title: 'Call Not Answered',
    key: 'totalNoAnswerCall'
  },
  {
    title: 'SMS Total',
    key: 'smsTotal'
  },
  {
    title: 'Email Total',
    key: 'emailTotal'
  }
]

const transactionMethod: any = [
  {
    title: 'Card Transactions',
    key: 'TotalCardAmount'
  },
  {
    title: 'Cash Transactions',
    key: 'TotalCashAmount'
  },
  {
    title: 'Gift Card Transactions',
    key: 'TotalGiftCardAmount'
  },
  {
    title: 'ACH Transactions',
    key: 'TotalAchAmount'
  }
]

const AnalyticsWebsiteAnalyticsSlider = () => {
  // ** Hook
  const theme = useTheme()
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  // ** STORE
  const dashboardData = useSelector((state: any) => state.dashboard.analytic)
  const analyticsData = useSelector((state: any) => state.dashboard.analytic)

  const [data, setData] = useState([
    {
      status: 'Daily',
      details: {
        totalAutopay: 0,
        repoToday: 0,
        autopayToday: 0,
        failedAutopayToday: 0,
        chargedOffToday: 0,
        salesToday: 0,
        yesterdayTransactionAmount: 0,
        TodayTransactionAmount: 0,
        firstIntervalAmount: 0,
        secondIntervalAmount: 0,
        thirdIntervalAmount: 0,
        forthIntervalAmount: 0,
        fifthIntervalAmount: 0,
        sixthIntervalAmount: 0,
        lastIntervalAmount: 0,
        todayTotalCardAmount: 0,
        todayTotalCashAmount: 0,
        todayTotalAchAmount: 0,
        todayTotalGiftCardAmount: 0,
        totalCalls: 0,
        callTime: 0,
        totalAnsweredCall: 0,
        totalRejectedCall: 0,
        totalNoAnswerCall: 0,
        totalCallsIn: 0,
        totalCallsOut: 0
      },
      campainDetail: [...campainDetail],
      transactionMethod: [...transactionMethod]
    },
    {
      status: 'Weekly',
      details: {
        totalAutopay: 0,
        repoweek: 0,
        autopayweek: 0,
        failedAutopayweek: 0,
        chargedOffWeek: 0,
        salesWeek: 14,
        lastweekTransactionAmount: 0,
        weekTransactionAmount: 0,
        mondayAmount: 0,
        tuesdayAmount: 0,
        wednesdayAmount: 0,
        thursdayAmount: 0,
        fridayAmount: 0,
        saturdayAmount: 0,
        sundayAmount: 0,
        weekTotalCardAmount: 0,
        weekTotalCashAmount: 0,
        weekTotalAchAmount: 0,
        weekTotalGiftCardAmount: 0,
        totalCalls: 0,
        callTime: 0,
        totalAnsweredCall: 0,
        totalRejectedCall: 0,
        totalNoAnswerCall: 0,
        totalCallsIn: 0,
        totalCallsOut: 0
      },
      campainDetail: [...campainDetail],
      transactionMethod: [...transactionMethod]
    },
    {
      status: 'Monthly',
      details: {
        totalAutopay: 0,
        repomonth: 0,
        autopaymonth: 0,
        failedAutopaymonth: 0,
        chargedOffMonth: 0,
        salesMonth: 0,
        lastmonthTransactionAmount: 0,
        monthTransactionAmount: 0,
        mondayAmount: 0,
        tuesdayAmount: 0,
        wednesdayAmount: 0,
        thursdayAmount: 0,
        fridayAmount: 0,
        saturdayAmount: 0,
        sundayAmount: 0,
        monthTotalCardAmount: 0,
        monthTotalCashAmount: 0,
        monthTotalAchAmount: 0,
        monthTotalGiftCardAmount: 0,
        totalCalls: 0,
        callTime: 0,
        totalAnsweredCall: 0,
        totalRejectedCall: 0,
        totalNoAnswerCall: 0,
        totalCallsIn: 0,
        totalCallsOut: 0
      },
      campainDetail: [...campainDetail],
      transactionMethod: [...transactionMethod]
    }
  ])

  // ** STATE
  const [time, setTime] = useState(+new Date())

  useEffect(() => {
    if (user?.roles?.id !== 1) {
      dispatch(getDashboardAnalytics())
      user?._id && dispatch(getAgentCreatedBy(user?._id))
    }
  }, [user])

  useEffect(() => {
    const temp = data
    temp[0].details = dashboardData?.dailyAnalytics || data[0].details
    temp[1].details = dashboardData?.weekAnalytics || data[1].details
    temp[2].details = dashboardData?.monthAnalytics || data[2].details
    setData(temp)
    setTime(+new Date())
  }, [dashboardData])

  return (
    <Carousel
      NextIcon={<IconifyIcon icon='bxs:right-arrow' />}
      PrevIcon={<IconifyIcon icon='bxs:left-arrow' />}
      animation='slide'
      interval={20000} // 20 seconds (20000 milliseconds)
    >
      {/* <Card sx={{ position: 'relative', backgroundColor: '#27293a', }}>
        <Box
          key={1}
          className='keen-slider__slide'
          sx={{
            height: 'fit-content !important',
            p: 6,
            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <CardTitle
            sx={{
              p: 6,
              pl: 0,
              textAlign: 'left'
            }}
          >
            {data[0].status} Analytics Overview
          </CardTitle>
          <Grid container>
            <Grid item xs={12} md={4} lg={6}  >
              <Grid container spacing={4.5}>
                <Grid item key={0} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.dailyAnalytics?.repoToday || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Repo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={1} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.dailyAnalytics?.totalAutopay || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={2} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.dailyAnalytics?.failedAutopayToday || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Failed AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={3} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.dailyAnalytics?.chargedOffToday || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Charged Off
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={4} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.dailyAnalytics?.salesToday || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Sales
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={6} sx={{ maxWidth: '80vw' }}>
              <CrmRevenueGrowthDaily data={data[0]} time={time} />
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {campainDetail?.map((item: any, index: number) => {
                  const key: string = item.key

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.dailyAnalytics?.[key as keyof typeof analyticsData.dailyAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {transactionMethod?.map((item: any, index: number) => {
                  const key = `today${item.key}`

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.dailyAnalytics?.[key as keyof typeof analyticsData.dailyAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>


      <Card sx={{ position: 'relative', backgroundColor: '#27293a', }}>
        <Box
          key={1}
          className='keen-slider__slide'
          sx={{
            height: 'fit-content !important',
            p: 6,
            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <CardTitle
            sx={{
              p: 6,
              pl: 0,
              textAlign: 'left'
            }}
          >
            {data[1].status} Analytics Overview
          </CardTitle>
          <Grid container>
            <Grid item xs={12} md={4} lg={6}>
              <Grid container spacing={4.5}>
                <Grid item key={0} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.weekAnalytics?.repoweek || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Repo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={1} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.weekAnalytics?.totalAutopay || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={2} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.weekAnalytics?.failedAutopayweek || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Failed AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={3} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.weekAnalytics?.chargedOffWeek || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Charged Off
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={4} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.weekAnalytics?.salesWeek || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Sales
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={6} sx={{ maxWidth: '80vw' }}>
              <CrmRevenueGrowth data={data[1]} time={time} />
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {campainDetail?.map((item: any, index: number) => {
                  const key: string = item.key

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.weekAnalytics?.[key as keyof typeof analyticsData.weekAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {transactionMethod?.map((item: any, index: number) => {
                  const key = `week${item.key}`

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.weekAnalytics?.[key as keyof typeof analyticsData.weekAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card sx={{ position: 'relative', backgroundColor: '#27293a', }}>
        <Box
          key={2}
          className='keen-slider__slide'
          sx={{
            height: 'fit-content !important',
            p: 6,
            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <CardTitle
            sx={{
              p: 6,
              pl: 0,
              textAlign: 'left'
            }}
          >
            {data[2].status} Analytics Overview
          </CardTitle>
          <Grid container>
            <Grid item xs={12} md={4} lg={6}>
              <Grid container spacing={4.5}>
                <Grid item key={0} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.monthAnalytics?.repomonth || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Repo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={1} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.monthAnalytics?.totalAutopay || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={2} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.monthAnalytics?.failedAutopaymonth || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Failed AutoPay
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={3} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.monthAnalytics?.chargedOffMonth || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Charged Off
                    </Typography>
                  </Box>
                </Grid>
                <Grid item key={4} xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontSize: islgScreen ? '1rem' : '0.87rem',
                        color: 'common.white',
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {analyticsData?.monthAnalytics?.salesMonth || 0}
                    </CustomAvatar>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: islgScreen ? '1.3rem' : '1rem'
                      }}
                    >
                      Sales
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={6} sx={{ maxWidth: '80vw' }}>
              <CrmRevenueGrowth data={data[2]} time={time} />
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {campainDetail?.map((item: any, index: number) => {
                  const key: string = item.key

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.monthAnalytics?.[key as keyof typeof analyticsData.monthAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid item sm={12} md={6} mt={10}>
              <Grid container spacing={4.5}>
                {transactionMethod?.map((item: any, index: number) => {
                  const key = `month${item.key}`

                  return (
                    <Grid item key={index} xs={12} md={6}>
                      <Box sx={{ display: 'flex' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            minWidth: 48,
                            width: 'fit-content',
                            height: 30,
                            fontSize: islgScreen ? '1rem' : '0.87rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {analyticsData?.monthAnalytics?.[key as keyof typeof analyticsData.monthAnalytics] || 0}
                          </Typography>
                        </CustomAvatar>
                        <Typography noWrap sx={{ fontSize: islgScreen ? '1.3rem' : '1rem' }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card> */}

      <Card sx={{ position: 'relative' }}>
        <Box
          key={6}
          className='keen-slider__slide'
          sx={{
            height: '100% !important',

            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <DailyAgentOverview title='Daily Agents Routes' subTitle='' />
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Card sx={{ position: 'relative' }}>
        <Box
          key={7}
          className='keen-slider__slide'
          sx={{
            height: '100% !important',

            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <WeeklyAgentOverview title='Weekly Agents Routes' subTitle='' />
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Card sx={{ position: 'relative', backgroundColor: '#27293a' }}>
        <Box
          key={5}
          className='keen-slider__slide'
          sx={{
            height: '100% !important',

            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <DailyAnalyticsOverview title='Daily Analytics Overview' subTitle='' />
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card sx={{ position: 'relative', backgroundColor: '#27293a' }}>
        <Box
          key={5}
          className='keen-slider__slide'
          sx={{
            height: '100% !important',

            '& .MuiTypography-root': { color: 'common.white' },
            width: '800px',
            minWidth: '100% !important'
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <MonthlyAnalyticsOverview title='Monthly Analytics Overview' subTitle='' />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Carousel>
  )
}

export default AnalyticsWebsiteAnalyticsSlider
