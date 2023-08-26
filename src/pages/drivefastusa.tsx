import { ReactNode, useState } from 'react'
// next
import Head from 'next/head'
// @mui
import { Container, Box, Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material'
// Redux
//
import { useSnackbar } from 'notistack'
// layouts
// import DriveFastFormLayout from '../layouts/DriveFastFormLayout/DriveFastFormLayout';
// sections
import { useDispatch } from 'react-redux'
import { submitDriveFastContactForm } from 'src/store/reference/contactForm'
import { AppDispatch } from 'src/store'
import { DriveFastHero } from 'src/views/contact'
import { PersonalInfoContactForm, ReferenceInfoContactForm } from 'src/views/contact/DriveFastContactForm'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { toast } from 'react-hot-toast'
// import { useRouter } from 'next/router';
// import { PATH_DASHBOARD } from 'src/routes/paths';
//
// ----------------------------------------------------------------------

// ContactPage.getLayout = (page: React.ReactElement) => (
//   <DriveFastFormLayout>{page}</DriveFastFormLayout>
// );

// ----------------------------------------------------------------------
const ContactPage = () => {
  const [activeStep, setActiveStep] = useState(0)
  // const { push } = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const { enqueueSnackbar } = useSnackbar()
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData1, setReferenceData1] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData2, setReferenceData2] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData3, setReferenceData3] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData4, setReferenceData4] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData5, setReferenceData5] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData6, setReferenceData6] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData7, setReferenceData7] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData8, setReferenceData8] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData9, setReferenceData9] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const [referenceData10, setReferenceData10] = useState({
    refType: '',
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    street: '',
    state: '',
    city: '',
    zipCode: ''
  })
  const handleNext = (data: any, i: number) => {
    if (data) {
      console.log(data, i)
      if (i === 0) setPersonalData(data)
      else if (i === 1) setReferenceData1(data)
      else if (i === 2) setReferenceData2(data)
      else if (i === 3) setReferenceData3(data)
      else if (i === 4) setReferenceData4(data)
      else if (i === 5) setReferenceData5(data)
      else if (i === 6) setReferenceData6(data)
      else if (i === 7) setReferenceData7(data)
      else if (i === 8) setReferenceData8(data)
      else if (i === 9) setReferenceData9(data)
      else if (i === 10) {
        setReferenceData10(data)
        setActiveStep(prevActiveStep => prevActiveStep)

        return onSubmit({
          personalData,
          referenceData1,
          referenceData2,
          referenceData3,
          referenceData4,
          referenceData5,
          referenceData6,
          referenceData7,
          referenceData8,
          referenceData9,
          referenceData10
        })
      }

      return setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    return 1
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleSubmit = () => {
    onSubmit({
      personalData,
      referenceData1,
      referenceData2,
      referenceData3,
      referenceData4,
      referenceData5,
      referenceData6,
      referenceData7,
      referenceData8,
      referenceData9,
      referenceData10
    })
  }

  const onSubmit = async (data: any) => {
    try {
      dispatch(
        submitDriveFastContactForm({
          personalInfo: personalData,
          referenceInfo: [
            referenceData1,
            referenceData2,
            referenceData3,
            referenceData4,
            referenceData5,
            referenceData6,
            referenceData7,
            referenceData8,
            referenceData9,
            referenceData10
          ]
        })
      )
        .then(resData => {
          if (resData?.statusCode === 200) {
            toast.success(resData?.message)
            setPersonalData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData10({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData9({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData8({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData7({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData6({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData5({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData4({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData3({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData2({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setReferenceData1({
              refType: '',
              name: '',
              email: '',
              phone: '',
              houseNumber: '',
              street: '',
              state: '',
              city: '',
              zipCode: ''
            })
            setActiveStep(0)
          } else {
            toast.error(resData?.message)
          }
        })
        .catch(error => {
          console.error(error)
          toast.error(error?.message)
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <title> Drive Fast Usa</title>
      </Head>

      <DriveFastHero
        CONTACTS_OPTIONS={[
          {
            country: 'Drive Fast USA',
            address: '4880 S. 96th Street Omaha, NE 68127',
            phoneNumber: ' (402) 504-4952'
          },
          {
            country: 'Drive Fast USA - Lincoln',
            address: '2601 Whitehead Dr Lincoln, NE 68521',
            phoneNumber: '(402) 242-6100'
          },
          {
            country: 'Drive Fast USA - Wichita',
            address: '10810 W Kellogg Dr.',
            phoneNumber: 'Wichita, KS 67209'
          }
        ]}
        secondaryTexts={[]}
        mainText='Drive Fast USA'
      />

      <Container sx={{ py: 10 }}>
        <Typography mb={5}>
          Welcome To Drive Fast USA, Please Provide 7 references (required) 10 are prefered
        </Typography>
        <Box
          gap={10}
          display='grid'
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)'
          }}
        >
          <Stepper activeStep={activeStep} orientation='vertical'>
            <Step key={0}>
              <StepLabel>
                Enter Your Personal Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                <PersonalInfoContactForm handleNext={handleNext} personalData={personalData} />
              </StepContent>
            </Step>
            <Step key={1}>
              <StepLabel>
                Enter Reference 1 Information <span style={{ color: 'red' }}>*</span>{' '}
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData1}
                  index={1}
                />
              </StepContent>
            </Step>
            <Step key={2}>
              <StepLabel>
                Enter Reference 2 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData2}
                  index={2}
                />
              </StepContent>
            </Step>
            <Step key={3}>
              <StepLabel>
                Enter Reference 3 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData3}
                  index={3}
                />
              </StepContent>
            </Step>

            <Step key={4}>
              <StepLabel>
                Enter Reference 4 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData4}
                  index={4}
                />
              </StepContent>
            </Step>
            <Step key={5}>
              <StepLabel>
                Enter Reference 5 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData5}
                  index={5}
                />
              </StepContent>
            </Step>
            <Step key={6}>
              <StepLabel>
                Enter Reference 6 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleBack={handleBack}
                  referenceData={referenceData6}
                  index={6}
                />
              </StepContent>
            </Step>
            <Step key={7}>
              <StepLabel>
                Enter Reference 7 Information <span style={{ color: 'red' }}>*</span>
              </StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleSubmitForm={handleSubmit}
                  showSubmit
                  handleBack={handleBack}
                  referenceData={referenceData7}
                  index={7}
                />
              </StepContent>
            </Step>
            <Step key={8}>
              <StepLabel>Enter Reference 8 Information</StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleSubmitForm={handleSubmit}
                  showSubmit
                  handleBack={handleBack}
                  referenceData={referenceData8}
                  index={8}
                />
              </StepContent>
            </Step>
            <Step key={9}>
              <StepLabel>Enter Reference 9 Information</StepLabel>
              <StepContent>
                {' '}
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  handleSubmitForm={handleSubmit}
                  showSubmit
                  handleBack={handleBack}
                  referenceData={referenceData9}
                  index={9}
                />
              </StepContent>
            </Step>
            <Step key={10}>
              <StepLabel>Enter Reference 10 Information</StepLabel>
              <StepContent>
                <ReferenceInfoContactForm
                  handleNext={handleNext}
                  showSubmit
                  final
                  handleBack={handleBack}
                  referenceData={referenceData10}
                  index={10}
                />
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Container>
    </>
  )
}

ContactPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ContactPage
