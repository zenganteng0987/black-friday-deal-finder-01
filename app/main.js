// The finder: one list and one page per deal, on hash routes, with search and filters that
// actually filter, and sorting that actually sorts. No network is used: the deals are in data.js.
//
//   #/              the list, with search, filters and sorting
//   #/deal/<id>     one deal, with its check time, source and cross-store comparison
//
// window.__shotReady is false while a page renders and true once it is on screen, so a
// screenshot script knows when to capture.

import { deals } from './data.js';
import { dealPage, listPage, missingPage, rows } from './views.js';

const app = document.getElementById('app');
const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();

const state = { query: '', category: '', store: '', minOff: 0, sort: 'discount' };

function filtered() {
  const q = state.query.trim().toLowerCase();
  let shown = deals.filter((d) => {
    if (q !== '' && `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q) === false) return false;
    if (state.category !== '' && d.category !== state.category) return false;
    if (state.store !== '' && d.store !== state.store) return false;
    if (state.minOff > 0 && Math.round((1 - d.price / d.was) * 100) < state.minOff) return false;
    return true;
  });
  const by = {
    discount: (a, b) => a.price / a.was - b.price / b.was,
    saving: (a, b) => b.was - b.price - (a.was - a.price),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  }[state.sort] ?? ((a, b) => 0);
  return [...shown].sort(by);
}

function options(values, current, allLabel) {
  return `<option value="">${allLabel}</option>` + values.map((v) => `<option value="${v}"${v === current ? ' selected' : ''}>${v}</option>`).join('');
}

function controls() {
  return `<form class="controls" id="controls">
  <label>Search <input id="q" type="search" placeholder="Try “AirPods” or “TV”" value="${state.query.replace(/"/g, '&quot;')}"></label>
  <label>Category <select id="cat">${options(categories, state.category, 'All categories')}</select></label>
  <label>Store <select id="store">${options(stores, state.store, 'All stores')}</select></label>
  <label>At least <select id="minoff">
    <option value="0"${state.minOff === 0 ? ' selected' : ''}>Any discount</option>
    <option value="25"${state.minOff === 25 ? ' selected' : ''}>25% off</option>
    <option value="40"${state.minOff === 40 ? ' selected' : ''}>40% off</option>
    <option value="50"${state.minOff === 50 ? ' selected' : ''}>50% off</option>
  </select></label>
  <label>Sort by <select id="sort">
    <option value="discount"${state.sort === 'discount' ? ' selected' : ''}>Biggest discount</option>
    <option value="saving"${state.sort === 'saving' ? ' selected' : ''}>Biggest saving</option>
    <option value="low"${state.sort === 'low' ? ' selected' : ''}>Lowest price</option>
    <option value="high"${state.sort === 'high' ? ' selected' : ''}>Highest price</option>
  </select></label>
</form>`;
}

function renderList() {
  const shown = filtered();
  app.innerHTML = controls() + listPage(shown, deals.length);
  const list = app.querySelector('.deals');
  const count = app.querySelector('#count');
  const refresh = () => {
    const next = filtered();
    list.innerHTML = rows(next);
    count.textContent = `Showing ${next.length} of ${deals.length} deals`;
  };
  app.querySelector('#q').addEventListener('input', (e) => {
    state.query = e.target.value;
    refresh();
  });
  app.querySelector('#cat').addEventListener('change', (e) => {
    state.category = e.target.value;
    refresh();
  });
  app.querySelector('#store').addEventListener('change', (e) => {
    state.store = e.target.value;
    refresh();
  });
  app.querySelector('#minoff').addEventListener('change', (e) => {
    state.minOff = Number(e.target.value);
    refresh();
  });
  app.querySelector('#sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    refresh();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | Black Friday Beacon`;
    app.innerHTML = found ? dealPage(found, deals) : missingPage();
  } else {
    document.title = 'Black Friday Beacon — real deals, checked today';
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
