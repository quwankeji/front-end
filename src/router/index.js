import { createRouter, createWebHistory } from "vue-router"
import routes from "./router"
var router=createRouter({
    history:createWebHistory(),
    routes
})
export default router