/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Theme, useTheme } from '@mui/material/styles'

// ** Custom Components Import
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { Grid } from '@mui/material'
import { ThemeColor } from 'src/@core/layouts/types'
import { getDashboardCityData } from 'src/store/dashboard'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'

interface DataType {
  title: string
  avatarIcon: string
  avatarColor?: ThemeColor
  key: string
}

const data: DataType[] = [
  {
    title: 'Sales',
    avatarIcon: 'tabler:chart-pie-2',
    key: 'totalsales'
  },
  {
    title: 'Out For Repo',
    avatarColor: 'info',
    avatarIcon: 'tabler:chart-pie-2',
    key: 'outForRepo'
  },
  {
    title: 'Repo',
    avatarColor: 'secondary',
    avatarIcon: 'tabler:users',
    key: 'repoUser'
  },
  {
    title: 'Total Active',
    avatarColor: 'error',
    avatarIcon: 'tabler:user-dollar',
    key: 'activeUser'
  }
]

const renderTabs = (value: string, theme: Theme, tabData: string[]) => {
  return tabData.map((item, index) => {
    return (
      <Tab
        key={index}
        value={item}
        label={
          <Box
            sx={{
              minWidth: 150,
              width: 'fit-content',
              padding: '0px 5px',
              height: 55,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderStyle: item === value ? 'solid' : 'dashed',
              borderColor: item === value ? theme.palette.primary.main : theme.palette.divider
            }}
          >
            <Typography sx={{ fontWeight: 400, color: 'text.secondary', textTransform: 'capitalize' }}>
              {item.replace('Drive Fast -', '')}
            </Typography>
          </Box>
        }
      />
    )
  })
}

type Props = {
  tabData: string[]
  title?: string
}
const LocationReportsWithTabs = ({ tabData, title }: Props) => {
  const filter = ['Today', 'Weekly', 'LastWeek', 'LastMonth']
  const dispatch = useDispatch<AppDispatch>()
  const [city, setCity] = useState<string>('Drive Fast - Lees Summit')
  const [filterDate, setFilterDate] = useState<any>('Today')
  const cityData = useSelector((state: any) => state.dashboard.cityData)
  const theme = useTheme()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setCity(newValue)
  }

  useEffect(() => {
    if (city) {
      dispatch(getDashboardCityData(city, filterDate))
    }
  }, [city, filterDate])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title || ''}
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={
          <OptionsMenu
            options={['Today', 'This Week', 'Last Week', 'Last Month']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
            handleCustomClick={(i: number) => setFilterDate(filter[i])}
          />
        }
      />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
        {/* <TabContext value={city}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            sx={{
              border: '0 !important',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } }
            }}
          >
            {renderTabs(city, theme, tabData)}
          </TabList>

          <TabPanel value={city}>
            <Box sx={{ mt: 6, borderRadius: 1, p: theme.spacing(4, 5), border: `1px solid ${theme.palette.divider}` }}>
              <Grid container spacing={6}>
                {data.map((item: DataType, index: number) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color={item.avatarColor}
                        sx={{ mr: 2, width: 26, height: 26 }}
                      >
                        <Icon fontSize='1.125rem' icon={item.avatarIcon} />
                      </CustomAvatar>
                      <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                    </Box>
                    <Typography variant='h6' sx={{ mb: 2.5 }}>
                      {cityData[item.key]}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>
        </TabContext> */}
        {cityData.map((item: any, index: any) => (
          <div key={index}>
            <Box mt={4}>
              <Typography sx={{ fontWeight: 400, color: 'text.primary', textTransform: 'capitalize' }}>
                {item?.location?.replace('Drive Fast -', '')}
              </Typography>
            </Box>
            <Box sx={{ mt: 2, borderRadius: 1, p: theme.spacing(4, 5), border: `1px solid ${theme.palette.divider}` }}>
              <Grid container spacing={6}>
                {data.map((dataItem: DataType, i: number) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color={dataItem.avatarColor}
                        sx={{ mr: 2, width: 26, height: 26 }}
                      >
                        <Icon fontSize='1.125rem' icon={dataItem.avatarIcon} />
                      </CustomAvatar>
                      <Typography sx={{ fontWeight: 500 }}>{`${dataItem.title} (${
                        cityData[index][dataItem.key]
                      })`}</Typography>
                    </Box>
                    {/* <Typography variant='h6' sx={{ mb: 2.5 }}>
                        
                        </Typography> */}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default LocationReportsWithTabs
