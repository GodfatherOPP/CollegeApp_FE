// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import { Button, Grid, IconButton, Stack } from '@mui/material'
import FileFilterExport from '../files/FileFilterExport'
import IconifyIcon from 'src/@core/components/icon'
import CustomFilter from 'src/views/customers/CustomFilter'

interface Props {
  selectAll: boolean
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  searchTerm: string
  onSearchTerm: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCustomFilter: (val: any) => void
  filters: any
  filterRoutes: string
  onFilterRoutes: (event: React.ChangeEvent<HTMLInputElement>) => void
  options_Routes: any[]
  filterType: string
  onFilterType: (type: string) => void
  resetFilterType: any
  exportData: any
  onResetFilter: any
}

const ServerSideToolbar = ({
  searchTerm,
  onSearchTerm,
  onCustomFilter,
  filters,
  filterType,
  onFilterType,
  resetFilterType,
  exportData,
  onResetFilter
}: Props) => {


  const [expanded, setExpanded] = useState<boolean>(false)

  const toggleExpand = () => {
    if (expanded) {
      onCustomFilter({ agent: '', callerid_number: '', destination: '', agentsName: '' })
    }
    setExpanded(!expanded)
  }

  useEffect(() => {
    onCustomFilter(filters)
  }, [filters])

  return (
    <Grid container spacing={1} sx={{ p: 5 }}>
      <Grid item xs={12} sm={5}>
        <Box sx={{ display: 'flex', flex: 0.5 }}>
          <TextField
            sx={{ flex: '1 1 auto' }}
            size='small'
            label='Search Customers'
            value={searchTerm}
            placeholder='Search Customers'
            onChange={onSearchTerm}
          />
          <IconButton
            aria-label='refresh'
            color='primary'
            onClick={() => {
              setExpanded(false)
              onResetFilter();
            }}>
            <IconifyIcon icon='eva:refresh-fill' />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} sx={{ display: 'flex', justifyContent: { sm: 'right', xs: 'flex-start' }, mt: { xs: 5, sm: 0 } }}>
        <Button variant='text' onClick={toggleExpand} sx={{ mr: 1 }}>
          {expanded ? 'Less' : 'More Filters'}
        </Button>
        <Box maxWidth={150} display={'inline'} justifyContent={'right'}>
          <FileFilterExport
            filterType={filterType}
            onFilterType={onFilterType}
            optionsType={['csv']}
            onReset={resetFilterType}
            dataFiltered={exportData}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        {expanded && <CustomFilter expanded={expanded} filters={filters} setFilters={onCustomFilter} />}
      </Grid>
    </Grid>
  )
}

export default ServerSideToolbar
