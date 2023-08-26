import { SyntheticEvent, useState } from 'react'
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Store Imports
import { useSelector } from 'react-redux'

// ** Types Imports
import CustomerTranscationListTable from '../CustomerTranscationListTable'
import { Typography } from '@mui/material'
import { fDate } from 'src/utils/formatTime'
import { fCurrency } from 'src/utils/formatNumber'
// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import { Accordion, AccordionSummary, AccordionDetails } from './CustomComponent'
import IconifyIcon from 'src/@core/components/icon'
import moment, { Moment } from 'moment'

type Props = {
  transcations: [
    {
      _id: string
      id: string
      authCode: string
      name: string | null
      avatar: string | null
      type: string
      description: string
      paymentMethod: string
      category: string
      createdAt: number
      status: string
      amount: number
      baseAmount: number
    }
  ]
  autoPaydetails: {
    Amount: number
    PaymentDate: string
  }
}

const statusColors: ThemeColor[] = ['error', 'success']

const PaymentTabs = ({ transcations, autoPaydetails }: Props) => {
  // ** Props
  const imports = useSelector((state: any) => state.customers?.selectedCustomer)
  const dateOnly = new Date(autoPaydetails?.PaymentDate).getDate() || ''
  const [expanded, setExpanded] = useState<any>({ panel1: true, panel2: true })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded((prevState: any) => ({
      ...prevState,
      [panel]: !prevState[panel]
    }))
  }
  const expandIcon = (value: string) => <IconifyIcon icon={expanded[value] ? 'tabler:minus' : 'tabler:plus'} />


  const formatAutopayDate = () => {
    const dateOnly = new Date(autoPaydetails?.PaymentDate);
    let formatDate = moment.utc(dateOnly);
    const today = moment().utc()
    if (formatDate.isAfter(today)) {
      return `${formatDate.format('MMMM, DD, YYYY')}`
    }
    formatDate = formatDate.add(1, 'months');
    
    return `${formatDate.format('MMMM, DD, YYYY')}`
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Accordion expanded={expanded['panel1']} onChange={handleChange('panel1')}>
          <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel1')}>
            <IconifyIcon fontSize='1.25rem' icon='tabler:percentage' />
            <Typography ml={2}>Payment Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Current Due Amount</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {fCurrency(imports?.data?.curDueAmt || 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Current Due Date</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {moment.utc(imports?.data?.currentDueDate).format('MM-DD-YYYY') || ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Next Due Amount</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {fCurrency(imports?.data?.nextDueAmount || 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Next Due Date</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {moment.utc(imports?.data?.nextDueDate).format('MM-DD-YYYY') || ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>IDMS AutoPay</Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={imports?.data?.autoPay}
                  color={statusColors[imports?.data?.autoPay === 'TRUE' ? 1 : 0]}
                  sx={{
                    textTransform: 'capitalize',
                    fontSize: 18
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>AuXDRIVE AutoPay</Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={imports?.data?.autoPaydetails?.PaymentDate ? 'TRUE' : 'FALSE'}
                  color={statusColors[imports?.data?.autoPaydetails?.PaymentDate ? 1 : 0]}
                  sx={{
                    textTransform: 'capitalize',
                    fontSize: 18
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Promise Due Date</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {moment.utc(imports?.data?.promiseDueDate).format('MM-DD-YYYY') || ''}
                </Typography>
              </Grid>
              {imports?.data?.autoPaydetails?.PaymentDate && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>AutoPay Date</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>{formatAutopayDate()}</Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 12 }}>Current Total Balance</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                  {fCurrency(imports?.data?.acctCurTotalBalance || 0)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded['panel2']} onChange={handleChange('panel2')}>
          <AccordionSummary id='panel-header-1' aria-controls='panel-content-1' expandIcon={expandIcon('panel2')}>
            <IconifyIcon fontSize='1.25rem' icon='tabler:list' />
            <Typography ml={2}>Transaction List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CustomerTranscationListTable transcations={transcations || []} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  )
}

export default PaymentTabs
