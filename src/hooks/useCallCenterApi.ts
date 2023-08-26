import React, { Component, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getAllIVR, getAssignNumbers, getIVRAudios } from 'src/store/dialer/callcenter'
import { GETUSER_TYPE, getDelearsAndAgentsByCreatedBy, getInBoundQueues } from 'src/store/dialer/numbermanagement'
import dialer from 'src/store/dialer/dialer'
import { Page } from '@react-pdf/renderer'
import TicketForm from 'src/views/ticket/TicketForm'

const useCallCenterApi = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [userId, setUserId] = useState('')

  const { user } = useAuth()

  const data = useMemo(() => {
    const data: any = {}

    if (user?.roles?.id === 1) {
      data['is_master'] = '1'
    }

    if (user?.roles?.id === 2) {
      data['phone'] = user?.phone
    }

    if (user?.roles?.id === 3) {
      data['phone'] = user?.createdBy?.phone
    }

    return data
  }, [user])

  /*  eslint-disable   @typescript-eslint/no-inferrable-types */

  const getAllIVRList = async (searchTerm: string = '') => {
    return dispatch(getAllIVR({ ...data, searchTerm: searchTerm }))
  }

  const getAllIVRAudioList = async (searchTerm: string = '') => {
    return dispatch(getIVRAudios({ ...data, searchTerm: searchTerm }))
  }

  const getAllAssignNumberList = async (searchTerm: string = '') => {
    return dispatch(getAssignNumbers({ ...data, searchTerm: searchTerm }))
  }

  const getAllInboundQueuesList = async (searchTerm: string = '') => {
    return dispatch(getInBoundQueues({ ...data, searchTerm: searchTerm }))
  }

  const DelearsAndAgentsByCreatedBy = async (type: GETUSER_TYPE, id: string = '') => {
    let userId: any = user?._id
    if (user?.roles?.id === 3) {
      userId = user?.createdBy?._id
    }
    dispatch(getDelearsAndAgentsByCreatedBy(![undefined, null, ''].includes(id) ? id : userId, type))
  }

  return {
    getAllIVRList,
    getAllIVRAudioList,
    getAllAssignNumberList,
    getAllInboundQueuesList,
    DelearsAndAgentsByCreatedBy
  }
}

export default useCallCenterApi
