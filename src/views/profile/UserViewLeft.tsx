// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import ProfileForm from 'src/views/user/ProfileForm'
import { Drawer, styled } from '@mui/material'

const roleColors: ThemeColor[] = ['error', 'error', 'warning', 'info', 'success']
const statusColors: ThemeColor[] = ['error', 'success']

interface PageProp {
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const UserViewLeft = (prop: PageProp) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const store = useSelector((state: RootState) => state.user)
  const data: any = store.selectedUser

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={roleColors[data?.roles?.id]}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(data?.name)}
              </CustomAvatar>
              <Typography variant='h5' sx={{ mb: 3 }}>
                {data?.name}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data?.agentSetting?.supervisor ?"Supervisor" :data?.roles?.name}
                color={roleColors[data?.roles?.id]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                ABOUT
              </Typography>
              <Box sx={{ pt: 4, pb: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data?.status === 1 ? 'Active' : 'In-Active'}
                    color={statusColors[data?.status]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                CONTACT
              </Typography>
              <Box sx={{ pt: 4, pb: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Phone:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Company Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.companyName}</Typography>
                </Box>
              </Box>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                ADDRESS
              </Typography>
              <Box sx={{ pt: 4, pb: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Address</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.address?.fullAddress}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>City</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.address?.city}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>State</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.address?.city}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Country</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.address?.country}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>Zipcode</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.address?.zipcode}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'left' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
            </CardActions>

            <Drawer
              open={openEdit}
              anchor='right'
              variant='temporary'
              onClose={handleEditClose}
              ModalProps={{ keepMounted: true }}
              sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >
              <Header>
                <Typography variant='h6'>Edit Profile</Typography>
                <IconButton
                  size='small'
                  onClick={handleEditClose}
                  sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
                >
                  <Icon icon='tabler:x' fontSize='1.125rem' />
                </IconButton>
              </Header>
              <ProfileForm
                isEdit={true}
                showRole={false}
                showStatus={false}
                toggle={() => {
                  prop.toggle()
                  handleEditClose()
                }}
                handleClose={handleEditClose}
                currentUser={data}
              />
            </Drawer>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
