// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      badgeContent: 'new',
      badgeColor: 'primary',
      path: '/dashboards',
      auth: false
    },

    {
      sectionTitle: 'Deparments',
      auth: false
    },
    {
      title: 'Email',
      icon: 'tabler:mail',
      path: '/apps/email'
    },
    {
      title: 'Chat',
      icon: 'tabler:messages',
      path: '/apps/chat'
    },
    {
      title: 'Calendar',
      icon: 'tabler:calendar',
      path: '/apps/calendar'
    },
    {
      title: 'Finance',
      icon: 'tabler:settings',
      auth: false,
      children: [
        {
          title: 'Customers',
          path: '',
          auth: false
        },
        {
          title: '31 Queues',
          path: '',
          auth: false
        },
        {
          title: 'Repos',
          path: '',
          auth: false
        },
        {
          title: 'Insurance',
          path: '',
          auth: false
        },
        {
          title: 'Amendments',
          path: '',
          auth: false
        }
      ]
    },
    {
      title: 'Sales',
      icon: 'tabler:settings',
      auth: false,
      children: [
        {
          title: 'Reference',
          path: '',
          auth: false
        }
      ]
    },
    {
      title: 'Ticket',
      icon: 'tabler:settings',
      auth: false
    },
    {
      sectionTitle: 'MANAGMENT',
      auth: false
    },
    {
      title: 'DMS',
      icon: 'tabler:settings',
      auth: false
    },
    {
      title: 'Agent',
      icon: 'tabler:settings',
      auth: false
    },
    {
      title: 'Flags',
      icon: 'tabler:settings',
      auth: false,
      path: '/dashboards/flags/list'
    },
    {
      title: 'Templates',
      icon: 'tabler:settings',
      auth: false,
      children: [
        {
          title: 'IDMS Data',
          path: '',
          auth: false
        },
        {
          title: 'Text',
          path: '',
          auth: false
        },
        {
          title: 'Email',
          path: '',
          auth: false
        },
        {
          title: 'Call',
          path: '',
          auth: false
        },
        {
          title: 'Amendments',
          path: '',
          auth: false
        }
      ]
    },
    {
      title: 'Imports',
      icon: 'tabler:settings',
      auth: false
    },
    {
      title: 'Impound Company',
      icon: 'tabler:settings',
      auth: false
    },
    {
      sectionTitle: 'AUTOMATION',
      auth: false
    },
    {
      title: 'Work Flow',
      icon: 'tabler:settings',
      auth: false
    },
    {
      sectionTitle: 'CALLS',
      auth: false
    },
    {
      title: 'Caller Id',
      icon: 'tabler:settings',
      auth: false
    },
    {
      sectionTitle: 'CALL REPORTS',
      auth: false
    },
    {
      title: 'Call Reports',
      icon: 'tabler:settings',
      auth: false
    }
  ]
}

export default navigation
