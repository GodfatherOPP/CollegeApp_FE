// ** React Imports
import { ReactNode, ChangeEvent, useState, KeyboardEvent, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import { LoadingButton } from '@mui/lab'

const RightWrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  maxWidth: 450
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  color: theme.palette.primary.main
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}

const TwoStepsV1 = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const userData = JSON.parse(window.localStorage.getItem('userData') || '{}')
  const phone = userData?.phone
  const email = userData?.email

  // ** State
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!phone) {
      router.replace('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const onSubmit = (data: any) => {
    if (userData) {
      const { val1, val2, val3, val4, val5, val6 } = data;
      const otp = `${val1}${val2}${val3}${val4}${val5}${val6}`;
      setIsLoading(true);
      auth.loginOTP({ phone, otp, rememberMe }, () => {
        setIsLoading(false);
        setError('val6', {
          type: 'manual',
          message: 'OTP is not valid'
        })
      })
    }
  }

  const resendOTP = () => {
    if (userData) {
      auth.resendOTP({ phone })
    }
  }

  const retryLogin = () => {
    localStorage.removeItem('userData')
    router.replace('/login')
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8),
            width: '100%',
            height: `calc(100vh - ${theme.spacing(16)})`,
            backgroundImage: `url('/assets/illustrations/home_page.png')`,
            backgroundSize: '100% 100%'
          }}
        />
      )}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                Two-Step Verification 💬
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                We sent a verification code to your Email . Enter the code from the Email in the field below.
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>{email?.substr(0, 6)}******</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Type your 6 digit security code</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CleaveWrapper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(errorsArray.length && {
                    '& .invalid:focus': {
                      borderColor: theme => `${theme.palette.error.main} !important`,
                      boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                    }
                  })
                }}
              >
                {renderInputs()}
              </CleaveWrapper>
              <FormControlLabel
                label="Don't ask for OTP for 7 days"
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
              />
              {errorsArray.length ? (
                <FormHelperText sx={{ color: 'error.main' }}>Please Enter a valid OTP!</FormHelperText>
              ) : null}
              <LoadingButton fullWidth type='submit' variant='contained' sx={{ mt: 2 }} loading={isLoading}>
                Verify My Account
              </LoadingButton>
            </form>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>Didn't get the code?</Typography>
              <LinkStyled href='/' onClick={() => resendOTP()}>
                Resend
              </LinkStyled>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/' onClick={() => retryLogin()}>
                Retry Login
              </LinkStyled>
            </Box>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

TwoStepsV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

TwoStepsV1.guestGuard = true

export default TwoStepsV1
