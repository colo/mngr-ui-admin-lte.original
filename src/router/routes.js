
const routes = [
  {
    path: '/',
    component: () => import('layouts/admin-lte.vue'),
    name: 'Home',
    // redirect: { name: 'Dashboard' },
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/dashboard.vue'),
        name: 'Dashboard',
        meta: {
          breadcrumb: {
            parent: 'Home'
          }
        },
        children: [
          // {
          //   name: 'DashboardMain',
          //   path: '',
          //   component: () => import('pages/dashboard/main.vue'),
          // },
          {
            name: 'Host',
            path: ':host',
            component: () => import('pages/dashboard/host.vue'),
            // meta: {
            //   breadcrumb: {
            //     parent: 'Dashboard'
            //
            //   }
            // },
          }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
