import {
  Education,
  Experience,
  Localized,
  Project,
  Skill,
  SocialLink,
  SpokenLanguage,
} from '../core/models';

/**
 * Single source of truth for everything the site says about Amir.
 * Edit this file (and `ui.ts` for interface copy) to update the portfolio —
 * no component contains hard-coded career data.
 */

export const PERSON = {
  name: 'Amir Mohammad Iravani',
  shortName: 'Amir Iravani',
  initials: 'AI',
  email: 'amirmohammad76@yahoo.com',
  location: { en: 'Turin, Italy', it: 'Torino, Italia', fa: 'تورین، ایتالیا' } satisfies Localized,
  /** First professional work (game-dev internship) — drives the "years of experience" counter. */
  careerStart: 2013,
  photo: 'images/amir-iravani.webp',
} as const;

export const SOCIALS: readonly SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'amirmohammad-iravani',
    url: 'https://www.linkedin.com/in/amirmohammad-iravani/',
  },
  { id: 'github', label: 'GitHub', handle: 'amirdirv', url: 'https://github.com/amirdirv' },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: 'amirmohammadirv',
    url: 'https://www.instagram.com/amirmohammadirv/',
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'amirmohammad76@yahoo.com',
    url: 'mailto:amirmohammad76@yahoo.com',
  },
];

export const SKILLS: readonly Skill[] = [
  { id: 'angular', label: 'Angular', group: 'frontend', weight: 5 },
  { id: 'typescript', label: 'TypeScript', group: 'language', weight: 5 },
  { id: 'javascript', label: 'JavaScript', group: 'language', weight: 5 },
  { id: 'html-css', label: 'HTML & SCSS', group: 'frontend', weight: 5 },
  { id: 'react', label: 'React', group: 'frontend', weight: 4 },
  { id: 'vue', label: 'Vue.js', group: 'frontend', weight: 4 },
  { id: 'rxjs', label: 'RxJS & Signals', group: 'frontend', weight: 4 },
  { id: 'nextjs', label: 'Next.js', group: 'frontend', weight: 3 },
  { id: 'node', label: 'Node.js', group: 'backend', weight: 4 },
  { id: 'mongodb', label: 'MongoDB', group: 'backend', weight: 3 },
  { id: 'sql', label: 'SQL', group: 'backend', weight: 3 },
  { id: 'php', label: 'PHP & WooCommerce', group: 'backend', weight: 3 },
  { id: 'unity', label: 'Unity & C#', group: 'language', weight: 2 },
  { id: 'python', label: 'Python', group: 'language', weight: 2 },
  { id: 'java', label: 'Java', group: 'language', weight: 2 },
  { id: 'cpp', label: 'C++', group: 'language', weight: 2 },
  { id: 'git', label: 'Git', group: 'tooling', weight: 4 },
  { id: 'ux', label: 'Responsive UI / UX', group: 'tooling', weight: 5 },
];

