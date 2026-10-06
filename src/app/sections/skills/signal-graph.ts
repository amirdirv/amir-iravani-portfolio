import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { formatDuration, monthsBetween } from '../../core/dates';
import { I18nService } from '../../core/i18n.service';
import { Experience, Skill, SkillGroup } from '../../core/models';
import { EXPERIENCES, SKILLS } from '../../data/profile';
import { Reveal } from '../../shared/reveal.directive';

type Focus = { kind: 'skill' | 'role'; id: string } | null;
interface Point {
  x: number;
  y: number;
}
interface Edge {
  skill: string;
  role: string;
}

const GROUPS: readonly SkillGroup[] = ['frontend', 'language', 'backend', 'tooling'];

/** Every (skill → role) pair is an edge; derived once from the CV data. */
const EDGES: readonly Edge[] = EXPERIENCES.flatMap((e) => e.stack.map((skill) => ({ skill, role: e.id })));

/**
 * The skills section as a reactive dependency graph — the same mental model
 * as Angular signals. Hover/click a skill (a "source signal") and the roles
 * that depend on it light up; pick a role and you see the skills it consumed.
 * Lit state is three `computed`s; wire geometry is measured from the DOM.
 */
@Component({
  selector: 'app-signal-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  templateUrl: './signal-graph.html',
  styleUrl: './signal-graph.scss',
})
export class SignalGraph {
  protected readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly graph = viewChild.required<ElementRef<HTMLElement>>('graph');

  protected readonly experiences = EXPERIENCES;

  /** Pinned selection (click / Enter) and transient preview (hover / focus). */
  protected readonly selected = signal<Focus>(null);
  protected readonly hovered = signal<Focus>(null);
  protected readonly focus = computed<Focus>(() => this.hovered() ?? this.selected());

  private readonly anchors = signal<Record<string, Point>>({});
  protected readonly box = signal({ w: 0, h: 0 });

  protected readonly groups = computed(() => {
    const ui = this.i18n.ui().skills;
    const labels: Record<SkillGroup, string> = {
      frontend: ui.groupFrontend,
      backend: ui.groupBackend,
      language: ui.groupLanguage,
      tooling: ui.groupTooling,
    };
    return GROUPS.map((g) => ({ id: g, label: labels[g], skills: SKILLS.filter((s) => s.group === g) }));
  });

  protected readonly litSkills = computed(() => {
    const f = this.focus();
    if (!f) return null;
    if (f.kind === 'skill') return new Set([f.id]);
    return new Set(EXPERIENCES.find((e) => e.id === f.id)?.stack ?? []);
  });

  protected readonly litRoles = computed(() => {
    const f = this.focus();
    if (!f) return null;
    if (f.kind === 'role') return new Set([f.id]);
    return new Set(EXPERIENCES.filter((e) => e.stack.includes(f.id)).map((e) => e.id));
  });

  protected readonly wires = computed(() => {
    const anchors = this.anchors();
    const f = this.focus();
    return EDGES.flatMap((edge) => {
      const a = anchors['s:' + edge.skill];
      const b = anchors['r:' + edge.role];
      if (!a || !b) return [];
      const dx = (b.x - a.x) * 0.5;
      const lit = !!f && (f.kind === 'skill' ? edge.skill === f.id : edge.role === f.id);
      return [
        {
          key: edge.skill + '>' + edge.role,
          d: `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`,
          lit,
          dim: !!f && !lit,
        },
      ];
    });
  });

  /** Text for the live readout under the graph. */
  protected readonly readout = computed(() => {
    const f = this.focus();
    const ui = this.i18n.ui();
    if (!f) return null;
    const units = { yr: ui.experience.yr, mo: ui.experience.mo };
    const num = (n: number) => this.i18n.num(n);
    if (f.kind === 'skill') {
      const skill = SKILLS.find((s) => s.id === f.id);
      const roles = EXPERIENCES.filter((e) => e.stack.includes(f.id));
      const months = roles.reduce((sum, e) => sum + monthsBetween(e.start, e.end), 0);
      return {
        title: skill?.label ?? '',
        meta: roles.length ? formatDuration(months, units, num) : '',
        label: ui.skills.usedAt,
        items: roles.map((e) => e.company),
      };
    }
    const role = EXPERIENCES.find((e) => e.id === f.id);
    return {
      title: role ? `${this.i18n.t(role.role)} · ${role.company}` : '',
      meta: role ? formatDuration(monthsBetween(role.start, role.end), units, num) : '',
      label: ui.skills.roleUses,
      items: (role?.stack ?? []).map((id) => SKILLS.find((s) => s.id === id)?.label ?? id),
    };
  });

  constructor() {
    afterNextRender(() => {
      const node = this.graph().nativeElement;
      this.measure();
      const ro = new ResizeObserver(() => this.measure());
      ro.observe(node);
      // Web fonts arriving late change label widths without resizing the container.
      const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && this.measure());
      io.observe(node);
      document.fonts?.ready.then(() => this.measure());
      this.destroyRef.onDestroy(() => {
        ro.disconnect();
        io.disconnect();
      });
    });
    // Labels change width when the language (and direction) changes.
    effect(() => {
      this.i18n.lang();
      if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(() => this.measure());
    });
  }

  protected toggle(kind: 'skill' | 'role', id: string): void {
    const current = this.selected();
    this.selected.set(current?.kind === kind && current.id === id ? null : { kind, id });
  }

  protected isSelected(kind: 'skill' | 'role', id: string): boolean {
    const s = this.selected();
    return s?.kind === kind && s.id === id;
  }

  protected skillState(skill: Skill): 'lit' | 'dim' | '' {
    const lit = this.litSkills();
    return !lit ? '' : lit.has(skill.id) ? 'lit' : 'dim';
  }

  protected roleState(role: Experience): 'lit' | 'dim' | '' {
    const lit = this.litRoles();
    return !lit ? '' : lit.has(role.id) ? 'lit' : 'dim';
  }

  protected years(role: Experience): string {
    const start = role.start.slice(0, 4);
    const end = role.end ? role.end.slice(0, 4) : '';
    return this.i18n.num(end && end !== start ? `${start}–${end}` : end ? start : `${start}–`);
  }

  /** Reads each node's inner edge (the side facing the other column) in graph coordinates. */
  private measure(): void {
    const root = this.graph().nativeElement;
    const box = root.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    const anchors: Record<string, Point> = {};
    root.querySelectorAll<HTMLElement>('[data-node]').forEach((node) => {
      const r = node.getBoundingClientRect();
      const inner = Math.abs(r.left - mid) < Math.abs(r.right - mid) ? r.left : r.right;
      anchors[node.dataset['node']!] = { x: inner - box.left, y: r.top + r.height / 2 - box.top };
    });
    this.box.set({ w: box.width, h: box.height });
    this.anchors.set(anchors);
  }
}
