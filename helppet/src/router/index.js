import SignUp from "../pages/SignUp.vue";
import {createRouter, createWebHistory} from "vue-router";
import SignIn from "../pages/SignIn.vue";
import Home from "../pages/Home.vue";
import StrayPetDetail from "../pages/StrayPetDetail.vue";

const isAuthenticated = () => {
    return !!localStorage.getItem("uid");
};
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignIn
    },
    {
        path: '/publish-stray-pet',
        name: 'PublishStrayPet',
        meta: {
            requiresAuth: true,
            role: 'explorer'
        },
        component: () => import('../pages/PublishStrayPet.vue'),
    },
    {
        path: '/stray-pet/:id',
        name: 'StrayPetDetail',
        component: () => import('../pages/StrayPetDetail.vue'),
        props: true,
    },
    {
        path: '/help/:id',
        name: 'HelpPet',
        component: () => import('../pages/HelpPet.vue'),
        props: true,
    },
    {
        path: '/salvage-record/:id',
        name: 'SalvageRecordDetail',
        component: () => import('../pages/SalvageRecordDetail.vue'),
        props: true,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticated()) {
            next({ name: "SignIn" });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;