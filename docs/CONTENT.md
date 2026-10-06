# Editing content

All text lives in two files. Components contain no career data.

| File | Contains |
| --- | --- |
| [`src/app/data/profile.ts`](../src/app/data/profile.ts) | Person, social links, skills, experiences, projects, education, spoken languages |
| [`src/app/data/ui.ts`](../src/app/data/ui.ts) | Every heading, label and sentence of the interface |

Every human-readable string is a `Localized` object: `{ en: '…', it: '…', fa: '…' }`. Lists (`highlights`, `roles`, `approach`…) need the **same number of items** in each language. `npm test` checks both rules and tells you exactly which key is missing.

## Add a job

Add an object at the **top** of `EXPERIENCES` (newest first):

```ts
{
  id: 'acme',                       // unique, used for the commit hash and graph node
  company: 'Acme SpA',
  branch: 'turin',                  // 'turin' (Italy) or 'tehran' (Iran) lane in the git graph
  start: '2026-11',
  // end: '2027-06',                // omit while it's your current job
  role:    { en: 'Senior Front-End Engineer', it: 'Senior Front-End Engineer', fa: 'مهندس ارشد فرانت‌اند' },
  kind:    { en: 'Full-time', it: 'Tempo pieno', fa: 'تمام‌وقت' },
  city:    { en: 'Milan, Italy', it: 'Milano, Italia', fa: 'میلان، ایتالیا' },
  summary: { en: '…', it: '…', fa: '…' },
  highlights: { en: ['…', '…'], it: ['…', '…'], fa: ['…', '…'] },
  stack: ['angular', 'typescript', 'rxjs'],   // ids from SKILLS
},
```

Only one experience may have no `end`. When a new job starts, give the previous one an `end`.

Everything else updates automatically: the hero's "roles" counter, the signal graph, the git log, the terminal's `experience` command and the printed CV.

## Add a project

Add to `PROJECTS`. `featured: true` makes the card larger, and the first featured project spans the full width. `palette` is two colours for the generative cover. Give `url` and/or `repo`; if you give neither, the card says "Private / client work".

## Add a skill

Add to `SKILLS` with a unique `id`, a `group` (`frontend | backend | language | tooling`) and a `weight` from 1 to 5 (the dot size in the graph). Then reference the id from the `stack` of jobs or projects. A skill that no job references still appears in the graph, just with no wires.

## Change interface text

Find the key in `ui.ts` (for example `hero.lead`) and edit all three languages.

## Change the photo

Replace `public/images/amir-iravani.webp` (and `.jpg`, used for structured data). A square image of at least 500×500 works best. Or regenerate both:

```bash
python tools/generate-assets.py path/to/photo.png
```

## Availability badge, email, links

- Badge text: `UI.hero.available`
- Email: `PERSON.email` and the `email` entry in `SOCIALS`
- Links: `SOCIALS`. Remember to update `sameAs` in `src/index.html` too.
