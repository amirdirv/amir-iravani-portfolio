import { formatMonth } from '../../core/dates';
import { Lang } from '../../core/models';
import { SECTION_IDS, SectionId } from '../../core/scroll.service';
import { EDUCATION, EXPERIENCES, PERSON, PROJECTS, SKILLS, SOCIALS, SPOKEN_LANGUAGES } from '../../data/profile';

export type LineKind = 'out' | 'muted' | 'accent' | 'error' | 'success';

export interface Line {
  kind: LineKind;
  text: string;
  href?: string;
}

/** Side effects a command asks the host component to perform. */
export type ShellEffect =
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'goto'; section: SectionId }
  | { type: 'lang'; lang: Lang }
  | { type: 'theme' }
  | { type: 'open'; url: string };

export interface ShellResult {
  lines: Line[];
  effect?: ShellEffect;
}

interface Context {
  lang: Lang;
  history: readonly string[];
}

const out = (text: string, kind: LineKind = 'out', href?: string): Line => ({ kind, text, href });

const HELP: [string, string][] = [
  ['help', 'list commands'],
  ['whoami', 'the short version'],
  ['about', 'the longer version'],
  ['skills', 'stack, grouped'],
  ['experience', 'git log --oneline of my career'],
  ['projects', 'selected work'],
  ['education', 'degrees'],
  ['languages', 'human languages I speak'],
  ['contact', 'how to reach me'],
  ['social', 'links'],
  ['goto <section>', SECTION_IDS.join(' | ')],
  ['lang <en|it|fa>', 'switch site language'],
  ['theme', 'toggle light / dark'],
  ['history', 'what you typed'],
  ['clear', 'clear the screen'],
  ['exit', 'close the terminal'],
];

/** All command names, for tab completion. */
export const COMMANDS = [
  ...HELP.map(([c]) => c.split(' ')[0]!),
  'ls',
  'cat',
  'echo',
  'date',
  'pwd',
  'sudo',
  'open',
];

/** Pads a label column for aligned output. */
const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

/**
 * A tiny pure interpreter: input string in, printable lines (and an optional
 * effect) out. Kept free of Angular so it can be unit-tested directly.
 */