/** Newest first. Dates and facts come from the Europass CV. */
export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'digital-horizons',
    company: 'ENAIP Piemonte · Digital Horizons',
    companyUrl:
      'https://www.enaip.piemonte.it/mod/Notizie/page/coesione_sociale/dettaglioNotizia/DIGITAL-HORIZONS__18889__144.html',
    branch: 'turin',
    start: '2026-09',
    role: {
      en: 'IT Trainee',
      it: 'Allievo IT',
      fa: 'کارآموز فناوری اطلاعات',
    },
    kind: {
      en: 'Training & work contract',
      it: 'Formazione e contratto di lavoro',
      fa: 'دورهٔ آموزشی و قرارداد کاری',
    },
    city: { en: 'Turin, Italy', it: 'Torino, Italia', fa: 'تورین، ایتالیا' },
    summary: {
      en: 'Selected for Digital Horizons, a European IT training and job-placement programme run by International Rescue Committee Italia with ENAIP Piemonte, Powercoders and Agenzia Piemonte Lavoro, funded by the Villum Foundation (European VET 2024).',
      it: 'Selezionato per Digital Horizons, programma europeo di formazione IT e inserimento lavorativo promosso da International Rescue Committee Italia con ENAIP Piemonte, Powercoders e Agenzia Piemonte Lavoro, finanziato dalla Fondazione Villum (European VET 2024).',
      fa: 'پذیرفته‌شده در Digital Horizons، برنامهٔ اروپایی آموزش فناوری اطلاعات و اشتغال که International Rescue Committee ایتالیا با همکاری ENAIP پیه‌مونته، Powercoders و آژانس کار پیه‌مونته اجرا می‌کند و بنیاد Villum (برنامهٔ European VET 2024) تأمین مالی آن را بر عهده دارد.',
    },
    highlights: {
      en: [
        'Full-time intensive course at ENAIP Turin (via del Ridotto): five hours a day, Monday to Friday, September 2026 – spring 2027.',
        'IT skills shaped around what Piedmont’s tech companies hire for, taught with Powercoders’ industry-led method.',
        'Leads into a paid placement with an IT company in Piedmont.',
      ],
      it: [
        'Corso intensivo full-time presso ENAIP Torino (via del Ridotto): cinque ore al giorno, dal lunedì al venerdì, da settembre 2026 alla primavera 2027.',
        'Competenze IT costruite su ciò che cercano le aziende tech piemontesi, con il metodo Powercoders guidato dalle aziende.',
        'Prosegue con un tirocinio retribuito in un’azienda IT del Piemonte.',
      ],
      fa: [
        'دورهٔ فشردهٔ تمام‌وقت در ENAIP تورین (خیابان دل ریدوتو): روزی پنج ساعت، دوشنبه تا جمعه، از سپتامبر ۲۰۲۶ تا بهار ۲۰۲۷.',
        'مهارت‌های فناوری اطلاعات متناسب با نیاز شرکت‌های فناوری پیه‌مونته، با روش صنعت‌محور Powercoders.',
        'ادامهٔ مسیر با کارآموزی حقوق‌دار در یک شرکت فناوری اطلاعات در پیه‌مونته.',
      ],
    },
    stack: ['javascript', 'typescript', 'html-css', 'git'],
  },
  {
    id: 'biu',
    company: 'Build It Up (BIU)',
    branch: 'turin',
    start: '2025-10',
    role: {
      en: 'Web Developer',
      it: 'Sviluppatore Web',
      fa: 'توسعه‌دهنده وب',
    },
    kind: {
      en: 'Volunteer · Freelance',
      it: 'Volontario · Freelance',
      fa: 'داوطلب · فریلنس',
    },
    city: { en: 'Turin, Italy', it: 'Torino, Italia', fa: 'تورین، ایتالیا' },
    summary: {
      en: 'Front-end lead for websites and MVPs of early-stage startups in the Politecnico di Torino × ESCP Business School acceleration programme.',
      it: 'Sviluppo front-end di siti web e MVP per startup early-stage nel programma di accelerazione Politecnico di Torino × ESCP Business School.',
      fa: 'توسعهٔ فرانت‌اند وب‌سایت‌ها و MVP استارتاپ‌های مرحلهٔ اولیه در برنامهٔ شتاب‌دهی پلی‌تکنیک تورین × مدرسهٔ کسب‌وکار ESCP.',
    },
    highlights: {
      en: [
        'Turns founders’ pitch decks into working Angular/TypeScript products in weeks, not months.',
        'Works inside a non-profit accelerator network alongside business-school mentors.',
        'Sets up reusable component foundations so each new MVP starts from day ten, not day zero.',
      ],
      it: [
        'Trasforma i pitch deck dei founder in prodotti Angular/TypeScript funzionanti in settimane, non mesi.',
        'Lavora in un acceleratore non-profit al fianco dei mentor della business school.',
        'Crea basi di componenti riutilizzabili: ogni nuovo MVP parte dal giorno dieci, non da zero.',
      ],
      fa: [
        'تبدیل پیچ‌دک بنیان‌گذاران به محصول واقعی با Angular و TypeScript در چند هفته، نه چند ماه.',
        'همکاری در یک شتاب‌دهندهٔ غیرانتفاعی در کنار منتورهای مدرسهٔ کسب‌وکار.',
        'ساخت پایهٔ کامپوننت‌های قابل‌استفادهٔ مجدد تا هر MVP جدید از روز دهم شروع شود، نه از صفر.',
      ],
    },
    stack: ['angular', 'typescript', 'html-css', 'ux', 'git'],
  },
  {
    id: 'meyler',
    company: 'Meyler Srl',
    branch: 'turin',
    start: '2023-04',
    end: '2024-11',
    role: {
      en: 'Front-End Developer',
      it: 'Sviluppatore Front-End',
      fa: 'توسعه‌دهنده فرانت‌اند',
    },
    kind: { en: 'Full-time', it: 'Tempo pieno', fa: 'تمام‌وقت' },
    city: { en: 'Turin, Italy', it: 'Torino, Italia', fa: 'تورین، ایتالیا' },
    summary: {
      en: 'The only front-end developer on Tulero — a B2B auto-parts marketplace — and its admin dashboard, from first wireframe to production.',
      it: 'Unico front-end developer di Tulero — marketplace B2B di ricambi auto — e della sua dashboard amministrativa, dal primo wireframe alla produzione.',
      fa: 'تنها توسعه‌دهندهٔ فرانت‌اند Tulero — بازارگاه B2B قطعات خودرو — و داشبورد مدیریتی آن، از اولین وایرفریم تا انتشار.',
    },
    highlights: {
      en: [
        'Designed and built the full marketplace UI: search, catalogue, cart and ordering flows for repair shops.',
        'Shipped the internal admin dashboard for catalogue, orders and customers.',
        'Moved fluently across Angular, React and Vue on a Node.js + MongoDB backend.',
      ],
      it: [
        'Progettazione e sviluppo dell’intera UI del marketplace: ricerca, catalogo, carrello e ordini per le officine.',
        'Realizzazione della dashboard amministrativa per catalogo, ordini e clienti.',
        'Lavoro trasversale su Angular, React e Vue con back-end Node.js + MongoDB.',
      ],
      fa: [
        'طراحی و پیاده‌سازی کامل رابط بازارگاه: جست‌وجو، کاتالوگ، سبد خرید و ثبت سفارش برای تعمیرگاه‌ها.',
        'ساخت داشبورد مدیریت داخلی برای کاتالوگ، سفارش‌ها و مشتریان.',
        'کار هم‌زمان با Angular، React و Vue روی بک‌اند Node.js و MongoDB.',
      ],
    },
    stack: [
      'angular',
      'react',
      'vue',
      'typescript',
      'node',
      'mongodb',
      'rxjs',
      'html-css',
      'ux',
      'git',
    ],
  },
  {
    id: 'bistoon',
    company: 'Bistoon Baspar',
    branch: 'tehran',
    start: '2022-02',
    end: '2022-09',
    role: {
      en: 'Front-End Developer',
      it: 'Sviluppatore Front-End',
      fa: 'توسعه‌دهنده فرانت‌اند',
    },
    kind: { en: 'Full-time', it: 'Tempo pieno', fa: 'تمام‌وقت' },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    summary: {
      en: 'Built and maintained responsive web interfaces for Iran’s leading maker of eco-friendly disposable tableware.',
      it: 'Sviluppo e manutenzione di interfacce web responsive per il principale produttore iraniano di stoviglie monouso ecologiche.',
      fa: 'ساخت و نگهداری رابط‌های وب واکنش‌گرا برای پیشروترین تولیدکنندهٔ ظروف یک‌بارمصرف دوستدار محیط‌زیست در ایران.',
    },
    highlights: {
      en: [
        'Delivered responsive product and company pages across desktop and mobile.',
        'Integrated back-end REST APIs into the front end end-to-end.',
      ],
      it: [
        'Pagine prodotto e aziendali responsive su desktop e mobile.',
        'Integrazione completa delle REST API del back-end nel front-end.',
      ],
      fa: [
        'تحویل صفحات محصول و شرکت به‌صورت کاملاً واکنش‌گرا برای دسکتاپ و موبایل.',
        'یکپارچه‌سازی کامل REST APIهای بک‌اند با فرانت‌اند.',
      ],
    },
    stack: ['javascript', 'typescript', 'html-css', 'ux', 'git'],
  },
  {
    id: 'iris',
    company: 'IRIS Vira Vision',
    branch: 'tehran',
    start: '2021-06',
    end: '2022-01',
    role: {
      en: 'Software Development Intern',
      it: 'Tirocinante in Sviluppo Software',
      fa: 'کارآموز توسعهٔ نرم‌افزار',
    },
    kind: { en: 'Internship', it: 'Tirocinio', fa: 'کارآموزی' },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    summary: {
      en: 'Built Angular & TypeScript UI components inside a cross-functional team at a Tehran management-consulting group.',
      it: 'Sviluppo di componenti UI in Angular e TypeScript in un team interfunzionale di un gruppo di consulenza direzionale a Teheran.',
      fa: 'ساخت کامپوننت‌های رابط کاربری با Angular و TypeScript در تیمی چندتخصصی در یک گروه مشاورهٔ مدیریت در تهران.',
    },
    highlights: {
      en: [
        'Delivered UI/UX modules end-to-end inside a cross-functional team.',
        'Daily stand-ups, code reviews and sprint delivery from day one.',
      ],
      it: [
        'Consegna di moduli UI/UX in un team interfunzionale.',
        'Daily meeting, code review e consegne a sprint fin dal primo giorno.',
      ],
      fa: [
        'تحویل ماژول‌های UI/UX به‌صورت کامل در یک تیم چندتخصصی.',
        'جلسات روزانه، بازبینی کد و تحویل اسپرینتی از همان روز اول.',
      ],
    },
    stack: ['angular', 'typescript', 'rxjs', 'html-css', 'ux', 'git'],
  },
  {
    id: 'vira',
    company: 'Vira Tarfand Arad',
    branch: 'tehran',
    start: '2018-04',
    end: '2021-03',
    role: {
      en: 'Co-founder & Web Developer',
      it: 'Co-fondatore e Sviluppatore Web',
      fa: 'هم‌بنیان‌گذار و توسعه‌دهنده وب',
    },
    kind: { en: 'Agency', it: 'Agenzia', fa: 'آژانس' },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    summary: {
      en: 'Co-founded and ran the technical side of a web agency building corporate sites and online stores for medical and pharmaceutical clients.',
      it: 'Co-fondazione e gestione tecnica di un’agenzia web: siti professionali ed e-commerce per clienti del settore medico e farmaceutico.',
      fa: 'هم‌بنیان‌گذاری و مدیریت فنی یک آژانس وب برای ساخت وب‌سایت‌های شرکتی و فروشگاه‌های آنلاین مشتریان حوزهٔ پزشکی و دارویی.',
    },
    highlights: {
      en: [
        'Three years running client delivery: scoping, design, build, hosting and support.',
        'WooCommerce/PHP stores for a regulated industry where trust and clarity sell.',
        'Learned to talk to clients, price work and own outcomes — not just tickets.',
      ],
      it: [
        'Tre anni di gestione dei progetti clienti: analisi, design, sviluppo, hosting e supporto.',
        'E-commerce WooCommerce/PHP per un settore regolamentato dove fiducia e chiarezza fanno vendere.',
        'Ho imparato a parlare con i clienti, preventivare e rispondere dei risultati, non solo dei ticket.',
      ],
      fa: [
        'سه سال مدیریت کامل پروژه‌های مشتری: نیازسنجی، طراحی، توسعه، میزبانی و پشتیبانی.',
        'فروشگاه‌های WooCommerce/PHP برای صنعتی که اعتماد و شفافیت در آن حرف اول را می‌زند.',
        'یاد گرفتم با مشتری صحبت کنم، قیمت‌گذاری کنم و مسئول نتیجه باشم، نه فقط تیکت.',
      ],
    },
    stack: ['php', 'javascript', 'html-css', 'sql', 'ux'],
  },
  {
    id: 'mehr',
    company: 'Mehr Gostar Samandis',
    branch: 'tehran',
    start: '2017-09',
    end: '2018-02',
    role: {
      en: 'Chief Technology Officer',
      it: 'Direttore Tecnico (CTO)',
      fa: 'مدیر ارشد فناوری (CTO)',
    },
    kind: { en: 'Startup', it: 'Startup', fa: 'استارتاپ' },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    summary: {
      en: 'Set the technology strategy and coordinated app and web development at an early-stage startup, until it closed for lack of investors.',
      it: 'Definizione della strategia tecnologica e coordinamento dello sviluppo di app e siti in una startup, fino alla chiusura per mancanza di investitori.',
      fa: 'تعیین راهبرد فناوری و هماهنگی توسعهٔ اپلیکیشن و وب در یک استارتاپ نوپا، تا زمان تعطیلی به‌دلیل نبود سرمایه‌گذار.',
    },
    highlights: {
      en: [
        'Chose the stack, planned the roadmap and coordinated the developers.',
        'An early lesson in how products die: not from code, but from runway.',
      ],
      it: [
        'Scelta dello stack, roadmap e coordinamento degli sviluppatori.',
        'Una lezione precoce: i prodotti non muoiono per il codice, ma per mancanza di runway.',
      ],
      fa: [
        'انتخاب استک فنی، برنامه‌ریزی نقشهٔ راه و هماهنگی توسعه‌دهندگان.',
        'درسی زودهنگام: محصول‌ها به‌خاطر کد نمی‌میرند، به‌خاطر تمام‌شدن سرمایه می‌میرند.',
      ],
    },
    stack: ['javascript', 'html-css', 'sql', 'git'],
  },
  {
    id: 'ircg',
    company: 'Iran Computer & Video Games Foundation',
    branch: 'tehran',
    start: '2013-05',
    end: '2015-08',
    role: {
      en: 'Game Development Intern',
      it: 'Tirocinante in Sviluppo Videogiochi',
      fa: 'کارآموز توسعهٔ بازی',
    },
    kind: { en: 'Internship', it: 'Tirocinio', fa: 'کارآموزی' },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    summary: {
      en: 'Where it all started: building games with Unity/C# and JavaScript — game logic, interactive UI and performance tuning.',
      it: 'Dove tutto è iniziato: videogiochi con Unity/C# e JavaScript — logica di gioco, UI interattiva e ottimizzazione delle performance.',
      fa: 'نقطهٔ شروع همه‌چیز: ساخت بازی با Unity/C# و JavaScript — منطق بازی، رابط تعاملی و بهینه‌سازی کارایی.',
    },
    highlights: {
      en: [
        'Started at 15 — the habit of chasing 60 fps never left; it shows in every UI since.',
        'Game loops, state machines and input handling: the roots of an interaction-first front-end mindset.',
      ],
      it: [
        'Ho iniziato a 15 anni: l’ossessione per i 60 fps non mi ha più lasciato e si vede in ogni UI.',
        'Game loop, macchine a stati e gestione dell’input: le radici di un approccio front-end orientato all’interazione.',
      ],
      fa: [
        'شروع در ۱۵ سالگی — وسواس ۶۰ فریم بر ثانیه از همان زمان ماند و در هر رابطی پیداست.',
        'حلقهٔ بازی، ماشین حالت و مدیریت ورودی: ریشه‌های نگاه تعامل‌محور به فرانت‌اند.',
      ],
    },
    stack: ['unity', 'javascript', 'cpp', 'ux'],
  },
];

