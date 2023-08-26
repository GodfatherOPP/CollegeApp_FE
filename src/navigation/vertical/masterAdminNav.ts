// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const MasterAdminNavigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'mdi:view-dashboard-edit-outline',
      badgeColor: 'primary',
      path: '/dashboards'
    },
    {
      title: 'Management',
      icon: 'mdi:tools',
      children: [
        {
          title: 'Dealers',
          icon: 'mdi:account-group',
          path: '/management/users'
        }
      ]
    },
    {
      title: 'Call Center',
      icon: 'fluent:call-outbound-16-filled',
      children: [
        {
          title: 'Numbers',
          icon: 'fluent-emoji-high-contrast:input-numbers',
          path: '/callcenter/numbers'
        },
        {
          title: 'Queues  Management',
          icon: 'mdi:account-group',
          path: '/callcenter/queuesmanagement'
        },
        {
          title: 'IVR',
          icon: 'healthicons:call-centre',
          path: '/callcenter/ivr'
        },
        {
          title: 'Audio Files',
          icon: 'fa-solid:file-audio',
          path: '/callcenter/audio'
        }
      ]
    }
  ]
}

export default MasterAdminNavigation
