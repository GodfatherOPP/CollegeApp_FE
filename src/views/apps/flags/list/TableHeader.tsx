// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GridRowId } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  handleRefreshFlag: VoidFunction
  toggleAddEditFlagDrawer: VoidFunction
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, handleRefreshFlag, toggleAddEditFlagDrawer } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box width={'60%'}>
        <TextField
          size='small'
          value={value}
          fullWidth
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Flags '
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant='contained'
          sx={{ mb: 2, mr: 2 }}
          onClick={handleRefreshFlag}
          // startIcon={<Iconify icon="material-symbols:refresh" />}
        >
          Refresh Flags
        </Button>
        <Button
          sx={{ mb: 2 }}
          //  component={Link}
          variant='contained'
          //  href={PATH_DASHBOARD.flags.new}
          onClick={toggleAddEditFlagDrawer}
        >
          Create New Flag
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
