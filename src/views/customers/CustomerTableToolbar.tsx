import { useState } from 'react'
import { Box, Button, TextField, Grid, styled, ButtonProps } from '@mui/material'
import { ReactDatePickerProps } from 'react-datepicker'
import { useTheme } from '@mui/material/styles'
import PickersRange from '../form/form-element/PickersRange'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ConfirmDialog from '../confirm-dialog/ConfirmDialog'

type Props = {
  isFiltered: boolean
  isPtpOpen: boolean
  onResetFilter: VoidFunction
  pickerCalendar: any
  isCurrentDue?: any
  handleCurrentDue?: VoidFunction
  isNextDue: boolean
  handleNextDue: VoidFunction
  handlePtpOpen: VoidFunction
  isRTC: boolean
  isAutoPay: any
  isNotePad: any
  handleRTC: VoidFunction
  handleInternalNotes: VoidFunction
  handleAutoPay: (type: string[]) => void
  minPastDues: string
  maxPastDues: string
  handleMinPastDue: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMaxPastDue: (event: React.ChangeEvent<HTMLInputElement>) => void
  applyPastDue: (type: boolean) => void
  options_Flags: any
}

export default function CustomerTableToolbar({
  isPtpOpen,
  pickerCalendar,
  isCurrentDue,
  handleCurrentDue,
  isRTC,
  isNotePad,
  isNextDue,
  handleNextDue,
  handleRTC,
  minPastDues,
  maxPastDues,
  handleMinPastDue,
  handleMaxPastDue,
  handleInternalNotes,
  applyPastDue,
  options_Flags,
  handlePtpOpen
}: Props) {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [openConfirm, setOpenConfirm] = useState(false)

  const FilterButton = styled(Button)<ButtonProps>(() => ({
    minWidth: 100,
    width: '100%',
    marginY: 2,
    padding: '6px 0px'
  }))

  const handleOpenConfirm = () => {
    setOpenConfirm(true)
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={9} lg={2}>
        <DatePickerWrapper sx={{ marginY: 2, width: '100%' }}>
          <PickersRange
            popperPlacement={popperPlacement}
            title='Select Date'
            startDate={pickerCalendar.startDate}
            endDate={pickerCalendar.endDate}
            onChangeStartDate={pickerCalendar.onChangeStartDate}
            onChangeEndDate={pickerCalendar.onChangeEndDate}
            open={pickerCalendar.open}
            onClose={pickerCalendar.onClose}
            isSelected={pickerCalendar.isSelected}
            isError={pickerCalendar.isError}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={1.4} sx={{textAlign: 'center'}}>
        {options_Flags?.rtcFlag && (
          <FilterButton
            size='medium'
            variant={isRTC ? 'outlined' : 'contained'}
            onClick={handleRTC}
            sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
          >
            RTC
          </FilterButton>
        )}
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={1.7} sx={{textAlign: 'center'}}>
        {options_Flags?.ptpOpenFlag && (
          <FilterButton
            sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
            variant={isPtpOpen ? 'outlined' : 'contained'}
            size='medium'
            onClick={handlePtpOpen}
          >
            PTP
          </FilterButton>
        )}
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={1.6} sx={{textAlign: 'center'}}>
        {options_Flags?.pastDueFlag && (
          <FilterButton
            sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
            variant='contained'
            size='medium'
            startIcon={minPastDues !== '' && maxPastDues !== '' ? `${minPastDues} - ${maxPastDues}` : ''}
            onClick={() => {
              applyPastDue(false)
              handleOpenConfirm()
            }}
          >
            Past Due
          </FilterButton>
        )}
      </Grid>
      <Grid item xs={6} sm={3} md={3} lg={1.8} sx={{textAlign: 'center'}}>
        {options_Flags?.currentDueFlag && (
          <FilterButton
            sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
            variant={isCurrentDue ? 'outlined' : 'contained'}
            size='medium'
            onClick={handleCurrentDue}
          >
            Current Due
          </FilterButton>
        )}
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={1.7} sx={{textAlign: 'center'}}>
        {options_Flags?.nextDueFlag && (
          <FilterButton
            sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
            variant={isNextDue ? 'outlined' : 'contained'}
            onClick={handleNextDue}
          >
            Next Due
          </FilterButton>
        )}
      </Grid>
      <Grid item xs={6} sm={3} md={3} lg={1.8} sx={{textAlign: 'center'}}>
        <FilterButton
          sx={{ minWidth: 100, width: '100%', marginY: 2, padding: '6px 0px' }}
          variant={isNotePad ? 'outlined' : 'contained'}
          size='medium'
          onClick={handleInternalNotes}
        >
          Note Pad
        </FilterButton>
      </Grid>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title='Days Past Due'
        content={
          <Box
            rowGap={1}
            columnGap={2}
            display='grid'
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }}
          >
            <TextField label='Min' size='small' value={minPastDues} onChange={handleMinPastDue} />

            <TextField label='Max' size='small' value={maxPastDues} onChange={handleMaxPastDue} />
          </Box>
        }
        action={
          <Button
            variant='contained'
            color='primary'
            size='medium'
            onClick={() => {
              applyPastDue(true)
              handleCloseConfirm()
            }}
          >
            Apply
          </Button>
        }
      />
    </Grid>
  )
}
