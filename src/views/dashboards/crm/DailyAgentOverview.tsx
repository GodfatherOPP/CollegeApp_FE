import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Card, Grid, useMediaQuery } from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getDailyAgentReport } from 'src/store/dashboard'
import { useSelector } from 'react-redux'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { fCurrency } from 'src/utils/formatNumber'
import { LoaderIcon } from 'react-hot-toast'

type Props = {
  title?: string
  subTitle?: string
  agents?: any
}
const DailyAgentOverview = ({ title, subTitle }: Props) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [Data, setData] = useState<any>([])
  const [progressDataPercentage, setProgressDataPercentage] = useState({
    currentAccount: 0,
    starting: 0
  })
  const [extraData, setExtraData] = useState({
    ptp: 0,
    totalArrangment: 0
  })
  const [details, setDetails] = useState<any>([
    { label: 'Total Calls', value: 0 },
    { label: 'Inbound', value: 0 },
    { label: 'Outbound', value: 0 },
    { label: 'SMS/Text', value: 0 },
    { label: 'Email', value: 0 }
  ])
  const [statsDetails, setStatsDetails] = useState<any>([
    { label: 'Total Talk Time', value: `0` },
    { label: 'Answered Calls', value: 0 },
    { label: 'Not Answered Calls', value: 0 },
    { label: 'Rejected Calls', value: 0 },
    { label: 'Current Unread Msg.', value: 0 }
  ])
  const [progressData, setProgressData] = useState({
    starting: 0
  })
  const dailyAgentReport = useSelector((state: any) => state.dashboard.dailyAgentReport)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const islgScreen = useMediaQuery(theme.breakpoints.up('xl'))

  const [options, setOptions] = useState<ApexOptions[]>([
    {
      chart: {
        sparkline: { enabled: true }
      },
      labels: ['Current Accounts'],
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
          startAngle: -130,
          hollow: { size: '55%' },
          track: {
            background: '#845EC2',
            opacity: 0.6
          },

          dataLabels: {
            name: {
              offsetY: -15,
              fontSize: '15px',
              color: '#fff',
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              fontWeight: 400,
              fontSize: '32px',
              formatter: value => `${value}%`,
              color: '#fff',
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
      labels: [`Starting ( ${progressData?.starting || 0} )`],
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
          startAngle: -130,
          hollow: { size: '58%' },
          track: {
            background: '#845EC2',
            opacity: 0.6
          },

          dataLabels: {
            name: {
              offsetY: -15,
              fontSize: '15px',
              color: '#fff',
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              // fontWeight: 200,
              fontSize: '26px',
              formatter: value => `${value}%`,
              color: '#fff',
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
  ])

  useEffect(() => {
    // Dispatch the initial action when the component mounts
    dispatch(getDailyAgentReport())

    // Set up an interval to dispatch the action every 10 seconds
    const intervalId = setInterval(() => {
      dispatch(getDailyAgentReport())
    }, 10000) // 5000 milliseconds = 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch])

  useEffect(() => {
    setDashboardData()
  }, [dailyAgentReport])
  const setDashboardData = () => {
    setDetails([
      { label: 'Total Calls', value: dailyAgentReport?.routeData?.allCallsMade || 0 },
      { label: 'Inbound', value: dailyAgentReport?.routeData?.allCallsIn || 0 },
      { label: 'Outbound', value: dailyAgentReport?.routeData?.allCallsOut || 0 },
      { label: 'SMS/Text', value: dailyAgentReport?.routeData?.totalSms || 0 },
      { label: 'Email', value: dailyAgentReport?.routeData?.totalEmail || 0 }
    ])
    setStatsDetails([
      { label: 'Total Talk Time', value: `${dailyAgentReport?.routeData?.allcallTime?.toFixed(2)} Hr.` || `0` },
      { label: 'Answered Calls', value: dailyAgentReport?.routeData?.allAnsweredCall || 0 },
      { label: 'Not Answered Calls', value: dailyAgentReport?.routeData?.allNoAnswerCall || 0 },
      { label: 'Rejected Calls', value: dailyAgentReport?.routeData?.allRejectedCall || 0 },
      { label: 'Current Unread Msg.', value: 0 }
    ])
    const tempCurrAcc = (
      (dailyAgentReport?.routeData?.currentAccount / dailyAgentReport?.routeData?.totalIdmsCustomer) *
      100
    ).toFixed()
    const tempstarting = (
      (dailyAgentReport?.routeData?.mondayCurrentAccount / dailyAgentReport?.routeData?.totalIdmsCustomer) *
      100
    ).toFixed()
    setProgressDataPercentage({
      currentAccount: parseInt(parseFloat(tempCurrAcc.toString()).toFixed()) || 0,
      starting: parseInt(parseFloat(tempstarting.toString()).toFixed()) || 0
    })
    setProgressData({
      starting: dailyAgentReport?.routeData?.mondayCurrentAccount || 0
    })
    setExtraData({
      ptp: dailyAgentReport?.routeData?.totalPtp || 0,
      totalArrangment: dailyAgentReport?.routeData?.totalArrangment || 0
    })
    setOptions([
      {
        chart: {
          sparkline: { enabled: true }
        },
        labels: ['Currents Account', dailyAgentReport?.routeData?.currentAccount],
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
            startAngle: -130,
            hollow: { size: '55%' },
            track: {
              background: '#845EC2',
              opacity: 0.6
            },

            dataLabels: {
              name: {
                offsetY: -15,
                fontSize: '15px',
                color: '#fff',
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                fontWeight: 400,
                fontSize: '32px',
                formatter: value => `${value}%`,
                color: '#fff',
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
        labels: [
          `Starting ( ${dailyAgentReport?.routeData?.mondayCurrentAccount || 0} )`,
          dailyAgentReport?.routeData?.mondayCurrentAccount
        ],
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
            startAngle: -130,
            hollow: { size: '58%' },
            track: {
              background: '#845EC2',
              opacity: 0.6
            },

            dataLabels: {
              name: {
                offsetY: -15,
                fontSize: '15px',
                color: '#fff',
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                // fontWeight: 200,
                fontSize: '26px',
                formatter: value => `${value}%`,
                color: '#fff',
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
    ])
  }

  useEffect(() => {
    const filterData = dailyAgentReport?.data
      ?.map((item: any) => {
        const tempItem = { ...item } // Create a shallow copy of the item
        if (tempItem.totalUser !== 0) {
          tempItem.currentAccount = ((tempItem.currentAccount / tempItem.totalUser) * 100).toFixed(2)
        } else {
          tempItem.currentAccount = 0
        }

        return tempItem
      })
      .sort((a: any, b: any) => b.currentAccount.localeCompare(a.currentAccount, undefined, { numeric: true }))

    setData(filterData)
  }, [dailyAgentReport])

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: '80vh',
        color: 'common.white',
        background: '#27293a',
        boxShadow: 'none',
        margin: 0
      }}
    >
      <CardHeader
        sx={{ textAlign: 'center', padding: '10px 0 5px 0' }}
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
          minHeight: 0,
          padding: '0 10px'
        }}
      >
        {!dailyAgentReport ? (
          <LoaderIcon style={{ width: '50px', height: '50px', margin: 'auto' }} />
        ) : (
          <>
            <Box
              sx={{
                minWidth: '800px'
              }}
            >
              <div>
                <Grid container spacing={0} style={{ borderBottom: '1.5px solid white', paddingBottom: '5px' }}>
                  <Grid item xs={2} style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '5px auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}></Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={3} style={{ width: '100%', margin: '0 4px' }}>
                    <Grid item xs={12} style={{ width: '100%', margin: '0 4px' }}>
                      <Box
                        sx={{
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '5px auto'
                        }}
                      >
                        <Typography sx={{ fontWeight: 500 }}>Calls</Typography>
                      </Box>
                    </Grid>
                    <Grid container item xs={12} style={{ width: '100%', margin: '2px 0' }}>
                      <Grid item xs={4} style={{ width: '100%' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            borderRight: '1.5px solid white',
                            height: '100%',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            margin: '5px auto 0 auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>Total</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4} style={{ width: '100%' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            borderRight: '1.5px solid white',
                            height: '100%',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            margin: '5px auto 0 auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>In</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4} style={{ width: '100%' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            height: '100%',
                            alignItems: 'flex-end',
                            marginBottom: '5px',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>Out</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>SMS/Text</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Emails</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>PTP</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Arrangements</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Accounts</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        height: '100%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        margin: '5px auto 0 auto'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Current Accounts</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>

              {Data?.map((item: any, index: any) => {
                return (
                  <div key={index} style={{ borderBottom: '1.5px solid white' }}>
                    <Grid container spacing={0}>
                      <Grid item xs={2} style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
                          {item.name && item.name != '' ? item.name : `Agent ${index}`}
                        </Typography>
                      </Grid>

                      <Grid
                        container
                        item
                        xs={3}
                        style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}
                      >
                        <Grid item xs={4} style={{ width: '100%' }}>
                          <Box
                            sx={{
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '5px auto'
                            }}
                          >
                            <Typography sx={{ fontWeight: 500 }}> {item?.totalCalls || 0} </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4} style={{ width: '100%' }}>
                          <Box
                            sx={{
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '5px auto'
                            }}
                          >
                            <Typography sx={{ fontWeight: 500 }}> {item?.totalCallsIn || 0} </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4} style={{ width: '100%' }}>
                          <Box
                            sx={{
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '5px auto'
                            }}
                          >
                            <Typography sx={{ fontWeight: 500 }}> {item?.totalCallsOut || 0} </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item xs style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}> {item?.smsTotal || 0} </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>{item?.emailTotal || 0}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>{item?.ptpAccount || 0}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>{item?.arrangment || 0}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs style={{ width: '100%', borderRight: '1.5px solid white', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>{item?.totalUser || 0}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs style={{ width: '100%', margin: '0 4px' }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px auto'
                          }}
                        >
                          <Typography sx={{ fontWeight: 500 }}>{item?.currentAccount || 0} %</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                )
              })}
            </Box>
            <Grid
              container
              spacing={isMobile ? 6 : 3}
              mt={5}
              sx={{
                maxHeight: '50vh',
                marginTop: '5px'
              }}
            >
              <Grid item xs={0.5} padding={0}></Grid>
              <Grid container item xs={12} lg={4} padding={0} spacing={isMobile ? 6 : 3}>
                <Grid container item xs={12} padding={0} spacing={isMobile ? 6 : 3}>
                  <Grid item xs={12} md={6} padding={0}>
                    <ReactApexcharts
                      type='radialBar'
                      height={isMobile ? 220 : 250}
                      options={options[1]}
                      series={[progressDataPercentage?.starting]}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} padding={0}>
                    <ReactApexcharts
                      type='radialBar'
                      height={isMobile ? 220 : 250}
                      options={options[0]}
                      series={[progressDataPercentage?.currentAccount]}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} padding={0}>
                  <Card
                    sx={{
                      height: 'fit-content',
                      minHeight: '50px',
                      background: '#2f3349',
                      margin: 0,
                      padding: '5px !important'
                    }}
                  >
                    <CardContent
                      sx={{
                        '& .MuiTabPanel-root': { p: 0 },
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: '50px',
                        padding: '0 10px !important',
                        marginTop: '0'
                      }}
                    >
                      <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                        <Box
                          mt={2}
                          sx={{
                            display: 'flex',
                            flex: 0.4,
                            textAlign: 'left',
                            justifyContent: 'space-between',
                            padding: '0 !important'
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontSize: islgScreen ? '1.3rem' : '1rem',
                              textAlign: 'right'
                            }}
                          >
                            PTP
                          </Typography>
                          <CustomAvatar
                            color='primary'
                            variant='rounded'
                            sx={{
                              mr: 2,
                              minWidth: 48,
                              width: 'fit-content',
                              padding: '2px 4px',
                              height: 30,
                              fontSize: islgScreen ? '1rem' : '0.87rem',
                              color: 'common.white',
                              backgroundColor: 'primary.dark'
                            }}
                          >
                            {extraData?.ptp || 0}
                          </CustomAvatar>
                        </Box>
                        <Box
                          mt={2}
                          sx={{
                            display: 'flex',
                            flex: 0.4,
                            textAlign: 'left',
                            justifyContent: 'space-between',
                            padding: '0 !important'
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontSize: islgScreen ? '1.3rem' : '1rem',
                              textAlign: 'right',
                              marginRight: '5px'
                            }}
                          >
                            Arrangements
                          </Typography>
                          <CustomAvatar
                            color='primary'
                            variant='rounded'
                            sx={{
                              mr: 2,
                              minWidth: 48,
                              width: 'fit-content',
                              padding: '2px 4px',
                              height: 30,
                              fontSize: islgScreen ? '1rem' : '0.87rem',
                              color: 'common.white',
                              backgroundColor: 'primary.dark'
                            }}
                          >
                            {extraData?.totalArrangment}
                          </CustomAvatar>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid item xs={1} padding={0}></Grid>
              <Grid container item xs={12} lg={3} spacing={isMobile ? 6 : 3} padding={0}>
                <Grid item xs={12} lg={12} padding={0}>
                  <Card sx={{ height: '100%', minHeight: '50px', background: '#2f3349', margin: 0 }}>
                    <CardHeader sx={{ textAlign: 'center', padding: '5px !important' }} title={'Totals'} />
                    <CardContent
                      sx={{
                        '& .MuiTabPanel-root': { p: 0 },
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: '50px'
                      }}
                    >
                      {details?.map((data: any, index: number) => {
                        return (
                          <Box
                            key={index}
                            mt={2}
                            sx={{ display: 'flex', textAlign: 'left', justifyContent: 'space-between' }}
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
                                minWidth: 48,
                                width: 'fit-content',
                                padding: '2px 4px',
                                height: 30,
                                fontSize: islgScreen ? '1rem' : '0.87rem',
                                color: 'common.white',
                                backgroundColor: 'primary.dark'
                              }}
                            >
                              {data?.value || 0}
                            </CustomAvatar>
                          </Box>
                        )
                      })}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container item xs={12} lg={3} padding={0} spacing={isMobile ? 6 : 3}>
                <Grid item xs={12} lg={12} padding={0}>
                  <Card sx={{ height: '100%', background: '#2f3349', margin: 0 }}>
                    <CardHeader sx={{ textAlign: 'center', padding: '5px !important' }} title={'Stats'} />
                    <CardContent
                      sx={{
                        '& .MuiTabPanel-root': { p: 0 },
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: '50px'
                      }}
                    >
                      {statsDetails?.map((data: any, index: number) => {
                        return (
                          <Box
                            key={index}
                            mt={2}
                            sx={{ display: 'flex', textAlign: 'left', justifyContent: 'space-between' }}
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
                                minWidth: 48,
                                width: 'fit-content',
                                padding: '2px 4px',
                                height: 30,
                                fontSize: islgScreen ? '1rem' : '0.87rem',
                                color: 'common.white',
                                backgroundColor: 'primary.dark'
                              }}
                            >
                              {data?.value || 0}
                            </CustomAvatar>
                          </Box>
                        )
                      })}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default DailyAgentOverview
