import { Autocomplete, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import AutocompleteAgentList from './AutocompleteAgentList'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { getAllFlagsByadminId } from 'src/store/finance/customers'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'

type FilterType = {
  autoPayStatus: string
  flags: string[]
  ptp: string[]
  dnd: string
  ticket: string
  accountStatus: string
}

const CallFilterApply = ({ expanded, filters, setFilters }: { expanded: boolean; filters: any; setFilters: any }) => {
  const [customFilter, setCustomFilter] = useState<FilterType>({
    autoPayStatus: '',
    flags: [],
    ptp: [],
    dnd: '',
    ticket: '',
    accountStatus: ''
  })
  const [inputValue, setInputValue] = React.useState('');
  const FlagsList = useSelector((state: any) => state.customers.flags)
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()

  useEffect(() => {
    const id = user?.roles?.id === 3 ? user?.createdBy?._id : user?._id
    const fetchData = async () => {
      await dispatch(getAllFlagsByadminId(id))
    }
    fetchData()
  }, [dispatch])

  return (
    <>
      <Grid container spacing={2} mt={5} sx={{ alignItems: 'center' }}>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel id='autoPayStatus' size='small'>
              Auxdrive Auto pay status
            </InputLabel>
            <Select
              id='autoPayStatus'
              label='Auxdrive Auto pay status'
              labelId='autoPayStatus'
              value={customFilter?.autoPayStatus}
              onChange={e => setCustomFilter({ ...customFilter, autoPayStatus: e.target.value })}
              inputProps={{ placeholder: 'Select Status' }}
              size='small'
            >
              <MenuItem
                value=''
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                <em>None</em>
              </MenuItem>
              <MenuItem
                value='on'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                On
              </MenuItem>
              <MenuItem
                value='off'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                OFF
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <Autocomplete
            value={customFilter?.flags}
            onChange={(event: any, newValue: string[] | null) => {
              setCustomFilter({ ...customFilter, flags: newValue as string[] })
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            multiple
            id="tags-standard"
            options={FlagsList}
            getOptionLabel={(option: any) => option.Flag}
            defaultValue={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                // variant="standard"
                size='small'
                label="Select Flags"
                placeholder="Flags"
              />
            )}
          />
          {/* <FormControl fullWidth sx={{ minWidth: 200 , maxWidth: 400}}>
            <InputLabel id='flags' size='small'>
              Flags
            </InputLabel>
            <Select
              id='flags'
              label='Flags'
              labelId='flags'
              value={customFilter?.flags}
          
              inputProps={{ placeholder: 'Select Status' }}
              size='small'
              multiple
            >
              {FlagsList?.map((Flag: any, index: number) => {
                return (
                  <MenuItem
                    key={index}
                    value={Flag?.Flag_ID}
                    sx={{
                      mx: 1,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize'
                    }}
                  >
                    {Flag?.Flag}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl> */}
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel id='dnd' size='small'>
              DND
            </InputLabel>
            <Select
              id='dnd'
              label='DND'
              labelId='dnd'
              value={customFilter?.dnd}
              onChange={e => setCustomFilter({ ...customFilter, dnd: e.target.value })}
              inputProps={{ placeholder: 'Select Status' }}
              size='small'
            >

              <MenuItem
                value=''
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                <em>None</em>
              </MenuItem>
              <MenuItem
                value='on'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                ON
              </MenuItem>
              <MenuItem
                value='off'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                OFF
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel id='accountStatus' size='small'>
              Account Status
            </InputLabel>
            <Select
              id='accountStatus'
              label='Account Status'
              labelId='accountStatus'
              value={customFilter?.accountStatus}
              onChange={e => setCustomFilter({ ...customFilter, accountStatus: e.target.value })}
              inputProps={{ placeholder: 'Select Status' }}
              size='small'
            >
              <MenuItem
                value=''
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                <em>None</em>
              </MenuItem>
              <MenuItem
                value='Past Due'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                Past Due
              </MenuItem>
              <MenuItem
                value='Current'
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize'
                }}
              >
                Current
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel id='ptp' size='small'>
              PTP
            </InputLabel>
            <Select
              id='ptp'
              label='PTP'
              labelId='ptp'
              value={customFilter?.ptp}
              onChange={e => setCustomFilter({ ...customFilter, ptp: e.target.value as string[] })}
              inputProps={{ placeholder: 'Select Status' }}
              size='small'
              multiple
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='Broken'>Broken</MenuItem>
              <MenuItem value='Kept'>Kept</MenuItem>
              <MenuItem value='Open'>Open</MenuItem>
              <MenuItem value='Blank'>Blank</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Button
            size='medium'
            variant='contained'
            onClick={() => setFilters(customFilter)}
            sx={{ minWidth: 100, marginY: 2 }}
          >
            Apply Filter
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default CallFilterApply
