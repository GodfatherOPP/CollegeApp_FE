/* eslint-disable react-hooks/exhaustive-deps */
// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'
import CrmEarningReportsWithTabs from 'src/views/dashboards/crm/CrmEarningReportsWithTabs'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import EcommerceTransactionsVertical from 'src/views/dashboards/ecommerce/EcommerceTransactionsVertical'
import AgentReportsTabs from 'src/views/dashboards/crm/AgentReportsTabs'
import { useAuth } from 'src/hooks/useAuth'
import { useTheme } from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
const EcommerceDashboard = () => {
  // ** Hook
  const theme = useTheme()

  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  return user?.roles?.id !== 1 ? (
    <ApexChartWrapper>
      <KeenSliderWrapper>{'Dasboard '}</KeenSliderWrapper>
    </ApexChartWrapper>
  ) : (
    <div></div>
  )
}

export default EcommerceDashboard
