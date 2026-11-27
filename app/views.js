// HTML for every page of the finder, built from the deal data. Every value is escaped before it
// goes into the page, so a deal's own text can never break the markup.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

const VERDICT_LABEL = { 'new-low': 'New low', strong: 'Strong price', routine: 'Routine sale' };

export function verdictChip(d) {
  return `<span class="verdict verdict-${escape(d.verdict)}">${escape(VERDICT_LABEL[d.verdict] ?? d.verdict)}</span>`;
}

export function dealCard(d) {
  return `<li class="card">
  <div class="card-top">
    <a class="card-title" href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a>
    ${verdictChip(d)}
  </div>
  <div class="card-meta"><span class="store">${escape(d.store)}</span> &middot; <span>${escape(d.category)}</span></div>
  <div class="card-price"><span class="now">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></div>
  <div class="card-save">You save ${usd(saved(d))}</div>
  <p class="card-evidence">${escape(d.evidence)}</p>
  <div class="card-foot">
    <a class="buy" href="${escape(d.url)}" rel="noopener">View at ${escape(d.store)} &rarr;</a>
    <span class="checked">Checked ${day(d.checked)}</span>
  </div>
</li>`;
}

export function rows(deals) {
  if (deals.length === 0) {
    return '<li class="empty">No deal matches those filters. Try clearing the search or lowering the minimum discount.</li>';
  }
  return deals.map(dealCard).join('');
}

export function listPage(deals, total) {
  return `<h1>Black Friday deals, checked today</h1>
<p class="lede">Every price below was read in a deals source that names its store, on Friday 27 November 2026. The discount is computed from the two prices shown; the verdict says honestly whether it is a real low.</p>
<p class="count" id="count">Showing ${deals.length} of ${total} deals</p>
<ul class="deals">${rows(deals)}</ul>`;
}

export function dealPage(d, allDeals) {
  const others = (d.alsoAt ?? [])
    .map((a) => `<li>${escape(a.store)}: <strong>${usd(a.price)}</strong>${a.price > d.price ? ` (${usd(a.price - d.price)} more than here)` : ''}</li>`)
    .join('');
  const compare = others
    ? `<h2>Same product elsewhere</h2><ul class="also">${others}</ul>`
    : '';
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<h1>${escape(d.title)}</h1>
<div class="detail">
  <div class="detail-price"><span class="now big">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off big">${percentOff(d)}% off</span></div>
  <p class="detail-save">You save ${usd(saved(d))} off the usual price.</p>
  <p>${verdictChip(d)} <span class="evidence-inline">${escape(d.evidence)}</span></p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${day(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  ${compare}
  <p><a class="buy big" href="${escape(d.url)}" rel="noopener">View it at ${escape(d.store)} &rarr;</a></p>
  <p class="note">Prices move all day on Black Friday. Check the price at the store before you buy.</p>
</div>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
