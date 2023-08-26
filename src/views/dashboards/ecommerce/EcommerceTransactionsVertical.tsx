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

interface DataType {
  title: string
  amount: number
  transcationCount: number
  subtitle: string
  avatarIcon: string
  avatarColor: ThemeColor
  amountDiff?: 'positive' | 'negative'
}

type Props = {
  title?: string
  subheader?: string
  data?: DataType[]
}
const EcommerceTransactionsVertical = ({ title, subheader, data }: Props) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title || 'Transactions'}
        subheader={subheader || 'Total 58 transaction done in month'}
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={
          <OptionsMenu
            options={['Refresh', 'Show all entries', 'Make payment']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        {data?.map((item: DataType, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== data?.length - 1 ? 3.75 : undefined
              }}
            >
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.avatarIcon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontWeight: 500 }}> {`${item.title} (${item.transcationCount})`}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, color: item.amountDiff === 'negative' ? 'error.main' : 'success.main' }}
                >
                  {`${item.amountDiff === 'negative' ? '-' : '+'} $${item.amount || 0}`}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default EcommerceTransactionsVertical
