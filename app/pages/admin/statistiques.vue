
<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
})

// ========================================
// DONNÉES TEMPORAIRES
// À remplacer plus tard par les données API
// ========================================

const quotes = ref([
  {
    id: 1,
    text: 'Le destin réserve toujours des surprises.',
    movie: 'Les chemins du destin',
    uses: 156,
    correct: 128,
    incorrect: 28,
  },
  {
    id: 2,
    text: 'Rien ne se passe jamais comme prévu.',
    movie: 'Une journée étrange',
    uses: 93,
    correct: 34,
    incorrect: 59,
  },
  {
    id: 3,
    text: 'Ensemble, nous pouvons tout accomplir.',
    movie: 'Au-delà des étoiles',
    uses: 210,
    correct: 170,
    incorrect: 40,
  },
  {
    id: 4,
    text: 'Il faut parfois savoir recommencer.',
    movie: 'Le dernier départ',
    uses: 75,
    correct: 30,
    incorrect: 45,
  },
])

const search = ref('')
const selectedFilter = ref('all')
const sortBy = ref('uses')

// ========================================
// CALCULS DES STATISTIQUES
// ========================================

const totalUses = computed(() =>
  quotes.value.reduce((total, quote) => total + quote.uses, 0),
)

const totalCorrect = computed(() =>
  quotes.value.reduce((total, quote) => total + quote.correct, 0),
)

const totalIncorrect = computed(() =>
  quotes.value.reduce((total, quote) => total + quote.incorrect, 0),
)

const successRate = computed(() => {
  const totalAnswers = totalCorrect.value + totalIncorrect.value

  if (totalAnswers === 0) return 0

  return Math.round((totalCorrect.value / totalAnswers) * 1000) / 10
})

const getSuccessRate = (quote) => {
  if (quote.correct + quote.incorrect === 0) return 0

  return Math.round(
    (quote.correct / (quote.correct + quote.incorrect)) * 1000,
  ) / 10
}

// ========================================
// RECHERCHE, FILTRES ET TRI
// ========================================

const filteredQuotes = computed(() => {
  const searchText = search.value.toLowerCase().trim()

  const results = quotes.value.filter((quote) => {
    const matchesSearch =
      !searchText ||
      quote.text.toLowerCase().includes(searchText) ||
      quote.movie.toLowerCase().includes(searchText)

    const rate = getSuccessRate(quote)

    const matchesFilter =
      selectedFilter.value === 'all' ||
      (selectedFilter.value === 'easy' && rate >= 70) ||
      (selectedFilter.value === 'difficult' && rate < 50)

    return matchesSearch && matchesFilter
  })

  return [...results].sort((a, b) => {
    if (sortBy.value === 'success-desc') {
      return getSuccessRate(b) - getSuccessRate(a)
    }

    if (sortBy.value === 'success-asc') {
      return getSuccessRate(a) - getSuccessRate(b)
    }

    return b.uses - a.uses
  })
})

const resetFilters = () => {
  search.value = ''
  selectedFilter.value = 'all'
  sortBy.value = 'uses'
}
</script>

