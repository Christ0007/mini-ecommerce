<script setup>
import { ref } from 'vue'
import { usePanierStore } from '../stores/panier'
import Swal from 'sweetalert2'

const panier = usePanierStore()

const produits = ref([
  { id: 1, nom: 'Smartphone Galaxy S24', prix: 450000, stock: 10, image: 's24.avif' },
  { id: 2, nom: 'Laptop Dell Inspiron',  prix: 850000, stock: 5,  image: 'public/images.jpeg' },
  { id: 3, nom: 'Ecouteurs Bluetooth',   prix: 35000,  stock: 20, image: 'public/image.jpeg' },
  { id: 4, nom: 'PlayStation 2',       prix: 75000,  stock: 8,  image: 'public/air.jpeg' },
  { id: 5, nom: 'Chargeur',         prix: 22000,  stock: 15, image: 'public/ps2.jpeg' },
  { id: 6, nom: 'Lampe de bureau LED',   prix: 15000,  stock: 0,  image: 'public/led.jpeg' },
])

function formatPrix(prix) {
  return prix.toLocaleString('fr-FR') + ' FCFA'
}

function ajouter(produit) {
  if (produit.stock === 0) return

  const succes = panier.ajouterAuPanier(produit)
  if (succes) {
    Swal.fire({
      icon: 'success',
      title: 'Ajoute au panier',
      text: produit.nom,
      timer: 1200,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    })
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Stock insuffisant',
      text: `Il ne reste que ${produit.stock} unite(s) disponible(s).`,
      confirmButtonText: 'OK',
    })
  }
}
</script>

<template>
  <div>
    <h2 class="titre">Nos produits</h2>

    <div class="grille">
      <div v-for="p in produits" :key="p.id" class="card">
        <img :src="p.image" :alt="p.nom" class="card-img" />
        <div class="card-body">
          <h5 class="card-nom">{{ p.nom }}</h5>
          <div class="card-footer">
            <span class="prix">{{ formatPrix(p.prix) }}</span>
            <span :class="p.stock === 0 ? 'rupture' : p.stock < 5 ? 'stock-bas' : 'stock-ok'">
              {{ p.stock === 0 ? 'Rupture' : `${p.stock} en stock` }}
            </span>
          </div>
          <button
            class="btn-primary"
            style="width: 100%; margin-top: 10px;"
            :disabled="p.stock === 0"
            @click="ajouter(p)"
          >
            Ajouter au panier
          </button>
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

.grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.25rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-nom {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prix {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.95rem;
}

.stock-ok  { font-size: 0.75rem; color: #16a34a; }
.stock-bas { font-size: 0.75rem; color: #f97316; font-weight: 600; }
.rupture   { font-size: 0.75rem; color: #e74c3c; font-weight: 600; }
</style>
