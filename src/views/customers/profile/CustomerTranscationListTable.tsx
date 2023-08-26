// ** React Imports
import { useState } from 'react'
// ** MUI Imports
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

// ** Custom Component Imports
import moment from 'moment'
import { fCurrency } from 'src/utils/formatNumber'
import { ITranscationGeneral } from 'src/types/apps/transcation'
import CustomChip from 'src/@core/components/mui/chip'

interface Props {
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
}

const STATUS_OPTIONS: { [key: string]: string } = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Failed',
  '3': 'Captured',
  '4': 'Settled',
  '5': 'Returned',
  INITIATED: 'Initiated',
  '9': 'Declined'
}
const columns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'date',
    minWidth: 0,
    headerName: 'Date',
    renderCell: ({ row }: ITranscationGeneral) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
          {moment.utc(row.createdAt).format('MM-DD-YYYY')}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
          {moment(row.createdAt).format('HH:mm:ss')}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.2,
    field: 'authCode',
    minWidth: 0,
    headerName: 'Auth Code',
    renderCell: ({ row }: ITranscationGeneral) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{row.authCode || 0}</Typography>
    )
  },
  {
    flex: 0.15,
    field: 'baseAmount',
    minWidth: 0,
    headerName: 'Base Amount',
    renderCell: ({ row }: ITranscationGeneral) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{fCurrency(row.baseAmount || 0)}</Typography>
    )
  },
  {
    flex: 0.15,
    field: 'amount',
    minWidth: 0,
    headerName: 'Amount',
    renderCell: ({ row }: ITranscationGeneral) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{fCurrency(row.amount || 0)}</Typography>
    )
  },
  {
    flex: 0.15,
    field: 'status',
    minWidth: 0,
    headerName: 'Status',
    renderCell: ({ row }: ITranscationGeneral) => (
      <CustomChip
        rounded
        skin='light'
        size='small'
        label={STATUS_OPTIONS[row?.status]}
        color={((Number(row?.status) === 0 || Number(row?.status) === 2) && 'warning') || 'success'}
        sx={{
          textTransform: 'capitalize',
          fontSize: 14
        }}
      />
    )
  }
]

const CustomerTranscationTable = ({ transcations }: Props) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  return (
    <DataGrid
      getRowId={row => row._id || row?.id} // Specify the _id property as the unique identifier
      autoHeight
      rowHeight={50}
      columns={columns}
      rows={transcations}
      disableRowSelectionOnClick
      pageSizeOptions={[7, 10, 25, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  )
}

export default CustomerTranscationTable
