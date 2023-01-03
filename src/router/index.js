import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/layouts/index.vue';
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/errorPage/401.vue'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    hidden: true,
  },
  {
    path: '/superuser',
    name: 'Superuser',
    component: () => import('@/views/users/createsuperuser.vue'),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Root',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/index/index.vue'),
        meta: {
          title: "首页",
          icon: 'icon-home',
          affix: true,
          noKeepAlive: true,
        },
      },
    ],
  },
  
  {
    path: '/userPage',
    name: 'UserPage',
    component: Layout,
    meta: {
      title: "用户管理",
      icon: 'icon-user',
    },
    children: [
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/users/role.vue'),
        meta: {
          title: "角色界面",
          icon: 'icon-male',
        },
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/users/index.vue'),
        meta: {
          title: "用户界面",
          icon: 'icon-user',
        },
      },
    ],
  },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
