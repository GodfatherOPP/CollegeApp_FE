import { useCallback, useEffect, useState } from 'react'
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
import { getWeeklyAgentOverview } from 'src/store/dashboard'
import { useSelector } from 'react-redux'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type ApexChartSeries = NonNullable<ApexOptions['series']>

type Props = {
  title?: string
  subTitle?: string
  agents?: any
}
const AgentReportsTabsWeekly = ({ title, subTitle, }: Props) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [Data, setData] = useState<any>([])
  const [showChart, setShowChart] = useState<any>(false)
  const [progressDataPercentage, setProgressDataPercentage] = useState({
    currentAccount: 0,
    firstPastDueAccount: 0,
    secondPastDueAccount: 0,
    thirstPastDueAccount: 0,
    starting: 0,
  })
  const [progressData, setProgressData] = useState({
    firstPastDueAccount: 0,
    secondPastDueAccount: 0,
    thirstPastDueAccount: 0,
    starting: 0,
  })
  const [details, setDetails] = useState<any>([
    { label: "Total Calls", value: 0 },
    { label: "Inbound", value: 0 },
    { label: "Outbound", value: 0 },
    { label: "PTP", value: 0 },
    { label: "Total Past Due", value: 0 }])
  const weeklyAgentOverview = useSelector((state: any) => state.dashboard.weeklyAgentOverview)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const islgScreen = useMediaQuery(theme.breakpoints.up('xl'))

  const [options, setOptions] = useState<ApexOptions[]>([
    {
      chart: {
        sparkline: { enabled: true }
      },
      labels: [`1 - 15\n ( ${progressData?.firstPastDueAccount || 0} )`],
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
              fontSize: '18px',
              color: "#fff",
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              // fontWeight: 200,
              fontSize: '26px',
              formatter: value => `${value}%`,
              color: "#fff",
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
      labels: [`16 - 30 ( ${progressData?.secondPastDueAccount || 0} )`],
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
              fontSize: '18px',
              color: "#fff",
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              // fontWeight: 200,
              fontSize: '26px',
              formatter: value => `${value}%`,
              color: "#fff",
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
      labels: [`31+ ( ${progressData?.thirstPastDueAccount || 0} )`],
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
              fontSize: '18px',
              color: "#fff",
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              // fontWeight: 200,
              fontSize: '26px',
              formatter: value => `${value}%`,
              color: "#fff",
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
              fontSize: '12px',
              color: "#fff",
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              // fontWeight: 200,
              fontSize: '26px',
              formatter: value => `${value}%`,
              color: "#fff",
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
              color: "#fff",
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: 15,
              fontWeight: 400,
              fontSize: '32px',
              formatter: value => `${value}%`,
              color: "#fff",
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
  ])

  useEffect(() => {
    dispatch(getWeeklyAgentOverview())
  }, [])

  useEffect(() => {
    setDashboardData()
  }, [weeklyAgentOverview])

  const setDashboardData = () => {
    setShowChart(false);
    
    setDetails([
      { label: "Total Calls", value: weeklyAgentOverview?.routeData?.totalAgentCalls || 0 },
      { label: "Inbound", value: weeklyAgentOverview?.routeData?.totalinBoundCalls || 0 },
      { label: "Outbound", value: weeklyAgentOverview?.routeData?.totalOutboundCalls || 0 },
      { label: "PTP", value: weeklyAgentOverview?.routeData?.totalPtp || 0 },
      { label: "Total Past Due", value: weeklyAgentOverview?.routeData?.totalPastDueAccount || 0 }
    ])

    const tempCurrAcc = ((weeklyAgentOverview?.routeData?.currentAccount / weeklyAgentOverview?.routeData?.totalIdmsCustomer) * 100).toFixed()
    const tempfirstPastDueAccount = ((weeklyAgentOverview?.routeData?.firstPastDueAccount / weeklyAgentOverview?.routeData?.totalIdmsCustomer) * 100).toFixed()
    const tempsecondPastDueAccount = ((weeklyAgentOverview?.routeData?.secondPastDueAccount / weeklyAgentOverview?.routeData?.totalIdmsCustomer) * 100).toFixed()
    const tempthirstPastDueAccount = ((weeklyAgentOverview?.routeData?.thirstPastDueAccount / weeklyAgentOverview?.routeData?.totalIdmsCustomer) * 100).toFixed()
    const tempstarting = ((weeklyAgentOverview?.routeData?.mondayCurrentAccount / weeklyAgentOverview?.routeData?.totalIdmsCustomer) * 100).toFixed();

    setProgressDataPercentage({
      currentAccount: parseInt(parseFloat(tempCurrAcc.toString()).toFixed()) || 0,
      firstPastDueAccount: parseInt(parseFloat(tempfirstPastDueAccount.toString()).toFixed()) || 0,
      secondPastDueAccount: parseInt(parseFloat(tempsecondPastDueAccount.toString()).toFixed()) || 0,
      thirstPastDueAccount: parseInt(parseFloat(tempthirstPastDueAccount.toString()).toFixed()) || 0,
      starting: parseInt(parseFloat(tempstarting.toString()).toFixed()) || 0,
    })

    setProgressData({
      firstPastDueAccount: weeklyAgentOverview?.routeData?.firstPastDueAccount || 0,
      secondPastDueAccount: weeklyAgentOverview?.routeData?.secondPastDueAccount || 0,
      thirstPastDueAccount: weeklyAgentOverview?.routeData?.thirstPastDueAccount || 0,
      starting: weeklyAgentOverview?.routeData?.mondayCurrentAccount || 0,
    });

    setOptions([
      {
        chart: {
          sparkline: { enabled: true }
        },
        labels: [`1 - 15\n ( ${weeklyAgentOverview?.routeData?.firstPastDueAccount || 0} )`],
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
                fontSize: '18px',
                color: "#fff",
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                // fontWeight: 200,
                fontSize: '26px',
                formatter: value => `${value}%`,
                color: "#fff",
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
        labels: [`16 - 30 ( ${weeklyAgentOverview?.routeData?.secondPastDueAccount|| 0} )`],
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
                fontSize: '18px',
                color: "#fff",
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                // fontWeight: 200,
                fontSize: '26px',
                formatter: value => `${value}%`,
                color: "#fff",
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
        labels: [`31+ ( ${weeklyAgentOverview?.routeData?.thirstPastDueAccount|| 0} )`],
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
                fontSize: '18px',
                color: "#fff",
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                // fontWeight: 200,
                fontSize: '26px',
                formatter: value => `${value}%`,
                color: "#fff",
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
        labels: [`Starting ( ${weeklyAgentOverview?.routeData?.mondayCurrentAccount|| 0} )`],
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
                fontSize: '14px',
                color: "#fff",
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                // fontWeight: 200,
                fontSize: '26px',
                formatter: value => `${value}%`,
                color: "#fff",
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
        labels: [`Current Account`, weeklyAgentOverview?.routeData?.currentAccount|| 0],
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
                color: "#fff",
                fontFamily: theme.typography.fontFamily
              },
              value: {
                offsetY: 15,
                fontWeight: 400,
                fontSize: '32px',
                formatter: value => {
                  return `${value}%`;
                },
                color: "#fff",
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
    ])

    setShowChart(true);
  
  };

  useEffect(() => {
    const filterData = weeklyAgentOverview?.data?.
      map((item: any) => {
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
  }, [weeklyAgentOverview])

  return (
    <Card sx={{ height: '100%', minHeight: '80vh', color: 'common.white', background: '#2f3349', boxShadow: 'none', margin: 0 }}>
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
        <Box
          sx={{
            minWidth: '800px',
          }}
        >
          <div>
            <Grid container spacing={0} style={{ borderBottom: '1.5px solid white' }}>
              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={0}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}></Typography>
                </Box>
              </Grid>
              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={1}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Total Calls</Typography>
                </Box>
              </Grid>

              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={2}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Inbound</Typography>
                </Box>
              </Grid>

              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={3}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Outbound</Typography>
                </Box>
              </Grid>

              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={5}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>PTP</Typography>
                </Box>
              </Grid>

              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={4}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Account</Typography>
                </Box>
              </Grid>

              <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={6}>
                <Box
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px auto' }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Current Account</Typography>
                </Box>
              </Grid>
            </Grid>
          </div>

          {Data?.map((item: any, index: any) => {
            return (
              <div key={index} style={{ borderBottom: '1.5px solid white' }}>
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={0}
                  >
                    <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
                      {item.name && item.name != '' ? item.name : `Agent ${index}`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={1}
                  >
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '5px auto'
                      }}
                    >
                      {/* <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color='primary'
                        sx={{ mr: 2, width: 26, height: 26 }}
                      >
                        <Icon fontSize='1.125rem' icon={'tabler:chart-pie-2'} />
                      </CustomAvatar> */}
                      <Typography sx={{ fontWeight: 500 }}> {item?.totalCalls || 0} </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={2}
                  >
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '5px auto'
                      }}
                    >
                      {/* <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color='success'
                        sx={{ mr: 2, width: 26, height: 26 }}
                      >
                        <Icon fontSize='1.125rem' icon={'tabler:chart-pie-2'} />
                      </CustomAvatar> */}
                      <Typography sx={{ fontWeight: 500 }}>{item?.totalCallsIn || 0}</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={3}
                  >
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '5px auto'
                      }}
                    >
                      {/* <CustomAvatar skin='light' variant='rounded' color='error' sx={{ mr: 2, width: 26, height: 26 }}>
                        <Icon fontSize='1.125rem' icon={'tabler:chart-pie-2'} />
                      </CustomAvatar> */}
                      <Typography sx={{ fontWeight: 500 }}>{item?.totalCallsOut || 0}</Typography>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={5}
                  >
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '5px auto'
                      }}
                    >
                      {/* <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color='success'
                        sx={{ mr: 2, width: 26, height: 26 }}
                      >
                        <Icon fontSize='1.125rem' icon={'tabler:chart-pie-2'} />
                      </CustomAvatar> */}
                      <Typography sx={{ fontWeight: 500 }}>{item?.ptpAccount || 0}</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs
                    style={{ width: '100%', borderRight: '1.5px solid white', margin: '4px 4px' }}
                    key={4}
                  >
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

                  <Grid item xs style={{ width: '100%', margin: '4px 4px' }} key={6}>
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
        <Grid container spacing={isMobile ? 6 : 3} mt={5} sx={{
          maxHeight: '50vh',
        }}>
          <Grid container item xs={12} lg={10} spacing={isMobile ? 6 : 3}>
            {showChart && (
              <>
                <Grid item xs={12} sm={6} md={2.3}pt={2} mt={5}>
                  <ReactApexcharts
                    type='radialBar'
                    height={isMobile ? 200 : 220}
                    options={options[0]}
                    series={[progressDataPercentage?.firstPastDueAccount]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.2}pt={2} mt={5}>
                  <ReactApexcharts
                    type='radialBar'
                    height={isMobile ? 200 : 220}
                    options={options[1]}
                    series={[progressDataPercentage?.secondPastDueAccount]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.2} mt={5}>
                  <ReactApexcharts
                    type='radialBar'
                    height={isMobile ? 200 : 220}
                    options={options[2]}
                    series={[progressDataPercentage?.thirstPastDueAccount]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.2} pt={2} mt={5}>
                  <ReactApexcharts

                    type='radialBar'
                    height={isMobile ? 200 : 220}
                    options={options[3]}
                    series={[progressDataPercentage?.starting]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ReactApexcharts
                    type='radialBar'
                    height={isMobile ? 220 : 270}
                    options={options[4]}
                    series={[progressDataPercentage?.currentAccount]}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container item xs={12} lg={2} spacing={isMobile ? 6 : 3}>
            <Grid item key={1} xs={12} >
              {details?.map((data: any, index: number) => {
                return <Box key={index} mt={2} sx={{ display: 'flex', textAlign: "left", justifyContent: "space-between" }} >

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
                      width: 48,
                      height: 30,
                      fontSize: islgScreen ? '1rem' : '0.87rem',
                      color: 'common.white',
                      backgroundColor: 'primary.dark'
                    }}
                  >
                    {data?.value || 0}
                  </CustomAvatar>
                </Box>
              })}


            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AgentReportsTabsWeekly
