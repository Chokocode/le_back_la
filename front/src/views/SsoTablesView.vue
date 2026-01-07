<template>
  <div class="page">
    <h1>Lecture DB (SSO)</h1>

    <form class="card" @submit.prevent="loadAll">
      <label class="label">
        sso_nigend
        <input
          v-model.trim="sso"
          class="input"
          placeholder="Ex: 1234567"
          autocomplete="off"
        />
      </label>

      <div class="row">
        <button class="btn" type="submit" :disabled="loading || !sso">
          {{ loading ? "Chargement..." : "Charger les tables" }}
        </button>

        <button class="btn secondary" type="button" @click="clear" :disabled="loading">
          Effacer
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <section class="card">
      <h2>Table: data</h2>
      <p v-if="loadingData">Chargement...</p>
      <p v-else-if="dataRows.length === 0">Aucune ligne.</p>
      <TableAuto v-else :rows="dataRows" />
    </section>

    <section class="card">
      <h2>Table: ref_gendarme</h2>
      <p v-if="loadingRef">Chargement...</p>
      <p v-else-if="refRows.length === 0">Aucune ligne.</p>
      <TableAuto v-else :rows="refRows" />
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

/**
 * ✅ Info confirmée : endpoint data
 */
const ENDPOINT_DATA = "/api/rw/data";

/**
 * ⚠️ Si ton endpoint ref_gendarme est différent, change ici.
 */
const ENDPOINT_REF = "/api/rw/ref_gendarme";

/**
 * ✅ Info confirmée : "un header"
 * Ici, on envoie le sso dans le header "sso_nigend".
 * Si ton Guard Nest attend un autre nom (ex: "authorization" ou "x-sso-nigend"),
 * change juste cette constante.
 */
const SSO_HEADER_NAME = "sso_nigend";

const sso = ref(localStorage.getItem("sso_nigend") ?? "");

const loading = ref(false);
const loadingData = ref(false);
const loadingRef = ref(false);

const error = ref("");

const dataRows = ref([]);
const refRows = ref([]);

watch(sso, (v) => localStorage.setItem("sso_nigend", v ?? ""));

async function loadAll() {
  error.value = "";
  dataRows.value = [];
  refRows.value = [];

  loading.value = true;
  loadingData.value = true;
  loadingRef.value = true;

  try {
    const headers = {
      [SSO_HEADER_NAME]: sso.value,
      "Content-Type": "application/json",
    };

    const [dataRes, refRes] = await Promise.all([
      fetch(ENDPOINT_DATA, { method: "GET", headers }),
      fetch(ENDPOINT_REF, { method: "GET", headers }),
    ]);

    if (!dataRes.ok) {
      const txt = await safeText(dataRes);
      throw new Error(`Erreur table data (${dataRes.status}) ${txt}`.trim());
    }
    if (!refRes.ok) {
      const txt = await safeText(refRes);
      throw new Error(`Erreur table ref_gendarme (${refRes.status}) ${txt}`.trim());
    }

    dataRows.value = await dataRes.json();
    refRows.value = await refRes.json();
  } catch (e) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
    loadingData.value = false;
    loadingRef.value = false;
  }
}

function clear() {
  error.value = "";
  dataRows.value = [];
  refRows.value = [];
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
</script>

<script>
export default {
  components: {
    TableAuto: {
      props: { rows: { type: Array, required: true } },
      computed: {
        columns() {
          const cols = new Set();
          for (const r of this.rows) {
            if (r && typeof r === "object" && !Array.isArray(r)) {
              Object.keys(r).forEach((k) => cols.add(k));
            }
          }
          return Array.from(cols);
        },
      },
      template: `
        <div class="tableWrap">
          <table class="table">
            <thead>
              <tr>
                <th v-for="c in columns" :key="c">{{ c }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in rows" :key="i">
                <td v-for="c in columns" :key="c">{{ r?.[c] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
  },
};
</script>

<style scoped>
.page { max-width: 1100px; margin: 24px auto; padding: 0 16px; font-family: system-ui, Arial; }
.card { background: #fff; border: 1px solid #e6e6e6; border-radius: 10px; padding: 16px; margin: 16px 0; }
.label { display: grid; gap: 8px; font-weight: 600; }
.input { padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
.row { display: flex; gap: 10px; margin-top: 12px; }
.btn { padding: 10px 12px; border: 1px solid #222; background: #222; color: #fff; border-radius: 8px; cursor: pointer; }
.btn.secondary { background: #fff; color: #222; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.error { margin-top: 10px; color: #b00020; white-space: pre-wrap; }
.tableWrap { overflow: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th, .table td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; vertical-align: top; }
.table th { background: #fafafa; position: sticky; top: 0; }
</style>
