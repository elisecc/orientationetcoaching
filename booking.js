(function () {
  'use strict';

  /*
  ================================================================
  RÉSERVATION — CONFIGURATION
  ================================================================
  Pour enregistrer les réservations, coller l'URL ci-dessous
  (Formspree ou Google Apps Script).

  Exemple Google Apps Script (script.google.com) :

    function doPost(e) {
      var data = JSON.parse(e.postData.contents);
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow([
        data.date, data.heure,
        data.prenom, data.nom, data.courriel, data.telephone,
        data.pays, data.adresse, data.ville, data.code_postal,
        data.date_naissance, data.sexe, data.motif
      ]);
      MailApp.sendEmail({
        to: 'elisecc@orientationetcoaching.com',
        subject: 'Nouvelle réservation — ' + data.prenom + ' ' + data.nom,
        body: 'Date : ' + data.date + ' à ' + data.heure +
              '\nNom : ' + data.prenom + ' ' + data.nom +
              '\nCourriel : ' + data.courriel +
              '\nTéléphone : ' + data.telephone +
              '\nPays : ' + data.pays +
              '\nAdresse : ' + data.adresse + ', ' + data.ville + ' ' + data.code_postal +
              '\nNaissance : ' + data.date_naissance +
              '\nSexe : ' + data.sexe +
              '\nMotif : ' + data.motif
      });
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  Déployer → Application Web → Accès : Tout le monde
  ================================================================ */
  var BOOKING_URL = ''; // ← coller l'URL ici

  /* Plages horaires disponibles (lundi–vendredi) */
  var SLOTS = ['9h00', '10h00', '11h00', '14h00', '15h00', '16h00'];

  /* ============================================================
     ÉTAT
  ============================================================ */
  var selectedDate = null;
  var selectedTime = null;
  var calYear, calMonth;

  var MONTHS_FR = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  var DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  /* ============================================================
     RÉFÉRENCES DOM
  ============================================================ */
  var overlay, calContainer, timesContainer, timesGrid, proceedBtn;
  var pane1, pane2, pane3, bookingForm, confirmDateEl;

  /* ============================================================
     INITIALISATION
  ============================================================ */
  function init() {
    overlay = document.getElementById('booking-overlay');
    if (!overlay) return;

    calContainer   = document.getElementById('bcal-container');
    timesContainer = document.getElementById('btimes-container');
    timesGrid      = document.getElementById('btimes-grid');
    proceedBtn     = document.getElementById('booking-proceed-btn');
    pane1          = document.getElementById('bpane-1');
    pane2          = document.getElementById('bpane-2');
    pane3          = document.getElementById('bpane-3');
    bookingForm    = document.getElementById('booking-form');
    confirmDateEl  = document.getElementById('booking-confirm-date');

    document.querySelectorAll('[data-booking]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openBookingModal();
      });
    });

    document.getElementById('booking-backdrop').addEventListener('click', closeModal);
    document.getElementById('booking-close').addEventListener('click', closeModal);
    document.getElementById('booking-done-btn').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeModal();
    });

    proceedBtn.addEventListener('click', goToForm);
    bookingForm.addEventListener('submit', submitBooking);
  }

  /* ============================================================
     OUVRIR / FERMER
  ============================================================ */
  function openBookingModal() {
    var now = new Date();
    calYear      = now.getFullYear();
    calMonth     = now.getMonth();
    selectedDate = null;
    selectedTime = null;

    showPane(1);
    timesContainer.hidden = true;
    proceedBtn.disabled   = true;
    overlay.hidden        = false;
    document.body.style.overflow = 'hidden';
    renderCalendar();
  }

  /* Exposé globalement pour les boutons générés par quiz.js */
  window.openBooking = openBookingModal;

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  /* ============================================================
     NAVIGATION ENTRE LES ÉTAPES
  ============================================================ */
  function showPane(n) {
    [pane1, pane2, pane3].forEach(function (p, i) {
      p.hidden = (i + 1 !== n);
    });
    overlay.querySelectorAll('.bprog-step').forEach(function (s) {
      var sn = parseInt(s.dataset.step);
      s.classList.toggle('bprog-active', sn === n);
      s.classList.toggle('bprog-done',   sn < n);
    });
    var modal = overlay.querySelector('.booking-modal');
    if (modal) modal.scrollTop = 0;
  }

  /* ============================================================
     CALENDRIER
  ============================================================ */
  function renderCalendar() {
    var today    = new Date();
    today.setHours(0, 0, 0, 0);
    var firstDay = new Date(calYear, calMonth, 1);
    var lastDay  = new Date(calYear, calMonth + 1, 0);
    var startDow = (firstDay.getDay() + 6) % 7; /* 0 = Lun */

    var prevDisabled = calYear < today.getFullYear() ||
      (calYear === today.getFullYear() && calMonth <= today.getMonth());

    var h = '<div class="bcal-nav">';
    h += '<button class="bcal-nav-btn" id="bcal-prev"' + (prevDisabled ? ' disabled' : '') + '>&#8249;</button>';
    h += '<span class="bcal-month-label">' + MONTHS_FR[calMonth] + ' ' + calYear + '</span>';
    h += '<button class="bcal-nav-btn" id="bcal-next">&#8250;</button>';
    h += '</div>';

    h += '<div class="bcal-grid">';
    DAYS_FR.forEach(function (d) { h += '<div class="bcal-lbl">' + d + '</div>'; });

    for (var i = 0; i < startDow; i++) h += '<div></div>';

    for (var d = 1; d <= lastDay.getDate(); d++) {
      var date = new Date(calYear, calMonth, d);
      var dow  = date.getDay(); /* 0=dim, 6=sam */
      var off  = date < today || dow === 0 || dow === 6;
      var sel  = !off && selectedDate !== null &&
                 selectedDate.getDate() === d &&
                 selectedDate.getMonth() === calMonth &&
                 selectedDate.getFullYear() === calYear;
      var cls  = 'bcal-cell' + (off ? ' bcal-off' : ' bcal-on') + (sel ? ' bcal-sel' : '');
      var attr = off ? '' : ' data-d="' + d + '"';
      h += '<div class="' + cls + '"' + attr + '>' + d + '</div>';
    }
    h += '</div>';
    calContainer.innerHTML = h;

    calContainer.querySelectorAll('.bcal-on').forEach(function (cell) {
      cell.addEventListener('click', function () {
        selectDate(parseInt(this.dataset.d));
      });
    });

    var prevBtn = document.getElementById('bcal-prev');
    var nextBtn = document.getElementById('bcal-next');
    if (prevBtn && !prevBtn.disabled) {
      prevBtn.addEventListener('click', function () {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        resetTimeSelection();
        renderCalendar();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        resetTimeSelection();
        renderCalendar();
      });
    }
  }

  function resetTimeSelection() {
    selectedDate = null;
    selectedTime = null;
    timesContainer.hidden = true;
    proceedBtn.disabled   = true;
  }

  function selectDate(day) {
    selectedDate = new Date(calYear, calMonth, day);
    selectedTime = null;
    proceedBtn.disabled = true;
    renderCalendar();
    renderTimes();
    timesContainer.hidden = false;
  }

  /* ============================================================
     PLAGES HORAIRES
  ============================================================ */
  function renderTimes() {
    timesGrid.innerHTML = '';
    SLOTS.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'btime-btn';
      btn.textContent = t;
      btn.addEventListener('click', function () {
        timesGrid.querySelectorAll('.btime-btn').forEach(function (b) {
          b.classList.remove('btime-sel');
        });
        btn.classList.add('btime-sel');
        selectedTime = t;
        proceedBtn.disabled = false;
      });
      timesGrid.appendChild(btn);
    });
  }

  /* ============================================================
     FORMULAIRE
  ============================================================ */
  function goToForm() {
    if (!selectedDate || !selectedTime) return;
    showPane(2);
  }

  function submitBooking(e) {
    e.preventDefault();

    var inputs = bookingForm.querySelectorAll('[required]');
    var valid  = true;
    inputs.forEach(function (inp) {
      inp.classList.remove('booking-err');
      if (!inp.value.trim()) {
        inp.classList.add('booking-err');
        valid = false;
      }
    });
    if (!valid) {
      var first = bookingForm.querySelector('.booking-err');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (BOOKING_URL) {
      var fd   = new FormData(bookingForm);
      var data = {
        date:           formatDate(selectedDate),
        heure:          selectedTime,
        prenom:         fd.get('prenom'),
        nom:            fd.get('nom'),
        courriel:       fd.get('courriel'),
        telephone:      fd.get('telephone'),
        pays:           fd.get('pays'),
        adresse:        fd.get('adresse'),
        ville:          fd.get('ville'),
        code_postal:    fd.get('code_postal'),
        date_naissance: fd.get('date_naissance'),
        sexe:           fd.get('sexe'),
        motif:          fd.get('motif')
      };
      fetch(BOOKING_URL, {
        method: 'POST',
        body:   JSON.stringify(data)
      }).catch(function () {});
    }

    if (confirmDateEl) {
      confirmDateEl.textContent = formatDate(selectedDate) + ' à ' + selectedTime;
    }
    showPane(3);
  }

  /* ============================================================
     UTILITAIRES
  ============================================================ */
  function formatDate(d) {
    var jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    var mois  = [
      'janvier','février','mars','avril','mai','juin',
      'juillet','août','septembre','octobre','novembre','décembre'
    ];
    return jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
