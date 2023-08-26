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

interface Props {
  onChange: (val: any) => void
}

const AutopayToolbar = ({ onChange }: Props) => {
  const [searchValue, setSearchValue] = useState<string | null>('')
  const [filters, setFilters] = useState<any>({
    PaymentDate: '',
    forGiftCard: '',
    suggestedMode: '',
    convenienceFeeActive: '',
    DateFrom: '',
    DateTo: ''
  })

  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpand = () => {
    if (expanded) {
      setFilters({ PaymentDate: '', forGiftCard: '', suggestedMode: '', convenienceFeeActive: '', DateFrom: '', DateTo: '' })
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
        <Stack direction='row' spacing='1'>
          <Button variant='text' onClick={toggleExpand}>
            {expanded ? 'Less' : 'More Filters'}
          </Button>
        </Stack>
        {expanded && (
          <Grid container spacing={2} mt={5}>
            <Grid item xs={12} md={4}>
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
                onClick={() => setFilters({ ...filters, convenienceFeeActive: filters.convenienceFeeActive ? '' : true })}
                size='medium'
              >
                Convinience Fee
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container>
                <Grid item xs={4}>
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
                <Grid item xs={4} pr={2}>
                  <DatePickerWrapper>
                    <DatePickersRange
                      onChange={dates => setFilters({ ...filters, PaymentDate: true, DateFrom: dates[0], DateTo: dates[1] })}
                    />
                  </DatePickerWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  )
}

export default AutopayToolbar
