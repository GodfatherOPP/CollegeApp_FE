// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Tab } from '@mui/material'
import { useSelector } from 'react-redux'
import { getDashboardRouteTracker } from 'src/store/dashboard'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useMediaQuery } from '@mui/material'
import { TabContext, TabList } from '@mui/lab'
import { getRoutes } from 'src/store/management/routes'

type TabType = {
  type?: any
  _id?: any
  id?: any
  total?: string
  currentAcct?: string
  pastDueAcct?: string
  ptpKept?: string
  ptp?: string
  repo?: string
  outForRepo?: string
  avatarColor?: any
  avatarIcon?: any
  subtitle?: any
  title?: any
  selectedColor?: any
}

const renderTabs = (value: any, data: TabType[], handleRouteClick: any) => {
  return data.map((item, index) => {
    return (
      <Tab
        key={index}
        value={item.selectedColor || `Route${index + 1}`}
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
              borderStyle: 'solid'
            }}
            onClick={() => {
              handleRouteClick({
                ...item,
                filterDate: 'Today'
              })
            }}
          >
            <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
              {item.selectedColor || `Route ${index + 1}`}
            </Typography>
          </Box>
        }
      />
    )
  })
}

const renderTabPanels = (value: any, data: TabType[]) => {
  return data?.map((item, index) => {
    return (
      <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: index !== data.length - 1 ? 4 : undefined }}>
          <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} sx={{ mr: 4, width: 34, height: 34 }}>
            <Icon icon={item.avatarIcon} />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {item.subtitle}
            </Typography>
          </Box>
        </Box>
      </Grid>
    )
  })
}

