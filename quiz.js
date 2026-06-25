(function () {
  'use strict';

  /* ============================================================
     ENVOI DES RÉSULTATS PAR COURRIEL — FORMSUBMIT
     Chaque quiz complété envoie un courriel à l'adresse ci-dessous.
     Aucune configuration supplémentaire requise.
  ============================================================ */
  var QUIZ_EMAIL = 'elisecc@orientationetcoaching.com';

  function submitQuizResultsToSheet(payload) {
    if (!QUIZ_EMAIL) return;
    try {
      fetch('https://formsubmit.co/ajax/' + QUIZ_EMAIL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject:  'Quiz — ' + payload.profileTitle,
          _captcha:  'false',
          Profil:    payload.profileTitle,
          Resultat:  payload.result,
          Date:      payload.timestamp,
          Reponses:  Array.isArray(payload.answers) ? payload.answers.join(' | ') : payload.answers,
          Scores:    'Orientation:' + payload.scores.voie +
                     ' Transition:' + payload.scores.clarifier +
                     ' Emploi:' + payload.scores.emploi,
          Page:      payload.pageUrl
        })
      }).catch(function () {});
    } catch (err) {
      // Ne jamais bloquer l'affichage du résultat
    }
  }

  /* ============================================================
     QUESTIONS
  ============================================================ */
  const QUESTIONS = [
    {
      text: "En ce moment, comment vous sentez-vous par rapport à votre carrière ?",
      options: [
        { text: "Perdu·e ou mélangé·e", program: 'voie' },
        { text: "En réflexion sur un changement important", program: 'clarifier' },
        { text: "Bloqué·e dans ma transition professionnelle", program: 'clarifier' },
        { text: "Motivé·e mais en difficulté dans ma recherche d'emploi", program: 'emploi' }
      ]
    },
    {
      text: "À quel point avez-vous l'impression de bien vous connaître professionnellement ?",
      options: [
        { text: "Très peu", program: 'voie' },
        { text: "Un peu, mais plusieurs choses restent floues", program: 'voie' },
        { text: "Assez bien", program: 'clarifier' },
        { text: "Très bien", program: 'emploi' }
      ]
    },
    {
      text: "Qu'est-ce qui vous manque le plus actuellement ?",
      options: [
        { text: "Comprendre ce qui me correspond réellement", program: 'voie' },
        { text: "Clarifier mes options professionnelles", program: 'clarifier' },
        { text: "Un plan concret pour avancer", program: 'clarifier' },
        { text: "De meilleurs outils pour trouver un emploi", program: 'emploi' }
      ]
    },
    {
      text: "Qu'est-ce qui vous bloque le plus actuellement ?",
      options: [
        { text: "Je manque de clarté dans ma carrière", program: 'voie' },
        { text: "La peur de faire le mauvais choix", program: 'clarifier' },
        { text: "Le manque de structure ou de motivation", program: 'clarifier' },
        { text: "Le manque de réponses des employeurs", program: 'emploi' }
      ]
    },
    {
      text: "À quel point votre objectif professionnel est-il clair actuellement ?",
      options: [
        { text: "Pas clair du tout", program: 'voie' },
        { text: "Partiellement clair", program: 'voie' },
        { text: "Assez clair", program: 'clarifier' },
        { text: "Très clair", program: 'emploi' }
      ]
    },
    {
      text: "Quel type d'aide vous aiderait le plus ?",
      options: [
        { text: "Une démarche pour mieux me comprendre", program: 'voie' },
        { text: "Un accompagnement pour clarifier ma direction", program: 'clarifier' },
        { text: "Une structure pour passer à l'action", program: 'clarifier' },
        { text: "Des outils pratiques pour décrocher un emploi", program: 'emploi' }
      ]
    },
    {
      text: "Si vous pouviez régler UNE chose aujourd'hui, ce serait de…",
      options: [
        { text: "Comprendre ce qui me correspond vraiment", program: 'voie' },
        { text: "Savoir quelle direction choisir", program: 'clarifier' },
        { text: "Arrêter de tourner en rond", program: 'clarifier' },
        { text: "Obtenir plus d'entrevues", program: 'emploi' }
      ]
    },
  ];

  /* ============================================================
     RÉSULTATS
  ============================================================ */
  const RESULTS = {
    voie: {
      profileTitle: "En réflexion professionnelle",
      emotionalIntro: "Vous semblez être dans une période où quelque chose ne vous convient plus professionnellement, mais où il peut encore être difficile d'identifier exactement ce qui devrait changer.",
      emotionalBulletPrelude: "Vous ressentez peut-être :",
      emotionalBullets: [
        "un manque de clarté",
        "une perte de motivation",
        "l'impression d'être un peu perdu·e",
        "ou le besoin de mieux comprendre ce qui vous correspond réellement."
      ],
      emotionalClose: "La bonne nouvelle : vous n'avez pas besoin d'avoir toutes les réponses immédiatement.",
      demarcheName: "Démarche d'orientation et clarification professionnelle",
      benefits: [
        "mieux comprendre vos intérêts et vos valeurs",
        "clarifier ce qui vous motive réellement",
        "identifier des pistes professionnelles cohérentes",
        "retrouver une direction plus alignée avec qui vous êtes aujourd'hui"
      ],
      complementary: [
        { name: "Transition professionnelle", desc: "Structurer un changement de direction et passer à l'action." },
        { name: "Recherche d'emploi, CV et entrevues", desc: "Optimiser votre positionnement et votre stratégie d'emploi." }
      ],
      accentHex: "#1E4A4C",
      serviceAnchor: '#service-orientation'
    },
    clarifier: {
      profileTitle: "En transition professionnelle",
      emotionalIntro: "Vous semblez être dans une phase où vous savez probablement qu'un changement est nécessaire, mais où il peut être difficile de savoir exactement comment avancer.",
      emotionalBulletPrelude: "Vous réfléchissez peut-être depuis longtemps, mais :",
      emotionalBullets: [
        "vous hésitez entre plusieurs options",
        "vous avez peur de faire le mauvais choix",
        "ou vous avez de la difficulté à transformer votre réflexion en actions concrètes."
      ],
      emotionalClose: "Vous n'avez probablement pas besoin de repartir à zéro, mais plutôt de clarifier vos prochaines étapes et structurer votre transition.",
      demarcheName: "Démarche de transition professionnelle",
      benefits: [
        "clarifier vos options",
        "structurer votre transition",
        "prendre des décisions plus alignées",
        "construire un plan concret",
        "avancer avec davantage de confiance et de clarté"
      ],
      complementary: [
        { name: "Orientation et clarification professionnelle", desc: "Mieux comprendre ce qui vous correspond réellement." },
        { name: "Recherche d'emploi, CV et entrevues", desc: "Optimiser votre positionnement et votre recherche d'emploi." }
      ],
      accentHex: "#0B2B33",
      serviceAnchor: '#service-transition'
    },
    emploi: {
      profileTitle: "Prêt·e à passer à l'action",
      emotionalIntro: "Vous semblez avoir une direction relativement claire, mais certains outils ou stratégies pourraient être optimisés pour augmenter vos résultats.",
      emotionalBulletPrelude: "Vous pourriez surtout bénéficier :",
      emotionalBullets: [
        "d'un meilleur positionnement",
        "d'une stratégie plus efficace",
        "d'outils plus solides",
        "ou d'une meilleure préparation pour vous démarquer auprès des employeurs."
      ],
      emotionalClose: "",
      demarcheName: "Démarche de recherche d'emploi, CV et entrevues",
      benefits: [
        "optimiser votre CV",
        "améliorer vos entrevues",
        "structurer efficacement votre recherche d'emploi",
        "développer une stratégie plus performante",
        "augmenter vos chances d'obtenir un emploi aligné avec vos objectifs"
      ],
      complementary: [
        { name: "Orientation et clarification professionnelle", desc: "Clarifier ce qui vous correspond réellement." },
        { name: "Transition professionnelle", desc: "Structurer un changement de direction et transformer votre réflexion en plan concret." }
      ],
      accentHex: "#0B2B33",
      serviceAnchor: '#service-emploi'
    }
  };

  /* ============================================================
     TIE-BREAKING
  ============================================================ */
  function resolveWinner(scores) {
    const max  = Math.max(scores.voie, scores.clarifier, scores.emploi);
    const tied = Object.keys(scores).filter(k => scores[k] === max);
    if (tied.length === 1) return tied[0];
    if (tied.includes('clarifier')) return 'clarifier';
    if (tied.includes('voie')) return 'voie';
    return 'emploi';
  }

  /* ============================================================
     QUIZ CLASS
  ============================================================ */
  class Quiz {
    constructor() {
      this.current      = 0;
      this.scores       = { voie: 0, clarifier: 0, emploi: 0 };
      this.selected     = null;
      this.answers      = [];
      this.resultKey    = null;

      this.$card       = document.getElementById('quiz-card');
      this.$resultCard = document.getElementById('quiz-result-card');
      this.$fill       = document.getElementById('quiz-progress-fill');
      this.$label      = document.getElementById('quiz-progress-label');
      this.$pct        = document.getElementById('quiz-progress-pct');
      this.$body       = document.getElementById('quiz-body');
      this.$question   = document.getElementById('quiz-question-text');
      this.$options    = document.getElementById('quiz-options');
      this.$next       = document.getElementById('quiz-next-btn');
      this.$btnLabel   = this.$next.querySelector('.quiz-btn-label');

      this.$next.addEventListener('click', () => this.advance());
      this.renderQuestion();
    }

    renderQuestion() {
      const q     = QUESTIONS[this.current];
      const num   = this.current + 1;
      const total = QUESTIONS.length;
      const pct   = Math.round((num / total) * 100);

      this.$fill.style.width = pct + '%';
      this.$label.textContent = `Question ${num} / ${total}`;
      this.$pct.textContent   = pct + ' %';

      this.$next.disabled = true;
      this.$btnLabel.textContent =
        this.current === total - 1 ? 'Voir mon résultat' : 'Question suivante';

      if (this.current === 0) {
        this.fillQuestion(q);
      } else {
        this.$body.classList.add('q-exit');
        setTimeout(() => {
          this.fillQuestion(q);
          this.$body.classList.remove('q-exit');
          this.$body.classList.add('q-enter');
          setTimeout(() => this.$body.classList.remove('q-enter'), 380);
        }, 260);
      }
    }

    fillQuestion(q) {
      this.$question.textContent = q.text;
      this.$options.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];
      this.selected = null;

      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-option';
        btn.setAttribute('aria-pressed', 'false');
        btn.innerHTML =
          `<span class="q-letter" aria-hidden="true">${labels[i]}</span>` +
          `<span class="q-text">${opt.text}</span>`;
        btn.addEventListener('click', () => this.pick(i, btn));
        this.$options.appendChild(btn);
      });
    }

    pick(index, btn) {
      this.$options.querySelectorAll('.q-option').forEach(b => {
        b.classList.remove('q-selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('q-selected');
      btn.setAttribute('aria-pressed', 'true');
      this.selected = index;
      this.$next.disabled = false;
    }

    advance() {
      if (this.selected === null) return;
      const q   = QUESTIONS[this.current];
      const opt = q.options[this.selected];
      this.scores[opt.program]++;
      this.answers.push(opt.text);
      this.current++;

      if (this.current >= QUESTIONS.length) {
        this.resultKey = resolveWinner(this.scores);
        this.showResult();
      } else {
        this.renderQuestion();
      }
    }

    showResult() {
      const data = RESULTS[this.resultKey];

      // ── Envoyer les résultats vers Google Sheets ──────────────
      submitQuizResultsToSheet({
        timestamp:    new Date().toLocaleString('fr-CA'),
        result:       this.resultKey,
        profileTitle: data.profileTitle,
        answers:      this.answers,
        scores:       this.scores,
        pageUrl:      window.location.href,
        userAgent:    navigator.userAgent
      });

      this.$fill.style.width  = '100%';
      this.$label.textContent = 'Votre résultat est prêt ✓';
      this.$pct.textContent   = '100 %';

      this.$card.classList.add('q-fade-out');
      setTimeout(() => {
        this.$card.hidden = true;
        this.$resultCard.hidden = false;
        this.$resultCard.innerHTML = this.buildResult(data);
        this.$resultCard.classList.add('q-fade-in');

        setTimeout(() => {
          const top = this.$resultCard.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 150);
      }, 300);
    }

    buildResult(data) {
      const benefits = data.benefits
        .map(b => `<li><span class="res-check" aria-hidden="true">✓</span>${b}</li>`)
        .join('');

      const comp = data.complementary.map(c => `
        <div class="res-comp-card">
          <p class="res-comp-name">${c.name}</p>
          <p class="res-comp-desc">${c.desc}</p>
        </div>`).join('');

      const bullets = data.emotionalBullets
        ? `<p class="res-bullet-prelude">${data.emotionalBulletPrelude}</p>
           <ul class="res-emotional-list">
             ${data.emotionalBullets.map(b => `<li>${b}</li>`).join('')}
           </ul>`
        : '';

      const close = data.emotionalClose
        ? `<p class="res-em-close">${data.emotionalClose}</p>`
        : '';

      return `
        <div class="res-profile">
          <span class="res-eyebrow">Votre profil actuel</span>
          <h3 class="res-title">${data.profileTitle}</h3>
        </div>

        <div class="res-emotional">
          <p>${data.emotionalIntro}</p>
          ${bullets}
          ${close}
        </div>

        <div class="res-primary" style="--res-accent:${data.accentHex}">
          <span class="res-badge">Démarche recommandée</span>
          <h4 class="res-prog-name">${data.demarcheName}</h4>
          <p class="res-prog-intro">Une démarche personnalisée pour vous aider à&nbsp;:</p>
          <ul class="res-benefits">${benefits}</ul>
          <a href="https://calendar.app.google/p2xCZ4nW8L9GJ8X77" target="_blank" rel="noopener" class="btn res-cta-btn">Première rencontre gratuite (30 min.)</a>
        </div>

        <div class="res-comp-section">
          <p class="res-comp-label">Autres démarches possibles</p>
          <div class="res-comp-grid">${comp}</div>
        </div>`;
    }
  }

  /* ============================================================
     INIT
  ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('quiz-card')) return;

    new Quiz();

    const teaserBtn = document.getElementById('quiz-teaser-btn');
    if (teaserBtn) {
      teaserBtn.addEventListener('click', () => {
        document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
})();
