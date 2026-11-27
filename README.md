# Black Friday Beacon

[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/zenganteng0987/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/zenganteng0987/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A Black Friday and Cyber Monday deal finder with 27 real deals from Amazon, Best Buy and
Walmart — each with its store, sale price, usual price, discount, store link and the time its
price was checked on Friday 27 November 2026. Every deal carries an honest verdict
(New low / Strong price / Routine sale) with the evidence behind it.

Search, filter by category, store and minimum discount, and sort by biggest discount,
biggest saving, lowest or highest price. Two deals compare the same product across stores.
The site is plain static files under `app/` (no build step, no network request at run time)
and works on desktop and on a phone.

Entry for the make.fun bounty
[black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01).
`main.ts` hands the site in: it copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored make.fun library.
