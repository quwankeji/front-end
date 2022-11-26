const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: '广场',
            keepAlive: true,
        },
        component: () => import('@/views/square/index.vue'),
    },
    {
        name: "square",
        path: "/square/index",
        component: () => import("@/views/square/index.vue")
    },
    {
        name: "detail",
        path: "/square/detail",
        component: () => import("@/views/square/detail.vue")

    }
]
export default routes;