import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePanierStore = defineStore('panier', () => {
  const items = ref(JSON.parse(localStorage.getItem('panier') || '[]'))

  function sauvegarder() {
    localStorage.setItem('panier', JSON.stringify(items.value))
  }

  const nombreArticles = computed(() =>
    items.value.reduce((total, item) => total + item.quantite, 0)
  )

  const totalPrix = computed(() =>
    items.value.reduce((total, item) => total + item.prix * item.quantite, 0)
  )

  function ajouterAuPanier(produit) {
    const existant = items.value.find(i => i.id === produit.id)
    if (existant) {
      if (existant.quantite >= produit.stock) return false
      existant.quantite++
    } else {
      items.value.push({ ...produit, quantite: 1 })
    }
    sauvegarder()
    return true
  }

  function augmenterQuantite(id, stock) {
    const item = items.value.find(i => i.id === id)
    if (!item || item.quantite >= stock) return false
    item.quantite++
    sauvegarder()
    return true
  }

  function diminuerQuantite(id) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    if (item.quantite > 1) {
      item.quantite--
    } else {
      items.value = items.value.filter(i => i.id !== id)
    }
    sauvegarder()
  }

  function retirerDuPanier(id) {
    items.value = items.value.filter(i => i.id !== id)
    sauvegarder()
  }

  function viderPanier() {
    items.value = []
    sauvegarder()
  }

  return {
    items,
    nombreArticles,
    totalPrix,
    ajouterAuPanier,
    augmenterQuantite,
    diminuerQuantite,
    retirerDuPanier,
    viderPanier,
  }
})
