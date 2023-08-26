/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUserDetails } from 'src/store/management/user'
import { AppDispatch } from 'src/store'
import ProfileView from 'src/views/profile/profile'

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userData = JSON.parse(window.localStorage.getItem('userData') || '{}')

  useEffect(() => {
    dispatch(getUserDetails(userData._id))
  }, [])

  return <ProfileView 
    settingsFlag={userData?.roles?.id === 2} 
    userData={userData} 
    toggle={() => void null} 
  />
}

export default Profile
