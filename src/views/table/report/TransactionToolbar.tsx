// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, FormControl, Grid, InputLabel, Stack, Select, MenuItem } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePickersRange from '../../form/DatePickersRange'
import FileFilterExport from 'src/views/files/FileFilterExport'

interface Props {
  onChange: (val: any) => void
  exportType: string
  onExportType: (type: string) => void
  resetExportType: any
  exportData: any
}

const TransactionToolbar = ({ onChange, exportType, onExportType, resetExportType, exportData }: Props) => {
  const [searchValue, setSearchValue] = useState<string | null>('')
  const [filters, setFilters] = useState<any>({
    PaymentDate: '',
    DateFrom: '',
    DateTo: '',
    status: '',
    forGiftCard: '',
    suggestedMode: '',
    requestOrigin: '',
    idmsPayment: '',
    convenienceFeeActive: ''
  })

  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpand = () => {
    if (expanded) {
      setFilters({
        PaymentDate: '',
        DateFrom: '',
        DateTo: '',
        status: '',
        forGiftCard: '',
        suggestedMode: '',
        requestOrigin: '',
        convenienceFeeActive: '',
        idmsPayment: ''
      })
    }
    setExpanded(!expanded)
  }

  useEffect(() => {
    onChange({ SearchTerm: searchValue, ...filters })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, filters])

  return (
    <>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: theme => theme.spacing(2, 5, 4, 5)
        }}
      >
        <TextField
          size='small'
          value={searchValue}
          onChange={event => setSearchValue(event.target.value)}
          placeholder='Search…'
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon icon='tabler:search' fontSize={20} />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setSearchValue('')}>
                <Icon icon='tabler:x' fontSize={20} />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            }
          }}
        />
        <Grid
          item
          xs={12}
          sm={7}
          sx={{ display: 'flex', justifyContent: { sm: 'right', xs: 'flex-start' }, mt: { xs: 5, sm: 0 } }}
        >
          <Button variant='text' onClick={toggleExpand}>
            {expanded ? 'Less' : 'More Filters'}
          </Button>
          <Box maxWidth={150} display={'inline'} justifyContent={'right'}>
            <FileFilterExport
              filterType={exportType}
              onFilterType={onExportType}
              optionsType={['csv']}
              onReset={resetExportType}
              dataFiltered={exportData}
            />
          </Box>
        </Grid>
        {expanded && (
          <Grid container spacing={2} mt={5}>
            <Grid container xs={12}>
              <Grid item xs={12} md={3} sm={6} mt={3}>
                <DatePickerWrapper sx={{ mr: 2 }}>
                  <DatePickersRange
                    onChange={dates =>
                      setFilters({ ...filters, PaymentDate: true, DateFrom: dates[0], DateTo: dates[1] })
                    }
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={3}>
                <FormControl fullWidth>
                  <InputLabel id='status' size='small'>
                    Status
                  </InputLabel>
                  <Select
                    id='status'
                    label='Status'
                    labelId='Status'
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value as string })}
                    size='small'
                    sx={{ mr: 2 }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='0'>Pending</MenuItem>
                    <MenuItem value='1'>Approved</MenuItem>
                    <MenuItem value='2'>Failed</MenuItem>
                    <MenuItem value='3'>Captured</MenuItem>
                    <MenuItem value='4'>Settled</MenuItem>
                    <MenuItem value='5'>Partially Returned</MenuItem>
                    <MenuItem value='6'>Submitted</MenuItem>
                    <MenuItem value='INITIATED'>Initiated</MenuItem>
                    <MenuItem value='9'>Declined</MenuItem>
                    <MenuItem value='10'>Fully Returned</MenuItem>
                    <MenuItem value='11'>Paidout</MenuItem>
                    <MenuItem value='12'>Returned</MenuItem>
                    <MenuItem value='13'>ChargeBack</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={3}>
                <FormControl fullWidth>
                  <InputLabel id='suggestedMode' size='small'>
                    Payment Mode
                  </InputLabel>
                  <Select
                    id='suggestedMode'
                    label='Payment Mode'
                    labelId='suggestedMode'
                    value={filters.suggestedMode}
                    onChange={e => setFilters({ ...filters, suggestedMode: e.target.value as string })}
                    size='small'
                    sx={{ mr: 2 }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='Cash'>Cash</MenuItem>
                    <MenuItem value='Card'>Card</MenuItem>
                    <MenuItem value='ACH'>ACH</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={3}>
                <FormControl fullWidth>
                  <InputLabel id='idmsPayment' size='small'>
                    Idms Payment
                  </InputLabel>
                  <Select
                    id='idmsPayment'
                    label='Idms Payment'
                    labelId='idmsPayment'
                    value={filters.idmsPayment}
                    onChange={e => setFilters({ ...filters, idmsPayment: e.target.value as string })}
                    size='small'
                    sx={{ mr: 2 }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='true'>Yes</MenuItem>
                    <MenuItem value='false'>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={3}>
                <FormControl fullWidth>
                  <InputLabel id='requestOrigin' size='small'>
                    Request Origin
                  </InputLabel>
                  <Select
                    id='requestOrigin'
                    label='Request Origin'
                    labelId='requestOrigin'
                    value={filters.requestOrigin}
                    onChange={e => setFilters({ ...filters, requestOrigin: e.target.value as string })}
                    size='small'
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='ao'>AO</MenuItem>
                    <MenuItem value='ao-recurring'>AO-RECURRING</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container xs={12} md={4} mt={5}>
              <Button
                sx={{ mr: '10px', width: '48%' }}
                variant={filters.forGiftCard ? 'contained' : 'outlined'}
                onClick={() => setFilters({ ...filters, forGiftCard: filters.forGiftCard ? '' : true })}
                size='medium'
              >
                For Gift Card
              </Button>
              <Button
                sx={{ width: 'calc(50% - 10px)' }}
                variant={filters.convenienceFeeActive ? 'contained' : 'outlined'}
                onClick={() =>
                  setFilters({ ...filters, convenienceFeeActive: filters.convenienceFeeActive ? '' : true })
                }
                size='medium'
              >
                Convinience Fee
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  )
}

export default TransactionToolbar
