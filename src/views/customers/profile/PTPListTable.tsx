// ** React Imports
import { useState } from 'react'
// ** MUI Imports
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

// ** Custom Component Imports
import moment from 'moment'

interface Props {
  ptp: any
};

const PTP_TYPE: any = {
  0: 'Unknown',
  1: 'Walk_In',
  2: 'Mail',
  3: 'Phone',
  4: 'Web',
  6: 'Fax',
  7: 'Lockbox',
  9: 'Email',
  10: 'Text',
  14: 'IVR',
  15: 'Kiosk',
};

const columns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'amount',
    minWidth: 0,
    headerName: 'Amount',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>${row.amount}</Typography>
    )
  },
  {
    flex: 0.2,
    field: 'delivery_method',
    minWidth: 0,
    headerName: 'Delivery Method',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{PTP_TYPE[row.delivery_method]}</Typography>
    )
  },
  {
    flex: 0.15,
    field: 'note',
    minWidth: 0,
    headerName: 'Note',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{row.note}</Typography>
    )
  },
  {
    flex: 0.15,
    field: 'payment_date',
    minWidth: 0,
    headerName: 'Payment Date',
    renderCell: ({ row }: any) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
          {moment.utc(row.payment_date).format('MM-DD-YYYY')}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
          {moment(row.payment_date).format('HH:mm:ss')}
        </Typography>
      </Box>
    )
  }
]

const PTPListTable = ({ ptp }: Props) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  return (
    <DataGrid
      getRowId={row => row._id || row?.id}
      autoHeight
      rowHeight={50}
      columns={columns}
      rows={ptp}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 25]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  )
}

export default PTPListTable
