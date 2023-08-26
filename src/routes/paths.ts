// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/dashboards'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path('', '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password')
}

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components'
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`)
  }
}

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog'
}

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/'

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/'

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/'

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1'