const AnalyticsSupportTracker = () => {
  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [progressData, setProgressData] = useState({
    currentAccount: 0,
    collected: 0,
    repossessed: 0
  })
  const [data, setData] = useState<any>([])
  const [value, setValue] = useState<any>('Total')
  const [routeId, setRouteId] = useState<any>({
    selectedColor: '',
    selectStart: '',
    selectEnd: '',
    filterDate: 'Today'
  })
  const dashboardData = useSelector((state: any) => state.dashboard.routeTracker)
  const routesList = useSelector((state: any) => state.route?.routes) // route list
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showChart, setShowChart] = useState<any>(false)

  useEffect(() => {
    dispatch(getDashboardRouteTracker(routeId))
  }, [routeId])

  useEffect(() => {
    !routesList && dispatch(getRoutes({}))
  }, [])

  useEffect(() => {
    setDashboardData()
  }, [dashboardData])
  
  const setDashboardData = useCallback(() => {
    setShowChart(false)
    const temp = [
      {
        subtitle: '0',
        title: 'Current Acct.',
        avatarIcon: 'tabler:ticket'
      },
      {
        subtitle: '0',
        avatarColor: 'info',
        title: 'Past Due Acct .',
        avatarIcon: 'tabler:circle-check'
      },
      {
        subtitle: '0',
        title: 'Total',
        avatarColor: 'warning',
        avatarIcon: 'tabler:clock'
      },
      {
        subtitle: '0',
        title: 'PTP',
        avatarColor: 'warning',
        avatarIcon: 'tabler:clock'
      },
      {
        subtitle: '0',
        title: 'PTP Kept %',
        avatarColor: 'warning',
        avatarIcon: 'tabler:clock'
      },
      {
        subtitle: '0',
        title: 'Out For Repo',
        avatarColor: 'warning',
        avatarIcon: 'tabler:clock'
      },
      {
        subtitle: '0',
        title: 'Repossesed',
        avatarColor: 'warning',
        avatarIcon: 'tabler:clock'
      }
    ]
    temp[0].subtitle = dashboardData?.currentAccount
    temp[1].subtitle = dashboardData?.pastDueAccount
    temp[2].subtitle = dashboardData?.total
    temp[3].subtitle = dashboardData?.ptpAccount
    temp[4].subtitle =
      dashboardData?.ptpAccount === 0
        ? '0'
        : ((dashboardData?.ptpKeptAccount / dashboardData?.ptpAccount) * 100).toFixed().toString()
    temp[5].subtitle = dashboardData?.outForRepo
    temp[6].subtitle = dashboardData?.repossessedAccount

    const tempCurrAcc = ((dashboardData?.currentAccount / dashboardData?.total) * 100).toFixed()
    const tempCollected = ((dashboardData?.totalPaidAmount / dashboardData?.totalDueAmount) * 100).toFixed()
    const tempRepossessed = ((dashboardData?.repossessedAccount / dashboardData?.total) * 100).toFixed()

    setProgressData({
      currentAccount: parseInt(parseFloat(tempCurrAcc.toString()).toFixed()) || 0,
      collected: parseInt(parseFloat(tempCollected.toString()).toFixed()) || 0,
      repossessed: parseInt(parseFloat(tempRepossessed.toString()).toFixed()) || 0
    })
    setShowChart(true)
    setData(temp)
  }, [dashboardData])

  const handleChange = (event: SyntheticEvent, newValue: any) => {
    setValue(newValue)
  }
  const handleRouteClick = (id: any) => {
    setRouteId(id)
  }

  const options: ApexOptions[] = [
    {
      chart: {
        sparkline: { enabled: true }
      },
      labels: ['Currents Account'],
      colors: [hexToRGBA('#C34A36', 1)],
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      plotOptions: {
        radialBar: {
          endAngle: 130,
          startAngle: -140,
          hollow: { size: '60%' },
          track: {
            background: '#845EC2',
            opacity: 0.6
          },

          dataLabels: {
            name: {
              offsetY: -15,
              fontSize: '14px',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              fontWeight: 500,
              fontSize: '38px',
              formatter: value => `${value}%`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      },
      grid: {
        padding: {
          top: -30,
          bottom: 12
        }
      },
      responsive: [
        {
          breakpoint: 1300,
          options: {
            grid: {
              padding: {
                left: 22
              }
            }
          }
        },
        {
          breakpoint: theme.breakpoints.values.md,
          options: {
            grid: {
              padding: {
                left: 0
              }
            }
          }
        }
      ]
    },
    {
      chart: {
        sparkline: { enabled: true }
      },
      labels: ['Collected $'],
      colors: [hexToRGBA('#C34A36', 1)],
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      plotOptions: {
        radialBar: {
          endAngle: 130,
          startAngle: -140,
          hollow: { size: '60%' },
          track: {
            background: '#845EC2',
            opacity: 0.6
          },

          dataLabels: {
            name: {
              offsetY: -15,
              fontSize: '14px',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              fontWeight: 500,
              fontSize: '38px',
              formatter: value => `${value}%`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      },
      grid: {
        padding: {
          top: -30,
          bottom: 12
        }
      },
      responsive: [
        {
          breakpoint: 1300,
          options: {
            grid: {
              padding: {
                left: 22
              }
            }
          }
        },
        {
          breakpoint: theme.breakpoints.values.md,
          options: {
            grid: {
              padding: {
                left: 0
              }
            }
          }
        }
      ]
    },
    {
      chart: {
        sparkline: { enabled: true }
      },
      labels: ['Repo'],
      colors: [hexToRGBA('#C34A36', 1)],
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      plotOptions: {
        radialBar: {
          endAngle: 130,
          startAngle: -140,
          hollow: { size: '60%' },
          track: {
            background: '#845EC2',
            opacity: 0.6
          },

          dataLabels: {
            name: {
              offsetY: -15,
              fontSize: '14px',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              fontWeight: 500,
              fontSize: '38px',
              formatter: value => `${value}%`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      },
      grid: {
        padding: {
          top: -30,
          bottom: 12
        }
      },
      responsive: [
        {
          breakpoint: 1300,
          options: {
            grid: {
              padding: {
                left: 22
              }
            }
          }
        },
        {
          breakpoint: theme.breakpoints.values.md,
          options: {
            grid: {
              padding: {
                left: 0
              }
            }
          }
        }
      ]
    }
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Route Tracker'
        subheader='This Week'
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        sx={{ padding: '1em !important' }}
      />
      <CardContent>
        <Grid container spacing={isMobile ? 6 : 3}>
          <TabContext value={value}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleChange}
              aria-label='earning report tabs'
              sx={{
                width: '100%',
                margin: '10px 5px',
                border: '0 !important',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } }
              }}
            >
              <Tab
                key={-1}
                value={'Total'}
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
                      borderStyle: 'solid'
                    }}
                    onClick={() => {
                      handleRouteClick({
                        selectedColor: '',
                        selectStart: '',
                        selectEnd: '',
                        filterDate: 'Today'
                      })
                    }}
                  >
                    <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
                      Total
                    </Typography>
                  </Box>
                }
              />
              {renderTabs(value, routesList, handleRouteClick)}
            </TabList>
            <Grid item xs={12} container spacing={2}>
              {renderTabPanels(value, data)}
            </Grid>
          </TabContext>

          {showChart && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <ReactApexcharts
                  type='radialBar'
                  height={isMobile ? 260 : 305}
                  options={options[0]}
                  series={[progressData?.currentAccount]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ReactApexcharts
                  type='radialBar'
                  height={isMobile ? 260 : 305}
                  options={options[1]}
                  series={[progressData?.collected]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ReactApexcharts
                  type='radialBar'
                  height={isMobile ? 260 : 305}
                  options={options[2]}
                  series={[progressData?.repossessed]}
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsSupportTracker
