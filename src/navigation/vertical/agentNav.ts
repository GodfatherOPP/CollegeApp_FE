/* eslint-disable react-hooks/exhaustive-deps */
// ** Type import
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch } from 'src/store'
import { getSideBarPermission } from 'src/store/sideBarPermission'

const AgentNavigation = (): VerticalNavItemsType => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const sideBarPermission = useSelector(
    (state: any) => state.sideBarPermission?.AgentPermission?.Permission?.sidebarPermission
  )

  console.debug('sideBarPermission', sideBarPermission)
  useEffect(() => {
    dispatch(getSideBarPermission(user?._id))
  }, [user])

  const [navObj, setNavObj] = useState<any[]>([])

  const filterNavigation = (navItems: any[]): any[] => {
    return navItems.filter(navItem => {
      if (navItem.permission) {
        const permissionKey: string = navItem.permission

        return sideBarPermission[permissionKey]
      } else if (navItem.children) {
        const filteredChildren = filterNavigation(navItem.children)
        navItem.children = filteredChildren

        return filteredChildren.length > 0
      } else {
        return false
      }
    })
  }

  useEffect(() => {
    const temp = [
      {
        title: 'Dashboard',
        icon: 'mdi:view-dashboard-edit-outline',
        badgeColor: 'primary',
        path: '/dashboards',
        permission: 'dashboardPermission'
      },
      {
        title: 'Wallboard',
        icon: 'ep:data-board',
        badgeColor: 'primary',
        path: '/wallboard',
        permission: 'dashboardPermission'
      },
      {
        title: 'Students',
        icon: 'ep:data-board',
        badgeColor: 'primary',
        path: '/students',
        permission: 'studentPermission'
      }
    ]
    sideBarPermission && setNavObj(filterNavigation(temp))
  }, [sideBarPermission, user])

  return navObj
}

export default AgentNavigation
