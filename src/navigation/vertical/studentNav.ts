const StudentNavigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: 'mdi:view-dashboard-edit-outline',
      // badgeColor: 'primary',
      path: '/dashboards',
      permission: 'dashboardPermission'
    },
    {
      title: 'Wallboard',
      icon: 'ep:data-board',
      // badgeColor: 'primary',
      path: '/wallboard',
      permission: 'dashboardPermission'
    },
    {
      title: 'Students',
      icon: 'ep:data-board',
      // badgeColor: 'primary',
      path: '/students',
      permission: 'studentPermission'
    }
  ]
}

export default StudentNavigation
