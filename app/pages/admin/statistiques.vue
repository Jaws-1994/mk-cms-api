
<script setup>
<<<<<<< HEAD
import { ref, computed, onMounted } from 'vue'
=======
import { ref, computed } from 'vue'
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b

definePageMeta({
  layout: 'admin',
})

// ========================================
<<<<<<< HEAD
// ÉTAT DE LA PAGE
// ========================================

const quotes = ref([])
const search = ref('')
const sortBy = ref('times_asked')
const isLoading = ref(true)
const errorMessage = ref('')

// ========================================
// CHARGEMENT DES CITATIONS
// ========================================

const loadQuotes = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = sessionStorage.getItem('movieKingAdminToken')

    if (!token) {
      throw new Error('Session administrateur introuvable. Reconnecte-toi.')
    }

    const response = await $fetch('/api/admin/quotes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    quotes.value = response.quotes || []
  } catch (error) {
    errorMessage.value =
      error.data?.statusMessage ||
      error.message ||
      'Impossible de charger les statistiques.'
  } finally {
    isLoading.value = false
  }
}

// ========================================
// CALCUL DES STATISTIQUES GLOBALES
// ========================================

const totalQuotes = computed(() => quotes.value.length)

const totalAsked = computed(() =>
  quotes.value.reduce(
    (total, quote) => total + Number(quote.times_asked || 0),
    0,
  ),
)

const totalCorrect = computed(() =>
  quotes.value.reduce(
    (total, quote) => total + Number(quote.correct_count || 0),
    0,
  ),
)

const totalIncorrect = computed(() =>
  quotes.value.reduce(
    (total, quote) => total + Number(quote.incorrect_count || 0),
    0,
  ),
)

const successRate = computed(() => {
  const evaluatedAnswers = totalCorrect.value + totalIncorrect.value

  if (evaluatedAnswers === 0) return 0

  return Math.round((totalCorrect.value / evaluatedAnswers) * 100)
})

// ========================================
// RECHERCHE ET TRI
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
// ========================================

const filteredQuotes = computed(() => {
  const searchText = search.value.toLowerCase().trim()

<<<<<<< HEAD
  return quotes.value
    .filter((quote) => {
      return (
        !searchText ||
        (quote.quote_text || '').toLowerCase().includes(searchText) ||
        (quote.movie_title || '').toLowerCase().includes(searchText)
      )
    })
 .sort((a, b) => {
  if (sortBy.value === 'times_asked_asc') {
    return Number(a.times_asked || 0) - Number(b.times_asked || 0)
  }

  if (sortBy.value === 'success_asc') {
    return getSuccessRate(a) - getSuccessRate(b)
  }

  if (sortBy.value === 'success_desc') {
    return getSuccessRate(b) - getSuccessRate(a)
  }

  if (sortBy.value === 'incorrect_count') {
    return Number(b.incorrect_count || 0) - Number(a.incorrect_count || 0)
  }

  return Number(b.times_asked || 0) - Number(a.times_asked || 0)
})
})

function getSuccessRate(quote) {
  const correct = Number(quote.correct_count || 0)
  const incorrect = Number(quote.incorrect_count || 0)
  const total = correct + incorrect

  if (total === 0) return 0

  return (correct / total) * 100
}

onMounted(() => {
  loadQuotes()
})
</script>

