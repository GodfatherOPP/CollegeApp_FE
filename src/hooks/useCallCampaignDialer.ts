import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useAuth } from './useAuth'
import { GetDialerCamapignCustomerDetails, UpdateCustomerCallFlags, updateDialerState } from 'src/store/dialer/dialer'
import { CallFunctionalityUsed } from 'src/store/dialer/sips'
import { SessionState } from 'sip.js'

const useCallCampaignDialer = () => {
  const {
    assign_customers,
    selectedCamapaignId,
    currentCampaignCustomerId,
    nextCamapaignCustomerId,
    nextCustomer,
    assign_order
  } = useSelector((state: any) => state.dialer)

  const { sessionState, CallFunctionalityUse } = useSelector((state: any) => state.sip)
  const { user } = useAuth()

  const dispatch = useDispatch<AppDispatch>()

  const GetCustomersDetails = async (customerId: string, type: string) => {
    if (![undefined, null, ''].includes(customerId)) {
      const data = {
        agent: user?._id,
        customerId: customerId,
        campaignId: selectedCamapaignId,
        type: type,
        assign_order: assign_order
      }

      const response = await dispatch(GetDialerCamapignCustomerDetails(data))

      //   if ([undefined, null, ''].includes(response?.nextCustomerId)) {
      //     dispatch(updateDialerState({ key: 'nextCustomer', value: {} }))
      //   }
    }
  }

  const UpdateCallFlag = async (flag: number) => {
    if (![undefined, null, ''].includes(currentCampaignCustomerId)) {
      const data = { customerId: currentCampaignCustomerId, call_flag: flag }
      dispatch(UpdateCustomerCallFlags(data))
    }
  }

  return { GetCustomersDetails, UpdateCallFlag }
}

export default useCallCampaignDialer
