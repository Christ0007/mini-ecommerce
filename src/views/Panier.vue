<script setup>
import { toRaw } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { usePanierStore } from '../stores/panier'
import Swal from 'sweetalert2'

const panier = usePanierStore()
const router = useRouter()

function formatPrix(prix) {
  return prix.toLocaleString('fr-FR') + ' FCFA'
}

function augmenter(item) {
  const succes = panier.augmenterQuantite(item.id, item.stock)
  if (!succes) {
    Swal.fire({
      icon: 'warning',
      title: 'Stock maximum atteint',
      text: `Il ne reste que ${item.stock} unite(s) disponible(s).`,
      confirmButtonText: 'OK',
    })
  }
}

async function retirer(id) {
  const item = toRaw(panier.items.find(i => i.id === id))
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Retirer cet article ?',
    text: item.nom,
    showCancelButton: true,
    confirmButtonText: 'Retirer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#e74c3c',
  })
  if (result.isConfirmed) panier.retirerDuPanier(id)
}

async function vider() {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Vider le panier ?',
    text: 'Tous les articles seront supprime.',
    showCancelButton: true,
    confirmButtonText: 'Vider',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#e74c3c',
  })
  if (result.isConfirmed) panier.viderPanier()
}

async function commander() {
  const result = await Swal.fire({
    icon: 'question',
    title: 'Confirmer la commande ?',
    html: `Total : <strong>${formatPrix(panier.totalPrix)}</strong>`,
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#22c55e',
  })
  if (result.isConfirmed) {
    panier.viderPanier()
    await Swal.fire({
      icon: 'success',
      title: 'Commande confirmee !',
      text: 'Merci pour votre achat.',
      timer: 2000,
      showConfirmButton: false,
    })
    router.push('/')
  }
}
</script>

<template>
  <div>
    <h2 class="titre">Mon panier</h2>

    <!-- Panier vide -->
    <div v-if="panier.items.length === 0" class="vide">
      <p>Votre panier est vide.</p>
      <RouterLink to="/" class="btn-primary" style="padding: 10px 20px; border-radius: 4px; color: white; text-decoration: none;">
        Continuer mes achats
      </RouterLink>
    </div>

    <!-- Contenu -->
    <div v-else>
      <div class="articles">
        <div v-for="item in panier.items" :key="item.id" class="article">
          <img :src="item.image" :alt="item.nom" class="article-img" />
          <div class="article-info">
            <p class="article-nom">{{ item.nom }}</p>
            <p class="article-prix-unit">{{ formatPrix(item.prix) }} / unite</p>
          </div>
          <div class="article-qty">
            <button class="btn-gray" style="padding: 4px 10px;" @click="panier.diminuerQuantite(item.id)">-</button>
            <span class="qty-val">{{ item.quantite }}</span>
            <button class="btn-gray" style="padding: 4px 10px;" @click="augmenter(item)">+</button>
          </div>
          <p class="article-total">{{ formatPrix(item.prix * item.quantite) }}</p>
          <button class="btn-danger" style="padding: 6px 10px;" @click="retirer(item.id)">Retirer</button>
        </div>
      </div>

      <!-- Recapitulatif -->
      <div class="recap">
        <div class="recap-ligne">
          <span>Articles ({{ panier.nombreArticles }})</span>
          <span>{{ formatPrix(panier.totalPrix) }}</span>
        </div>
        <div class="recap-ligne">
          <span>Livraison</span>
          <span class="gratuit">Gratuite</span>
        </div>
        <hr />
        <div class="recap-total">
          <span>Total</span>
          <span>{{ formatPrix(panier.totalPrix) }}</span>
        </div>
        <div class="recap-actions">
          <button class="btn-success" @click="commander">Commander</button>
          <button class="btn-danger" @click="vider">Vider le panier</button>
          <RouterLink to="/" class="btn-outline" style="padding: 8px 14px; border-radius: 4px; text-decoration: none; font-size: 14px;">
            Continuer mes achats
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.titre {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.vide {
  text-align: center;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6c757d;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.article {
  background: white;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  flex-wrap: wrap;
}

.article-img {
  width: 70px;
  height: 55px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.article-info { flex: 1; min-width: 120px; }

.article-nom {
  font-size: 0.9rem;
  font-weight: 600;
}

.article-prix-unit {
  font-size: 0.78rem;
  color: #6c757d;
  margin-top: 2px;
}

.article-qty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-val {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.article-total {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.9rem;
  min-width: 110px;
  text-align: right;
}

.recap {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  max-width: 380px;
  margin-left: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recap-ligne {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #495057;
}

.gratuit { color: #16a34a; font-weight: 500; }

hr { border: none; border-top: 1px solid #e5e7eb; }

.recap-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1rem;
}

.recap-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.recap-actions button,
.recap-actions a {
  width: 100%;
  text-align: center;
  justify-content: center;
}
</style>
