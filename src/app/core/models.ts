/** Languages the site is published in. `fa` is rendered right-to-left. */
export type Lang = 'en' | 'it' | 'fa';

/** A piece of copy translated into every supported language. */
export type Localized = Record<Lang, string>;

/** A list of strings translated into every supported language. */
export type LocalizedList = Record<Lang, readonly string[]>;

/** `YYYY-MM` — month precision is all a CV needs. */
export type YearMonth = `${number}-${number}`;

export type SkillGroup = 'frontend' | 'backend' | 'language' | 'tooling';

export interface Skill {
  readonly id: string;
  readonly label: string;
  readonly group: SkillGroup;
  /** 1–5, used for node size in the signal graph. */
  readonly weight: number;
}

/** `tehran` and `turin` are the two branches of the career git graph. */
export type Branch = 'tehran' | 'turin';

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly companyUrl?: string;
  readonly role: Localized;
  readonly kind: Localized;
  readonly city: Localized;
  readonly branch: Branch;
  readonly start: YearMonth;
  /** `undefined` means "present". */
  readonly end?: YearMonth;
  readonly summary: Localized;
  readonly highlights: LocalizedList;
  /** Skill ids — these are the edges of the signal graph. */
  readonly stack: readonly string[];
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly year: string;
  readonly tagline: Localized;
  readonly description: Localized;
  readonly role: Localized;
  readonly stack: readonly string[];
  readonly url?: string;
  readonly repo?: string;
  /** Two CSS colours used for the card's generative cover. */
  readonly palette: readonly [string, string];
  readonly featured?: boolean;
}

export interface Education {
  readonly id: string;
  readonly degree: Localized;
  readonly school: Localized;
  readonly city: Localized;
  readonly start: YearMonth;
  readonly end?: YearMonth;
  readonly url: string;
}

/** CEFR level, or `native`. */
export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';

export interface SpokenLanguage {
  readonly name: Localized;
  readonly level: Cefr;
  /** Listening, reading, spoken production, spoken interaction, writing. */
  readonly detail?: readonly [Cefr, Cefr, Cefr, Cefr, Cefr];
}

export interface SocialLink {
  readonly id: 'github' | 'linkedin' | 'instagram' | 'email';
  readonly label: string;
  readonly handle: string;
  readonly url: string;
}
