// Black Friday Beacon: hands the deal finder in. The site lives in app/ as plain static files
// (no build step, no network at run time) and its screenshots live in screenshots/. This
// program copies both into the grader's output directory and writes dossier.json with the
// vendored make.fun library, which is the summary the judge reads: the screenshots, the first
// load's files and bytes, and the site's source.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It must write the same bytes on every run: it copies files in a fixed order and never reads
// the clock, so two runs of it produce a byte-identical dossier.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own: at most 4 screenshots, each at most 256 KiB; app/ at most
// 993 files and directories and 16 MiB in all; the dossier text at most 160 KiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