export function runShell(input: string, ctx: Context): ShellResult {
  const [cmd = '', ...args] = input.trim().split(/\s+/);
  const arg = args.join(' ');
  const lang = ctx.lang;

  switch (cmd.toLowerCase()) {
    case '':
      return { lines: [] };

    case 'help':
      return {
        lines: [
          out('Available commands:', 'accent'),
          ...HELP.map(([c, d]) => out(`  ${pad(c, 18)}${d}`)),
          out('Tip: Tab completes, ↑/↓ walks history.', 'muted'),
        ],
      };

    case 'whoami':
      return {
        lines: [
          out(PERSON.name, 'accent'),
          out(`Front-end engineer · ${new Date().getFullYear() - PERSON.careerStart}+ years · ${PERSON.location[lang]}`),
          out('Angular first. React and Vue fluent. Obsessed with the details.', 'muted'),
        ],
      };

    case 'about':
      return {
        lines: [
          out('# about.md', 'accent'),
          out('Started with game loops at 15 in Tehran → intern → CTO → agency co-founder'),
          out('→ sole front-end engineer of a B2B marketplace in Turin → startup MVPs at BIU.'),
          out('MSc Computer Engineering @ Politecnico di Torino. Italian work permit, full-time.'),
        ],
      };

    case 'skills': {
      const groups = ['frontend', 'language', 'backend', 'tooling'] as const;
      return {
        lines: groups.map((g) =>
          out(`${pad(g, 11)}${SKILLS.filter((s) => s.group === g).map((s) => s.label).join(', ')}`),
        ),
      };
    }

    case 'experience':
    case 'log':
      return {
        lines: EXPERIENCES.map((e) =>
          out(
            `${pad(formatMonth(e.start, 'en'), 9)} ${pad(e.branch, 7)} ${e.role.en} @ ${e.company}`,
            e.end ? 'out' : 'success',
          ),
        ),
      };

    case 'projects':
      return {
        lines: PROJECTS.flatMap((p) => [
          out(`▸ ${p.name} (${p.year})`, 'accent', p.url ?? p.repo),
          out(`  ${p.tagline[lang]}`, 'muted'),
        ]),
      };

    case 'education':
      return {
        lines: EDUCATION.map((e) =>
          out(`${e.degree[lang]} — ${e.school[lang]} (${e.start.slice(0, 4)}–${e.end?.slice(0, 4) ?? 'now'})`),
        ),
      };

    case 'languages':
      return {
        lines: SPOKEN_LANGUAGES.map((l) => out(`${pad(l.name.en, 10)}${l.level === 'native' ? 'native' : l.level}`)),
      };

    case 'contact':
      return {
        lines: [
          out(`email  ${PERSON.email}`, 'accent', `mailto:${PERSON.email}`),
          out('Open to full-time front-end roles in Italy.', 'muted'),
        ],
      };

    case 'social':
    case 'ls':
      if (cmd === 'ls' && arg) return { lines: [out(`ls: cannot access '${arg}': it's a portfolio, not a filesystem`, 'error')] };
      return {
        lines:
          cmd === 'ls'
            ? [out('about.md  skills.json  experience.log  projects/  contact.txt  cv.pdf', 'accent')]
            : SOCIALS.map((s) => out(`${pad(s.label, 11)}${s.url}`, 'out', s.url)),
      };

    case 'cat':
      if (arg === 'about.md') return runShell('about', ctx);
      if (arg === 'skills.json') return runShell('skills', ctx);
      if (arg === 'experience.log') return runShell('experience', ctx);
      if (arg === 'contact.txt') return runShell('contact', ctx);
      if (arg === 'cv.pdf') return { lines: [out('Binary file. Try the "Print as CV" button in the footer.', 'muted')] };
      return { lines: [out(`cat: ${arg || '(missing file)'}: no such file`, 'error')] };

    case 'goto':
    case 'cd': {
      const section = arg.replace(/^#|\/$/g, '') as SectionId;
      if ((SECTION_IDS as readonly string[]).includes(section)) {
        return { lines: [out(`→ #${section}`, 'success')], effect: { type: 'goto', section } };
      }
      return { lines: [out(`goto: unknown section '${arg}'. Try: ${SECTION_IDS.join(', ')}`, 'error')] };
    }

    case 'lang':
      if (arg === 'en' || arg === 'it' || arg === 'fa') {
        return { lines: [out(`language → ${arg}`, 'success')], effect: { type: 'lang', lang: arg } };
      }
      return { lines: [out('usage: lang <en|it|fa>', 'error')] };

    case 'theme':
      return { lines: [out('theme toggled', 'success')], effect: { type: 'theme' } };

    case 'open': {
      const social = SOCIALS.find((s) => s.id === arg.toLowerCase());
      if (social) return { lines: [out(`opening ${social.url}`, 'success')], effect: { type: 'open', url: social.url } };
      return { lines: [out(`usage: open <${SOCIALS.map((s) => s.id).join('|')}>`, 'error')] };
    }

    case 'history':
      return { lines: ctx.history.map((h, i) => out(`${String(i + 1).padStart(4)}  ${h}`)) };

    case 'echo':
      return { lines: [out(arg)] };

    case 'date':
      return { lines: [out(new Date().toString())] };

    case 'pwd':
      return { lines: [out('/home/amir/turin')] };

    case 'sudo':
      if (/hire/i.test(arg)) {
        return {
          lines: [out('[sudo] permission granted. Excellent decision.', 'success'), out('Opening #contact …', 'muted')],
          effect: { type: 'goto', section: 'contact' },
        };
      }
      return { lines: [out('amir is not in the sudoers file. This incident will be reported. (try: sudo hire-amir)', 'error')] };

    case 'clear':
      return { lines: [], effect: { type: 'clear' } };

    case 'exit':
      return { lines: [], effect: { type: 'exit' } };

    default:
      return { lines: [out(`command not found: ${cmd}. Type 'help'.`, 'error')] };
  }
}

/** Completes the first word against known commands; returns the input unchanged when ambiguous. */
export function complete(input: string): string {
  if (input.includes(' ')) return input;
  const matches = [...new Set(COMMANDS)].filter((c) => c.startsWith(input.toLowerCase()));
  return matches.length === 1 ? matches[0] + ' ' : input;
}