export const PROJECTS: readonly Project[] = [
  {
    id: 'diar',
    name: 'DIAR Media',
    year: '2026',
    featured: true,
    url: 'https://diarofficial.com',
    palette: ['#155A8A', '#D4B038'],
    tagline: {
      en: 'A community news platform with an AI newsroom that never sleeps.',
      it: 'Una piattaforma di notizie partecipativa con una redazione AI sempre attiva.',
      fa: 'سکوی خبری مشارکتی با یک تحریریهٔ هوش مصنوعی که هرگز نمی‌خوابد.',
    },
    description: {
      en: 'The news outlet of Associazione DIAR. Persian-first, ten-language news site where readers submit, vote and discuss links while an autonomous agent drafts stories from 20 sources for human editors to approve from an installable PWA with push notifications. Built from zero: auth and roles, moderation, structured-data SEO, sitemaps and IndexNow.',
      it: 'La testata dell’Associazione DIAR. Sito di notizie in dieci lingue, con il persiano come lingua principale: i lettori propongono, votano e commentano link, mentre un agente autonomo scrive bozze da 20 fonti che gli editor approvano da una PWA installabile con notifiche push. Costruito da zero: autenticazione e ruoli, moderazione, SEO con dati strutturati, sitemap e IndexNow.',
      fa: 'رسانهٔ خبری انجمن دیار. سایت خبری ده‌زبانه با محوریت فارسی؛ کاربران لینک ارسال می‌کنند، رأی می‌دهند و گفت‌وگو می‌کنند و یک عامل خودکار از ۲۰ منبع پیش‌نویس خبر می‌نویسد تا سردبیران از طریق یک PWA قابل‌نصب با اعلان پوش تأییدش کنند. ساخته‌شده از صفر: احراز هویت و نقش‌ها، مدیریت محتوا، سئو با دادهٔ ساختاریافته، سایت‌مپ و IndexNow.',
    },
    role: { en: 'Full-stack · solo', it: 'Full-stack · in autonomia', fa: 'فول‌استک · انفرادی' },
    stack: ['nextjs', 'react', 'typescript', 'node', 'sql'],
  },
  {
    id: 'gharamatgate',
    name: 'Gharamatgate',
    year: '2025',
    featured: true,
    url: 'https://www.gharamatgate.com',
    palette: ['#8B1E1E', '#C9A227'],
    tagline: {
      en: 'An open investigative archive of the Iran–US compensation cases.',
      it: 'Un archivio investigativo aperto sui casi di risarcimento tra Iran e Stati Uniti.',
      fa: 'آرشیو تحقیقی و آزاد پرونده‌های غرامت میان ایران و آمریکا.',
    },
    description: {
      en: 'Persian-language research database that documents lawsuits, US court judgments and compensation payments involving the Islamic Republic — from the 1979 embassy hostage crisis and the Algiers Accords to today’s claims worth tens of billions of dollars. Searchable case files, topic categories and filters by person, year and organisation; independent and non-profit.',
      it: 'Database di ricerca in persiano che documenta cause, sentenze dei tribunali statunitensi e risarcimenti che coinvolgono la Repubblica Islamica: dalla crisi degli ostaggi del 1979 e dagli Accordi di Algeri fino alle richieste odierne da decine di miliardi di dollari. Fascicoli consultabili, categorie tematiche e filtri per persona, anno e organizzazione; progetto indipendente e non-profit.',
      fa: 'پایگاه دادهٔ پژوهشی فارسی که دعاوی، احکام دادگاه‌های آمریکا و پرداخت‌های غرامت مربوط به جمهوری اسلامی را مستند می‌کند؛ از گروگان‌گیری سفارت در ۱۹۷۹ و بیانیهٔ الجزایر تا ادعاهای امروزی به ارزش ده‌ها میلیارد دلار. پرونده‌های قابل جست‌وجو، دسته‌بندی موضوعی و فیلتر بر اساس فرد، سال و نهاد؛ مستقل و غیرانتفاعی.',
    },
    role: {
      en: 'Site admin · developer · contributing writer',
      it: 'Amministratore · sviluppatore · autore',
      fa: 'مدیر سایت · برنامه‌نویس و توسعه‌دهنده · نویسنده',
    },
    stack: ['php', 'javascript', 'html-css', 'sql', 'ux'],
  },
  {
    id: 'tulero',
    name: 'Tulero',
    year: '2023–24',
    featured: true,
    palette: ['#E4002B', '#1F2937'],
    tagline: {
      en: 'A B2B marketplace that puts half a million car parts one search away.',
      it: 'Un marketplace B2B che mette mezzo milione di ricambi a portata di ricerca.',
      fa: 'بازارگاه B2B که نیم میلیون قطعهٔ خودرو را در یک جست‌وجو در دسترس می‌گذارد.',
    },
    description: {
      en: 'Italian repair shops order spare parts straight from distribution platforms across the country — no middle dealer. As the only front-end engineer I designed and built the buyer-facing marketplace and the admin dashboard behind it.',
      it: 'Le officine italiane ordinano ricambi direttamente dalle piattaforme di distribuzione in tutto il Paese, senza intermediari. Da unico front-end engineer ho progettato e sviluppato il marketplace per gli acquirenti e la dashboard amministrativa.',
      fa: 'تعمیرگاه‌های ایتالیا قطعات را مستقیم از پلتفرم‌های توزیع سراسر کشور سفارش می‌دهند، بدون واسطه. به‌عنوان تنها مهندس فرانت‌اند، بازارگاه خریداران و داشبورد مدیریتی پشت آن را طراحی و پیاده‌سازی کردم.',
    },
    role: {
      en: 'Sole front-end engineer',
      it: 'Unico front-end engineer',
      fa: 'تنها مهندس فرانت‌اند',
    },
    stack: ['angular', 'react', 'vue', 'node', 'mongodb'],
  },
  {
    id: 'biu',
    name: 'BIU Startup MVPs',
    year: '2025–',
    featured: true,
    palette: ['#7C4DFF', '#00C2A8'],
    tagline: {
      en: 'From pitch deck to product for the next wave of Turin startups.',
      it: 'Dal pitch deck al prodotto per la nuova ondata di startup torinesi.',
      fa: 'از پیچ‌دک تا محصول برای موج تازهٔ استارتاپ‌های تورین.',
    },
    description: {
      en: 'Landing pages, web apps and clickable MVPs for teams in the Politecnico di Torino × ESCP acceleration programme — fast enough to test with real users, solid enough to grow into the real thing.',
      it: 'Landing page, web app e MVP cliccabili per i team del programma di accelerazione Politecnico di Torino × ESCP: abbastanza veloci da testare con utenti reali, abbastanza solidi da diventare il prodotto vero.',
      fa: 'لندینگ‌پیج، وب‌اپ و MVP قابل‌کلیک برای تیم‌های برنامهٔ شتاب‌دهی پلی‌تکنیک تورین × ESCP؛ آن‌قدر سریع که با کاربر واقعی آزموده شود و آن‌قدر محکم که به محصول اصلی تبدیل شود.',
    },
    role: { en: 'Front-end developer', it: 'Front-end developer', fa: 'توسعه‌دهندهٔ فرانت‌اند' },
    stack: ['angular', 'typescript', 'html-css', 'ux'],
  },
  {
    id: 'pharma',
    name: 'Medical & Pharma Commerce',
    year: '2018–21',
    palette: ['#00A6A6', '#0B2945'],
    tagline: {
      en: 'Online stores and sites for clinics, labs and pharma distributors.',
      it: 'E-commerce e siti per cliniche, laboratori e distributori farmaceutici.',
      fa: 'فروشگاه‌ها و سایت‌های آنلاین برای کلینیک‌ها، آزمایشگاه‌ها و توزیع‌کنندگان دارو.',
    },
    description: {
      en: 'A portfolio of WooCommerce/PHP builds delivered through Vira Tarfand Arad, the agency I co-founded — from brief and design to hosting and long-term support.',
      it: 'Una serie di progetti WooCommerce/PHP realizzati con Vira Tarfand Arad, l’agenzia che ho co-fondato: dal brief al design, fino a hosting e supporto.',
      fa: 'مجموعه‌ای از پروژه‌های WooCommerce/PHP که با ویرا ترفند آراد، آژانسی که هم‌بنیان‌گذارش بودم، تحویل شد؛ از بریف و طراحی تا میزبانی و پشتیبانی بلندمدت.',
    },
    role: {
      en: 'Co-founder · tech lead',
      it: 'Co-fondatore · tech lead',
      fa: 'هم‌بنیان‌گذار · سرپرست فنی',
    },
    stack: ['php', 'javascript', 'html-css', 'sql'],
  },
  {
    id: 'vue-search',
    name: 'Vue Repository Search',
    year: '2025',
    repo: 'https://github.com/amirdirv/vue-repository-search',
    palette: ['#42B883', '#35495E'],
    tagline: {
      en: 'A lean GitHub repository explorer built with Vue.',
      it: 'Un esploratore di repository GitHub essenziale, costruito con Vue.',
      fa: 'جست‌وجوگر سبک مخازن گیت‌هاب با Vue.',
    },
    description: {
      en: 'Searches the GitHub API as you type and presents results in a clean, responsive list — a small study in reactive state and API ergonomics.',
      it: 'Interroga l’API di GitHub mentre scrivi e mostra i risultati in una lista pulita e responsive: un piccolo studio su stato reattivo ed ergonomia delle API.',
      fa: 'هم‌زمان با تایپ، API گیت‌هاب را جست‌وجو می‌کند و نتایج را در فهرستی تمیز و واکنش‌گرا نشان می‌دهد؛ تمرینی کوچک در وضعیت واکنشی و کار با API.',
    },
    role: { en: 'Open source', it: 'Open source', fa: 'متن‌باز' },
    stack: ['vue', 'javascript', 'html-css'],
  },
  {
    id: 'portfolio',
    name: 'This Portfolio',
    year: '2026',
    repo: 'https://github.com/amirdirv/amir-iravani-portfolio',
    palette: ['#FF2E63', '#FFB300'],
    tagline: {
      en: 'Angular 22, zoneless, signals all the way down — in three languages.',
      it: 'Angular 22, zoneless, signal ovunque — in tre lingue.',
      fa: 'Angular 22 بدون Zone.js، سراسر سیگنال — به سه زبان.',
    },
    description: {
      en: 'A live signal graph of my skills, a git-log career timeline, a command palette, a working terminal and runtime EN/IT/FA switching with full RTL — and it prints as a one-page CV.',
      it: 'Un grafo di signal delle mie competenze, una carriera in stile git log, una command palette, un terminale funzionante e cambio lingua EN/IT/FA con RTL completo — e si stampa come CV di una pagina.',
      fa: 'گراف زندهٔ سیگنال مهارت‌ها، تایم‌لاین شغلی به سبک git log، پالت فرمان، ترمینال واقعی و تغییر زبان EN/IT/FA با پشتیبانی کامل راست‌به‌چپ؛ و قابل چاپ به‌عنوان رزومهٔ یک‌صفحه‌ای.',
    },
    role: { en: 'Design & build', it: 'Design e sviluppo', fa: 'طراحی و توسعه' },
    stack: ['angular', 'typescript', 'rxjs', 'html-css', 'ux'],
  },
];