<template>
  <section class="page-content stats-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">MOVIE KING / ANALYSE</p>
        <h1>Statistiques des citations</h1>
        <p class="page-description">
          Analyse les bonnes et mauvaises réponses pour chaque citation.
        </p>
      </div>

      <button
        class="refresh-button"
        type="button"
        :disabled="isLoading"
        @click="loadQuotes"
      >
        ↻ {{ isLoading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </header>

    <div v-if="errorMessage" class="feedback error" role="alert">
      <p>{{ errorMessage }}</p>
      <button class="retry-button" type="button" @click="loadQuotes">
        Réessayer
      </button>
    </div>

    <div v-else-if="isLoading" class="feedback">
      Chargement des statistiques...
    </div>

    <template v-else>
      <div class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon">❝</div>
          <div>
            <p class="summary-label">Citations enregistrées</p>
            <p class="summary-number">{{ totalQuotes }}</p>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon">↻</div>
          <div>
            <p class="summary-label">Questions posées</p>
            <p class="summary-number">{{ totalAsked }}</p>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon correct-icon">✓</div>
          <div>
            <p class="summary-label">Bonnes réponses</p>
            <p class="summary-number">{{ totalCorrect }}</p>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon incorrect-icon">✕</div>
          <div>
            <p class="summary-label">Mauvaises réponses</p>
            <p class="summary-number">{{ totalIncorrect }}</p>
          </div>
        </article>
      </div>

      <article class="rate-card">
        <div>
          <p class="summary-label">Taux de réussite global</p>
          <p class="rate-number">{{ successRate }} %</p>
          <p class="rate-description">
            {{ totalCorrect }} bonnes réponses sur
            {{ totalCorrect + totalIncorrect }} réponses évaluées.
          </p>
        </div>

        <div
          class="rate-track"
          role="progressbar"
          :aria-valuenow="successRate"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Taux de réussite global"
        >
          <div class="rate-fill" :style="{ width: `${successRate}%` }"></div>
        </div>
      </article>

      <article class="table-card">
        <div class="filters">
          <div class="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              v-model="search"
              type="search"
              placeholder="Rechercher une citation ou un film..."
              aria-label="Rechercher une citation ou un film"
            />
          </div>

          <select v-model="sortBy" class="sort-filter" aria-label="Trier les citations">
            <option value="times_asked">Plus proposées</option>
            <option value="incorrect_count">Plus de mauvaises réponses</option>
            <option value="success_asc">Taux de réussite croissant</option>
            <option value="success_desc">Taux de réussite décroissant</option>
            <option value="times_asked_asc">Moins proposées</option>
          </select>
        </div>

        <div class="table-header">
          <h2>Détail par citation</h2>
          <span class="result-count">
            {{ filteredQuotes.length }} résultat(s)
          </span>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Citation / Film</th>
                <th>Proposée</th>
                <th>Bonnes réponses</th>
                <th>Mauvaises réponses</th>
                <th>Réussite</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="quote in filteredQuotes" :key="quote.ID_quote">
                <td class="quote-cell">
                  <strong>{{ quote.quote_text || 'Citation sans texte' }}</strong>
                  <span class="movie-name">{{ quote.movie_title || 'Film inconnu' }}</span>
                </td>

                <td>{{ Number(quote.times_asked || 0) }}</td>

                <td>
                  <span class="count-badge correct-badge">
                    {{ Number(quote.correct_count || 0) }}
                  </span>
                </td>

                <td>
                  <span class="count-badge incorrect-badge">
                    {{ Number(quote.incorrect_count || 0) }}
                  </span>
                </td>

                <td class="rate-cell">
                  <strong>{{ Math.round(getSuccessRate(quote)) }} %</strong>
                  <div class="mini-track">
                    <div
                      class="mini-fill"
                      :class="{ difficult: getSuccessRate(quote) < 50 }"
                      :style="{ width: `${getSuccessRate(quote)}%` }"
                    ></div>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredQuotes.length === 0">
                <td colspan="5" class="empty-state">
                  Aucune citation ne correspond à ta recherche.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
.stats-page {
  width: 100%;
  min-width: 0;
  padding: 1px;
  box-sizing: border-box;
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
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
<<<<<<< HEAD
  font-size: 28px;
=======
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
}

.page-description {
  margin: 10px 0 0;
<<<<<<< HEAD
  color: #ff626b;
=======
  color: #777D79;
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  font-size: 14px;
  line-height: 1.6;
}

<<<<<<< HEAD
.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  border: 1px solid #739C91;
  border-radius: 9px;
  background: #739C91;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.refresh-button:hover:not(:disabled) {
  background: #52796F;
}

.refresh-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card,
.rate-card,
.table-card {
  border: 1px solid #E5E0D6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 12px rgb(33 33 33 / 4%);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
  padding: 20px;
}

.summary-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #E7F0EC;
  color: #52796F;
  font-size: 23px;
}

.correct-icon {
  background: #E7F0EC;
  color: #287653;
}

.incorrect-icon {
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  background: #FCE8E6;
  color: #B8403B;
}

<<<<<<< HEAD
.summary-label {
  margin: 0 0 6px;
  color: #6B706D;
  font-size: 12px;
}

.summary-number {
  margin: 0;
  font-size: 25px;
  font-weight: 700;
}

.rate-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 24px;
  padding: 24px;
}

.rate-number {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
}

.rate-description {
  margin: 8px 0 0;
  color: #777D79;
  font-size: 12px;
}

