/* ══════════════════════════════════════════
   RAMA — script.js  (version allégée)
   ══════════════════════════════════════════ */

/* ── Date topbar ─────────────────────────── */
document.getElementById("topbar-date").textContent =
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ── Sidebar ─────────────────────────────── */
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
  const collapsed = document
    .getElementById("sidebar")
    .classList.contains("collapsed");
  document.getElementById("toggle-btn").textContent = collapsed ? "▶" : "◀";
});

/* ── Fonction générique : activer un élément dans un groupe ── */
function setActive(selector, target) {
  document
    .querySelectorAll(selector)
    .forEach((el) => el.classList.remove("active"));
  target.classList.add("active");
}

/* ── Navigation (pages) ──────────────────── */
const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  activites: "Activités",
  gantt: "Diagramme de Gantt",
  taches: "Tâches",
  agents: "Agents & Productivité",
  notifications: "Notifications",
  feedback: "Espace Feedback",
};

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(".nav-item", btn);
    setActive(".page", document.getElementById("page-" + btn.dataset.page));
    document.getElementById("page-title").textContent =
      PAGE_TITLES[btn.dataset.page];
  });
});

/* ── Fonction générique : filtrer par data-statut ─────────── */
function initFiltre(groupSelector, itemsSelector) {
  document.querySelectorAll(groupSelector + " .pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(groupSelector + " .pill", btn);
      const filtre = btn.dataset.filter;
      document.querySelectorAll(itemsSelector).forEach((el) => {
        el.classList.toggle(
          "hidden",
          filtre !== "tout" && el.dataset.statut !== filtre,
        );
      });
    });
  });
}

initFiltre("#filters-activites", ".activite-card");
initFiltre("#filters-taches", "#table-taches tbody tr");

/* ── Gantt : sélecteur ───────────────────── */
document.getElementById("gantt-select").addEventListener("change", function () {
  document
    .querySelectorAll(".gantt-block")
    .forEach((b) => b.classList.add("hidden"));
  document.getElementById("gantt-" + this.value).classList.remove("hidden");
});

/* ── Onglets Feedback ────────────────────── */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(".tab-btn", btn);
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.add("hidden"));
    document
      .getElementById("tab-" + btn.dataset.tab)
      .classList.remove("hidden");
  });
});

/* ── Étoiles ─────────────────────────────── */
document.querySelectorAll(".star-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = +btn.dataset.val;
    document
      .querySelectorAll(".star-btn")
      .forEach((b) => b.classList.toggle("active", +b.dataset.val <= val));
  });
});

/* ── Notifications : marquer lu ──────────── */
let nonLues = 2;

window.marquerLu = function (id) {
  const card = document.getElementById(id);
  card.classList.add("lu");
  card.querySelector(".btn-lu")?.remove();
  card
    .querySelector(".notif-card-meta")
    .insertAdjacentHTML("beforeend", '<span class="lu-tag">✓ Lu</span>');
  nonLues = Math.max(0, nonLues - 1);
  document.getElementById("notifs-counter").textContent =
    nonLues + (nonLues !== 1 ? " non lues" : " non lue");
  const badge = document.getElementById("notif-badge");
  badge.textContent = nonLues;
  badge.style.display = nonLues > 0 ? "flex" : "none";
};

/* ── Formulaires ─────────────────────────── */
window.submitForm = function (type) {
  const champs = {
    avis: ["avis-contenu", "avis-fonc"],
    signalement: ["signal-desc", "signal-type"],
    idee: ["idee-titre", "idee-desc"],
  };
  const messages = {
    avis: "Avis soumis avec succès.",
    signalement: "Signalement transmis.",
    idee: "Idée ajoutée à la boîte institutionnelle.",
  };

  if (!document.getElementById(champs[type][0]).value.trim()) return;

  const alerte = document.getElementById("alert-" + type);
  alerte.textContent = "✓ " + messages[type];
  alerte.classList.remove("hidden");
  setTimeout(() => alerte.classList.add("hidden"), 3500);

  champs[type].forEach((id) => {
    document.getElementById(id).value = "";
  });
  if (type === "avis")
    document
      .querySelectorAll(".star-btn")
      .forEach((b) => b.classList.remove("active"));
};