<template>
  <section class="statistics-page">
    <!-- EN-TÊTE -->
    <header class="page-header">
      <div>
        <p class="eyebrow">ADMINISTRATION / STATISTIQUES</p>
        <h1>Statistiques des citations</h1>
        <p class="page-description">
          Analyse l'utilisation des citations et les réponses des joueurs.
        </p>
      </div>
    </header>

    <p class="demo-notice">
      <span aria-hidden="true">ⓘ</span>
      Aperçu avec données fictives : aucune statistique réelle n'est chargée.
    </p>

    <!-- CARTES RÉCAPITULATIVES -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon mint" aria-hidden="true">↻</div>
        <p class="stat-label">Utilisations</p>
        <p class="stat-value">{{ totalUses.toLocaleString('fr-BE') }}</p>
        <p class="stat-detail">Sur les citations présentées</p>
      </article>

      <article class="stat-card">
        <div class="stat-icon yellow" aria-hidden="true">◎</div>
        <p class="stat-label">Taux de réussite moyen</p>
        <p class="stat-value">{{ successRate.toLocaleString('fr-BE') }} %</p>
        <p class="stat-detail">Sur les réponses évaluées</p>
      </article>

      <article class="stat-card">
        <div class="stat-icon mint" aria-hidden="true">✓</div>
        <p class="stat-label">Bonnes réponses</p>
        <p class="stat-value">{{ totalCorrect.toLocaleString('fr-BE') }}</p>
        <p class="stat-detail">Réponses correctes</p>
      </article>

      <article class="stat-card">
        <div class="stat-icon coral" aria-hidden="true">✕</div>
        <p class="stat-label">Mauvaises réponses</p>
        <p class="stat-value">{{ totalIncorrect.toLocaleString('fr-BE') }}</p>
        <p class="stat-detail">Réponses incorrectes</p>
      </article>
    </div>

    <!-- TABLEAU -->
    <section class="table-card">
      <div class="table-heading">
        <div>
          <h2>Détail par citation</h2>
          <p>Compare les citations les plus utilisées et les plus difficiles.</p>
        </div>

        <span class="result-count">
          {{ filteredQuotes.length }}
          résultat{{ filteredQuotes.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- RECHERCHE ET FILTRES -->
      <div class="filters">
        <label class="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            v-model="search"
            type="search"
            placeholder="Rechercher une citation ou un film..."
            aria-label="Rechercher une citation ou un film"
          />
        </label>

        <select v-model="selectedFilter" aria-label="Filtrer les citations">
          <option value="all">Toutes les citations</option>
          <option value="easy">Faciles : réussite ≥ 70 %</option>
          <option value="difficult">Difficiles : réussite &lt; 50 %</option>
        </select>

        <select v-model="sortBy" aria-label="Trier les citations">
          <option value="uses">Plus utilisées</option>
          <option value="success-asc">Taux de réussite croissant</option>
          <option value="success-desc">Taux de réussite décroissant</option>
        </select>
      </div>

      <!-- DONNÉES -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Citation / film</th>
              <th>Utilisations</th>
              <th>Bonnes réponses</th>
              <th>Mauvaises réponses</th>
              <th>Taux de réussite</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="quote in filteredQuotes" :key="quote.id">
              <td class="quote-cell">
                <strong>« {{ quote.text }} »</strong>
                <span>{{ quote.movie }}</span>
              </td>

              <td class="number-cell">{{ quote.uses }}</td>
              <td class="number-cell correct-cell">{{ quote.correct }}</td>
              <td class="number-cell incorrect-cell">{{ quote.incorrect }}</td>

              <td class="rate-cell">
                <div class="rate-label">
                  <strong>{{ getSuccessRate(quote) }} %</strong>
                </div>

                <div
                  class="progress-track"
                  role="progressbar"
                  :aria-valuenow="getSuccessRate(quote)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`Taux de réussite : ${getSuccessRate(quote)} %`"
                >
                  <div
                    class="progress-fill"
                    :class="{
                      difficult: getSuccessRate(quote) < 50,
                      medium:
                        getSuccessRate(quote) >= 50 &&
                        getSuccessRate(quote) < 70,
                    }"
                    :style="{ width: `${getSuccessRate(quote)}%` }"
                  ></div>
                </div>
              </td>
            </tr>

            <tr v-if="filteredQuotes.length === 0">
              <td colspan="5" class="empty-state">
                Aucune citation ne correspond à ces critères.
                <button type="button" @click="resetFilters">
                  Réinitialiser les filtres
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>


<style scoped>
/* ========================================
   PAGE ET EN-TÊTE
======================================== */

.statistics-page {
  width: 100%;
  min-width: 0;
  color: #212121;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #52796F;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.page-header h1 {
  margin: 0;
}

.page-description {
  margin: 10px 0 0;
  color: #777D79;
  font-size: 14px;
  line-height: 1.6;
}

/* ========================================
   AVERTISSEMENT DONNÉES DE DÉMONSTRATION
======================================== */

.demo-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 24px;
  padding: 13px 16px;
  border: 1px solid #E8D6A6;
  border-radius: 9px;
  background: #FFF8E7;
  color: #806000;
  font-size: 12px;
  line-height: 1.6;
}