.rate-track,
.mini-track {
  overflow: hidden;
  border-radius: 99px;
  background: #EAE7DF;
}

.rate-track {
  width: 42%;
  height: 12px;
}

.rate-fill,
.mini-fill {
  height: 100%;
  border-radius: inherit;
  background: #739C91;
  transition: width 0.25s ease;
}

.table-card {
  padding: 24px;
}

.filters {
  display: flex;
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  gap: 12px;
  margin-bottom: 22px;
}

.search-field {
  display: flex;
  align-items: center;
<<<<<<< HEAD
  flex: 1;
  min-width: 0;
  padding-left: 14px;
  border: 1px solid #DEDCD3;
  border-radius: 9px;
  background: #FAF9F5;
}

.search-field:focus-within,
.sort-filter:focus {
  border-color: #739C91;
  outline: 2px solid rgb(115 156 145 / 15%);
}

.search-field > span {
  color: #6B706D;
  font-size: 23px;
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
}

.search-field input {
  width: 100%;
  min-width: 0;
<<<<<<< HEAD
  padding: 13px 14px 13px 10px;
  border: none;
=======
  padding: 13px 0;
  border: 0;
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  outline: none;
  background: transparent;
  color: #212121;
  font: inherit;
  font-size: 13px;
}

<<<<<<< HEAD
.sort-filter {
  width: 240px;
  max-width: 100%;
  padding: 13px 14px;
  border: 1px solid #DEDCD3;
  border-radius: 9px;
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  background: #FAF9F5;
  color: #212121;
  font: inherit;
  font-size: 13px;
<<<<<<< HEAD
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.table-header h2 {
  margin: 0;
  font-size: 17px;
  color: #212121;
}

.result-count {
  color: #777D79;
  font-size: 12px;
}

.table-wrapper {
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
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
<<<<<<< HEAD
  letter-spacing: 0.4px;
=======
  letter-spacing: 0.5px;
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  text-transform: uppercase;
  white-space: nowrap;
}

td {
<<<<<<< HEAD
  padding: 15px 16px;
  border-bottom: 1px solid #F0EEE7;
=======
  padding: 17px 16px;
  border-bottom: 1px solid #F0EEE7;
  color: #343835;
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  font-size: 13px;
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

<<<<<<< HEAD
=======
tbody tr {
  transition: background 0.15s ease;
}

>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
tbody tr:hover {
  background: #F9FAF6;
}

<<<<<<< HEAD
.quote-cell {
  min-width: 230px;
  max-width: 380px;
  overflow-wrap: anywhere;
}

.quote-cell strong,
.movie-name {
  display: block;
}

.movie-name {
  margin-top: 5px;
  color: #777D79;
  font-size: 12px;
}

.count-badge {
  display: inline-block;
  min-width: 22px;
  padding: 5px 8px;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
}

.correct-badge {
  background: #E7F0EC;
  color: #287653;
}

.incorrect-badge {
  background: #FCE8E6;
  color: #B8403B;
}

.rate-cell {
  min-width: 100px;
}

.mini-track {
  width: 72px;
  height: 5px;
  margin-top: 7px;
}

.mini-fill.difficult {
  background: #D9534F;
}

.empty-state {
  padding: 35px;
  color: #777D79;
  text-align: center;
}

.feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 150px;
  padding: 24px;
  border: 1px solid #E5E0D6;
  border-radius: 14px;
  background: #fff;
  color: #6B706D;
  font-size: 13px;
  text-align: center;
}

.feedback.error {
  color: #B8403B;
}

.retry-button {
  padding: 9px 13px;
  border: 1px solid #D9534F;
  border-radius: 7px;
  background: #fff;
  color: #B8403B;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

<<<<<<< HEAD
  .refresh-button {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 16px;
  }

  .rate-card {
    align-items: stretch;
    flex-direction: column;
  }

  .rate-track {
    width: 100%;
  }

  .filters {
    flex-direction: column;
  }

  .sort-filter {
    width: 100%;
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
  }

  .table-card {
    padding: 16px;
  }

<<<<<<< HEAD
  .table-header {
    align-items: flex-start;
    flex-direction: column;
  }
=======
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
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
<<<<<<< HEAD
=======
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
>>>>>>> 1fc8812b0833ad938518207bfff2809b1089249b
    transition-duration: 0.01ms !important;
  }
}
</style>
