// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

const data: DataType[] = [
  {
    stats: '730',
    title: 'Customers',
    color: 'primary',
    icon: 'tabler:chart-pie-2'
  },
  {
    color: 'info',
    stats: '386',
    title: '31 Queue',
    icon: 'tabler:users'
  },
  {
    color: 'error',
    stats: '1423',
    title: 'Insurances',
    icon: 'tabler:users'
  },
  {
    stats: '97',
    color: 'success',
    title: 'Arrangements',
    icon: 'tabler:users'
  },
  {
    stats: '80',
    color: 'warning',
    title: 'Repo',
    icon: 'tabler:users'
  }
]

const renderStats = () => {
  return data.map((sale: DataType, index: number) => (
    <Grid item xs={6} md={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' color={sale.color} sx={{ mr: 3, width: 42, height: 42 }}>
          <Icon icon={sale.icon} />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6'>{sale.stats}</Typography>
          <Typography variant='body2'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceTransactionsHorizontal = () => {
  return (
    <Card>
      <CardHeader title='Statistics' sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }} />
      <CardContent sx={{ pt: theme => `${theme.spacing(0)} !important` }}>
        <Grid container spacing={3}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceTransactionsHorizontal
