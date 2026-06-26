import { createRouter, createWebHistory } from 'vue-router'
import Boutique from '../views/Boutique.vue'
import Panier from '../views/Panier.vue'

const routes = [
  { path: '/', component: Boutique },
  { path: '/panier', component: Panier },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
