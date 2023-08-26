import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { SessionState } from 'sip.js'
import { AppDispatch } from 'src/store'
import { PowerDialerAddCalls, updateDialerState } from 'src/store/dialer/dialer'
import { getObjectCount } from 'src/utils/sipUtilsFunc'

function usePoweDialerCall() {
  const {
    callerid,
    dialNumber,
    settingSave,
    ongoing_member_id,
    powerDialerCalls,
    powerDialerSessionState,
    isAgentOnCall,
    agentDialNumber,
    incoingContactStr
  } = useSelector((state: any) => state.dialer)

  const dispatch = useDispatch<AppDispatch>()

  const data = useMemo(() => {
    return {
      destination: dialNumber,
      callerid: '9099458674',
      request_type: 'list',
      member_id: ''
    }
  }, [dialNumber, callerid, settingSave])

  const GetPowerDialCalls = async () => {
    const send_data = {
      ...data,
      destination: dialNumber,
      request_type: 'list',
      member_id: ''
    }
    await dispatch(PowerDialerAddCalls(send_data))
  }

  const checkAgentOnCall = useCallback(() => {
    if (powerDialerCalls && powerDialerCalls.length > 0 && ![undefined, null, ''].includes(agentDialNumber)) {
      const checkAgent = powerDialerCalls.findIndex((calls: any) => {
        return calls.caller_id_number === agentDialNumber
      })
      console.debug('checkagent ============>>>>>>>>>', checkAgent)
      if (checkAgent < 0) {
        dispatch(updateDialerState({ key: 'isAgentOnCall', value: false }))
        dispatch(updateDialerState({ key: 'isAgentValueSet', value: false }))
        // dispatch(updateDialerState({ key: 'agentDialNumber', value: '' }))
        console.info('<<<<==== Agent Going ===>>>>')
      } else {
        dispatch(updateDialerState({ key: 'isAgentOnCall', value: true }))
      }
    }

    if (powerDialerCalls && powerDialerCalls.length > 0 && [undefined, null, ''].includes(agentDialNumber)) {
      dispatch(updateDialerState({ key: 'isAgentOnCall', value: false }))
      dispatch(updateDialerState({ key: 'isAgentValueSet', value: false }))
      // dispatch(updateDialerState({ key: 'agentDialNumber', value: '' }))
      console.info('<<<<==== Agent Going Number Is Blank ===>>>>')
    }
  }, [powerDialerCalls, isAgentOnCall, agentDialNumber])

  const CheckCustomerExist = useCallback(() => {
    let currentCustomer: any = {}
    currentCustomer =
      powerDialerCalls.find((callsList: any) => callsList?.caller_id_number === dialNumber && callsList) || {}
    if (currentCustomer && getObjectCount(currentCustomer) > 0) {
      const member_id = currentCustomer?.id
      powerDialerSessionState !== SessionState.Established &&
        dispatch(updateDialerState({ key: 'powerDialerSessionState', value: SessionState.Established }))
      ongoing_member_id !== member_id && dispatch(updateDialerState({ key: 'ongoing_member_id', value: member_id }))
    } else {
      if (![undefined, null, '', SessionState.Initial].includes(powerDialerSessionState)) {
        powerDialerSessionState !== SessionState.Terminated &&
          dispatch(updateDialerState({ key: 'powerDialerSessionState', value: SessionState.Terminated }))
      }
    }
  }, [dialNumber, ongoing_member_id, powerDialerCalls, powerDialerSessionState])

  useEffect(() => {
    CheckCustomerExist()
  }, [powerDialerCalls])

  const AddPowerDialerCall = async (number: string | number) => {
    const send_data = {
      ...data,
      destination: number,
      request_type: 'addcall',
      member_id: ''
    }
    dispatch(updateDialerState({ key: 'powerDialerSessionState', value: SessionState.Establishing }))
    dispatch(updateDialerState({ key: 'dialNumber', value: number }))
    const response = await dispatch(PowerDialerAddCalls(send_data))
  }

  const HangupPowerDialerCall = async () => {
    const send_data = {
      ...data,
      destination: dialNumber,
      request_type: 'endcall',
      member_id: ongoing_member_id
    }
    const response = await dispatch(PowerDialerAddCalls(send_data))
    console.debug('end dialsmfkcsdzxfvbdnxbvdxcvbxbcv')
  }

  const endallPowerDialCall = async (incoimgcall = false) => {
    console.debug('fmgbgmcvbmgfcvbfcvnbj fvc bdfcb fcv cbf  ============================')
    powerDialerCalls &&
      powerDialerCalls.map(async (calls: any) => {
        if (
          incoimgcall &&
          ![undefined, null, ''].includes(incoingContactStr) &&
          calls?.caller_id_number === incoingContactStr
        ) {
          await dispatch(PowerDialerAddCalls({ member_id: calls?.id, request_type: 'endcall' }))
        } else {
          await dispatch(PowerDialerAddCalls({ member_id: calls?.id, request_type: 'endcall' }))
        }
        // await dispatch(PowerDialerAddCalls({ member_id: calls?.id, request_type: 'endcall' }))
      })
  }

  return {
    AddPowerDialerCall,
    HangupPowerDialerCall,
    GetPowerDialCalls,
    endallPowerDialCall,
    checkAgentOnCall
  }
}

export default usePoweDialerCall
