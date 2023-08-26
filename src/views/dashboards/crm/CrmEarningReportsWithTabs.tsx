import { SyntheticEvent, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Theme, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Grid, LinearProgress } from '@mui/material'
import { ThemeColor } from 'src/@core/layouts/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getDashboardRouteDetails } from 'src/store/dashboard'
import { useSelector } from 'react-redux'

type TabType = {
  selectEnd: string
  selectFrom: string
  selectedColor: string
}

interface DataType {
  title: string
  avatarIcon: string
  avatarColor?: ThemeColor
  progressColor?: ThemeColor
  key: string
  byTotalActiveUser: boolean
}

const data: DataType[] = [
  {
    title: 'Under 6 Months',
    avatarIcon: 'tabler:chart-pie-2',
    key: 'lastSixmonthUser',
    byTotalActiveUser: false
  },
  {
    title: 'Disabled %',
    avatarColor: 'error',
    progressColor: 'info',
    avatarIcon: 'iwwa:danger',
    key: 'DisabledUser',
    byTotalActiveUser: true
  },
  {
    title: 'In Service',
    avatarColor: 'warning',
    progressColor: 'warning',
    avatarIcon: 'ph:wrench',
    key: 'InserviceUser',
    byTotalActiveUser: false
  },
  {
    title: 'OFR %',
    avatarColor: 'secondary',
    progressColor: 'secondary',
    avatarIcon: 'mdi:tow-truck',
    key: 'OfrUser',
    byTotalActiveUser: true
  },
  {
    title: 'RTC %',
    avatarColor: 'info',
    progressColor: 'info',
    avatarIcon:
      'streamline:legal-justice-hammer-hammer-work-legal-mallet-office-company-gavel-justice-judge-arbitration-court',
    key: 'RtcUser',
    byTotalActiveUser: true
  },
  {
    title: 'Arrangment',
    avatarColor: 'success',
    progressColor: 'success',
    avatarIcon: 'tabler:chart-pie-2',
    key: 'arrangment',
    byTotalActiveUser: true
  }
]

const renderTabs = (route: any, theme: Theme, tabData: TabType[]) => {
  return tabData.map((item, index) => {
    return (
      <Tab
        key={index}
        value={index.toString()}
        label={
          <Box
            sx={{
              width: 100,
              height: 44,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderStyle: index == route ? 'solid' : 'dashed',
              borderColor: index == route ? theme.palette.primary.main : theme.palette.divider
            }}
          >
            <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
              {item?.selectedColor ? item?.selectedColor : `Route ${index + 1}`}
            </Typography>
          </Box>
        }
      />
    )
  })
}

type Props = {
  tabData: TabType[]
  title?: string
}
const CrmEarningReportsWithTabs = ({ tabData, title }: Props) => {
  // ** State
  const [route, setRoute] = useState<any>('0')
  const theme = useTheme()
  const dispatch: any = useDispatch<AppDispatch>()
  const routeDetail = useSelector((state: any) => state.dashboard.routeDetail)

  const handleChange = (event: SyntheticEvent, newValue: any) => {
    console.log(newValue)
    setRoute(newValue)
  }

  useEffect(() => {
    const index = parseInt(route)
    const selectedRoute = tabData[route]
    if (index >= 0 && selectedRoute) {
      const selectedRoute = tabData[route]
      dispatch(
        getDashboardRouteDetails(
          selectedRoute?.selectFrom,
          selectedRoute?.selectEnd,
          selectedRoute?.selectedColor,
          'Today'
        )
      )
    }
  }, [route, tabData])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title || ''} subheaderTypographyProps={{ sx: { mt: '0 !important' } }} />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
        <Grid container spacing={6}>
          {routeDetail &&
            routeDetail?.map((item: any, index: any) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    mt: 6,
                    width: 100,
                    height: 44,
                    borderWidth: 1,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderStyle: 'solid',
                    borderColor: theme.palette.primary.main
                  }}
                >
                  <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
                    {item?.selectedColor ? item?.selectedColor : `Route ${index + 1}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    p: theme.spacing(4, 5),
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Grid container spacing={6}>
                    {data &&
                      data?.map((dataItem: DataType, index: number) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                              skin='light'
                              variant='rounded'
                              color={dataItem.avatarColor}
                              sx={{ mr: 2, width: 26, height: 26 }}
                            >
                              <Icon fontSize='1.125rem' icon={dataItem.avatarIcon} />
                            </CustomAvatar>
                            <Typography sx={{ fontWeight: 500 }}>{dataItem.title}</Typography>
                          </Box>
                          <Typography variant='h6' sx={{ mb: 2.5 }}>
                            {dataItem?.byTotalActiveUser && item
                              ? (item[dataItem.key] / item['totalActiveUser']).toFixed(2) || 0
                              : item && item[dataItem.key]}
                          </Typography>
                          <LinearProgress
                            variant='determinate'
                            value={
                              dataItem?.byTotalActiveUser
                                ? (item[dataItem.key] / item['totalActiveUser']) * 100 || 0
                                : (item[dataItem.key] / item.totalUser) * 100
                            }
                            color={item.progressColor}
                            sx={{ height: 3 }}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              </Grid>
            ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmEarningReportsWithTabs
