const routes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/login/index.vue"),
    },
    {
        path: '/',
        name: 'home',
        meta: {
            title: '广场',
            keepAlive: false,
        },
        component: () => import('@/views/square/index.vue'),
    },
    {
        name: "square",
        path: "/square/index",
        component: () => import("@/views/square/index.vue")
    },
    {
        name: "team",
        path: "/team",
        component: () => import("@/views/team/index.vue")

    },
    {
        name: "teamDetail",
        path: "/team/teamDetail",
        component: () => import("@/views/team/teamDetail.vue")

    },
    {
        name: "detail",
        path: "/square/detail",
        component: () => import("@/views/square/detail.vue")

    },
    {
        name: "my",
        path: "/my",
        component: () => import("@/views/user/index.vue")

    },
    {
        name: "collect",
        path: "/collect",
        component: () => import("@/views/collect/index.vue")

    },
    {
        name: "message",
        path: "/message",
        component: () => import("@/views/message/index.vue")

    },
    // {
    //     name: "chat",
    //     path: "/chat",
    //     component: () => import("@/components/chat/chat.vue")
    // },
]
export default routes;