/* ========================================
   CARTES STATISTIQUES
======================================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #E5E0D6;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgb(33 33 33 / 4%);
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  border-radius: 12px;
  font-size: 23px;
  font-weight: 700;
}

.stat-icon.mint {
  background: #E7F0EC;
  color: #52796F;
}

.stat-icon.yellow {
  background: #FFF3D2;
  color: #806000;
}

.stat-icon.coral {
  background: #FCE8E6;
  color: #B8403B;
}

.stat-label {
  margin: 0 0 8px;
  color: #6B706D;
  font-size: 13px;
  line-height: 1.5;
}

.stat-value {
  margin: 0;
  color: #212121;
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 700;
  overflow-wrap: anywhere;
  font-variant-numeric: tabular-nums;
}

.stat-detail {
  margin: 9px 0 0;
  color: #777D79;
  font-size: 11px;
  line-height: 1.5;
}

/* ========================================
   CARTE PRINCIPALE
======================================== */

.table-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid #E5E0D6;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgb(33 33 33 / 4%);
}

.table-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.table-heading h2 {
  margin: 0;
  color: #212121;
  font-size: 17px;
  font-weight: 700;
}

.table-heading p {
  margin: 7px 0 0;
  color: #777D79;
  font-size: 13px;
  line-height: 1.5;
}

.result-count {
  flex-shrink: 0;
  padding: 7px 10px;
  border: 1px solid #E5E0D6;
  border-radius: 6px;
  background: #FAF9F5;
  color: #6B706D;
  font-size: 11px;
}

/* ========================================
   RECHERCHE ET FILTRES
======================================== */

.filters {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, auto) minmax(180px, auto);
  gap: 12px;
  margin-bottom: 22px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid #DEDCD3;
  border-radius: 9px;
  background: #FAF9F5;
  color: #52796F;
  font-size: 20px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-field:focus-within {
  border-color: #739C91;
  box-shadow: 0 0 0 3px rgb(115 156 145 / 15%);
}

.search-field input {
  width: 100%;
  min-width: 0;
  padding: 13px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #212121;
  font: inherit;
  font-size: 13px;
}

.search-field input::placeholder {
  color: #929792;
}

.filters select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid #DEDCD3;
  border-radius: 9px;
  outline: none;
  background: #FAF9F5;
  color: #212121;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filters select:focus {
  border-color: #739C91;
  box-shadow: 0 0 0 3px rgb(115 156 145 / 15%);
}

/* ========================================
   TABLEAU
======================================== */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #EAE7DF;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: #F7F4EA;
}

th {
  padding: 15px 16px;
  border-bottom: 1px solid #E5E0D6;
  color: #666D68;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

td {
  padding: 17px 16px;
  border-bottom: 1px solid #F0EEE7;
  color: #343835;
  font-size: 13px;
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: #F9FAF6;
}

/* ========================================
   CONTENU DES CELLULES
======================================== */

.quote-cell {
  min-width: 220px;
  max-width: 350px;
}

.quote-cell strong,
.quote-cell span {
  display: block;
}

.quote-cell strong {
  color: #212121;
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.quote-cell span {
  margin-top: 6px;
  color: #777D79;
  font-size: 11px;
}

.number-cell {
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.correct-cell {
  color: #42675D;
  font-weight: 700;
}

.incorrect-cell {
  color: #B8403B;
  font-weight: 700;
}

.rate-cell {
  min-width: 125px;
}

.rate-label {
  margin-bottom: 8px;
  color: #343835;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ========================================
   BARRE DE TAUX DE RÉUSSITE
======================================== */

.progress-track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 10px;
  background: #EAE7DF;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #739C91;
  transition: width 0.25s ease;
}

.progress-fill.medium {
  background: #D6A83D;
}

.progress-fill.difficult {
  background: #D9534F;
}

/* ========================================
   AUCUN RÉSULTAT
======================================== */

.empty-state {
  padding: 38px 16px;
  color: #777D79;
  text-align: center;
  line-height: 1.8;
}

.empty-state button {
  display: block;
  margin: 12px auto 0;
  padding: 9px 13px;
  border: none;
  border-radius: 6px;
  background: #E7F0EC;
  color: #42675D;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.empty-state button:hover {
  background: #D7E7DF;
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .search-field {
    grid-column: auto;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 13px;
  }

  .table-card {
    padding: 16px;
  }

  .table-heading {
    flex-direction: column;
  }

  .th,
  th,
  td {
    padding: 13px 11px;
  }
}

@media (max-width: 420px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .stat-icon {
    flex-shrink: 0;
    margin: 0;
  }

  .stat-content {
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