export const EDUCATION: readonly Education[] = [
  {
    id: 'polito',
    degree: {
      en: 'Master’s studies in Computer Engineering',
      it: 'Studi magistrali in Ingegneria Informatica',
      fa: 'دورهٔ کارشناسی ارشد مهندسی کامپیوتر',
    },
    school: {
      en: 'Politecnico di Torino',
      it: 'Politecnico di Torino',
      fa: 'دانشگاه پلی‌تکنیک تورین',
    },
    city: { en: 'Turin, Italy', it: 'Torino, Italia', fa: 'تورین، ایتالیا' },
    start: '2022-09',
    end: '2025-07',
    url: 'https://www.polito.it',
  },
  {
    id: 'azad',
    degree: {
      en: 'BSc, Computer Engineering',
      it: 'Laurea Triennale in Ingegneria Informatica',
      fa: 'کارشناسی مهندسی کامپیوتر',
    },
    school: {
      en: 'Islamic Azad University, West Tehran Branch',
      it: 'Università Islamica Azad, sede di Teheran Ovest',
      fa: 'دانشگاه آزاد اسلامی واحد تهران غرب',
    },
    city: { en: 'Tehran, Iran', it: 'Teheran, Iran', fa: 'تهران، ایران' },
    start: '2016-09',
    end: '2022-01',
    url: 'https://www.wtiau.ir',
  },
];

export const SPOKEN_LANGUAGES: readonly SpokenLanguage[] = [
  { name: { en: 'Persian', it: 'Persiano', fa: 'فارسی' }, level: 'native' },
  {
    name: { en: 'English', it: 'Inglese', fa: 'انگلیسی' },
    level: 'C1',
    detail: ['C1', 'C1', 'C1', 'C1', 'C1'],
  },
  {
    name: { en: 'Italian', it: 'Italiano', fa: 'ایتالیایی' },
    level: 'B1',
    detail: ['B1', 'B1', 'A2', 'A2', 'B1'],
  },
];
