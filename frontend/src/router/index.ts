import { createRouter, createWebHistory } from 'vue-router'
import {checkAuth, getUserId} from "../services/authentication.ts";
import useErrorStore from "../use/useErrorStore.ts";

const { addError } = useErrorStore();

const routes = [
    { path: '/', redirect: () => `/c` },
    { path: '/c', redirect: () => `/c/${crypto.randomUUID()}-${Date.now()}` },
    {
        path: '/c/:id',
        name: "chat-id",
        component: () => import('../views/ChatPage.vue'),
    },
    {
        path: '/share/:id',
        name: "share-id",
        component: () => import('../views/ChatPage.vue'),
    },
    {
        path: '/log-in',
        name: 'log-in',
        component: () => import('../views/LogInPage.vue'),
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('../views/SignUpPage.vue'),
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        component: () => import('../views/Maintenance.vue'),
    },
    {
        path: '/gallery',
        name: 'gallery',
        component: () => import('../views/Gallery.vue'),
    },
    {
        path: '/p',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
    },
    {
        path: '/p/:id',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFoundPage.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    try {
        // const isMaintenance = await maintenanceCheck();
        // if (isMaintenance && to.name !== 'maintenance') {
        //     return next('/maintenance');
        // }
        // else if (isMaintenance && to.name === 'maintenance') {
        //     return next();
        // }
        // else if (!isMaintenance && to.name === 'maintenance') {
        //     return next('/c');
        // }

        if (to.path === "/p") {
            const userId = await getUserId()
            return next(`/p/${userId}`)
        }

        const isAuth = await checkAuth();
        if ((to.name === 'log-in' || to.name === 'sign-up') && isAuth) {
            return next('/c');
        }
        if (!isAuth && to.name !== 'log-in' && to.name !== 'sign-up' && to.name !== 'not-found') {
            return next('/log-in');
        }

        return next();
    } catch (error: any) {
        addError(error.message)
        return next('/log-in');
    }
});

export default router;