// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useEffect, useState } from 'react'
import { getDashboardCampaignDetail } from 'src/store/dashboard'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'

interface DataType {
  icon: string
  title: string
  amount: string
  trendNumber: string
  avatarColor: ThemeColor
  trend?: 'positive' | 'negative'
}
type Props = {
  title?: string
  subTitle: string
}
const filterDateValues = ['Today', 'Weekly', 'LastWeek', 'LastMonth']
const AnalyticsMonthlyCampaignState = ({ title, subTitle }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [campainDetail, setCampainDetail] = useState<any>([])
  const [filterDate, setFilterDate] = useState<string>('LastWeek')
  const dashboardCampaignDetail = useSelector((state: any) => state.dashboard.campaignDetail)

  useEffect(() => {
    dispatch(getDashboardCampaignDetail(filterDate))
  }, [filterDate])
  useEffect(() => {
    const temp: any = [
      {
        title: 'Calls Made',
        amount: 0,
        trendNumber: '',
        avatarColor: 'info',
        icon: 'tabler:link'
      },
      {
        amount: 0,
        title: 'Call Time',
        trendNumber: '',
        icon: 'mingcute:time-line',
        avatarColor: 'primary'
      },
      {
        amount: 0,
        trend: 'negative',
        title: 'Call Answered',
        trendNumber: '',
        avatarColor: 'success',
        icon: 'ion:call-outline'
      },
      {
        amount: 0,
        trend: 'negative',
        title: 'Call Rejected',
        trendNumber: '',
        avatarColor: 'warning',
        icon: 'subway:call-3'
      },
      {
        amount: 0,
        trend: 'negative',
        title: 'Call Not Answered',
        trendNumber: '',
        avatarColor: 'error',
        icon: 'gg:phone'
      },
      {
        amount: 0,
        title: 'SMS Total',
        trendNumber: '',
        icon: 'la:sms',
        avatarColor: 'primary'
      },
      {
        amount: 0,
        title: 'Email Total',
        trendNumber: '',
        icon: 'ic:outline-email',
        avatarColor: 'primary'
      }
    ]

    temp[0].amount = dashboardCampaignDetail?.totalCalls || 0
    temp[0].trendNumber = `${dashboardCampaignDetail?.totalCalls / 100 || 0}%`

    temp[1].amount = parseInt(((dashboardCampaignDetail?.callTime || 0) / 60)?.toString())
    temp[1].trendNumber = `${parseInt((dashboardCampaignDetail?.callTime / 60 / 100)?.toString()) || 0}%`

    temp[2].amount = dashboardCampaignDetail?.totalAnsweredCall || 0
    temp[2].trendNumber = `${dashboardCampaignDetail?.totalAnsweredCall / 100 || 0}%`

    temp[3].amount = dashboardCampaignDetail?.totalRejectedCall || 0
    temp[3].trendNumber = `${dashboardCampaignDetail?.totalRejectedCall / 100 || 0}%`

    temp[4].amount = dashboardCampaignDetail?.totalNoAnswerCall || 0
    temp[4].trendNumber = `${dashboardCampaignDetail?.totalNoAnswerCall / 100 || 0}%`

    temp[5].amount = dashboardCampaignDetail?.smsTotal || 0
    temp[5].trendNumber = `${(dashboardCampaignDetail?.smsTotal || 0) / 100 || 0}%`

    temp[6].amount = dashboardCampaignDetail?.emailTotal || 0
    temp[6].trendNumber = `${(dashboardCampaignDetail?.emailTotal || 0) / 100 || 0}%`

    setCampainDetail(temp)
  }, [dashboardCampaignDetail])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title || ''}
        subheader={subTitle || 'Select the Date and Category for downloading report'}
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={
          <OptionsMenu
            options={['Today', 'Weekly', 'Last Week', 'Last Months']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
            handleCustomClick={(i: number) => setFilterDate(filterDateValues[i])}
          />
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          {campainDetail?.map((item: DataType, index: number) => {
            return (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                    // mb: index !== campainDetail?.length - 1 ? [7, 7, 6.25, 7] : undefined
                  }}
                >
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{ mr: 4, width: 34, height: 34 }}
                  >
                    <Icon icon={item.icon} />
                  </CustomAvatar>
                  <Box
                    sx={{
                      rowGap: 1,
                      columnGap: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 4, fontWeight: 500, color: 'text.secondary' }}>{item.amount}</Typography>
                      <Typography sx={{ color: `${item.trend === 'negative' ? 'error' : 'success'}.main` }}>
                        {item.trendNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsMonthlyCampaignState
