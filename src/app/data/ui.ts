import { Localized, LocalizedList } from '../core/models';

/**
 * Interface copy, grouped by section. Every leaf is a `Localized` (or a
 * `LocalizedList`); `I18nService.ui()` resolves the whole tree for the
 * active language so templates can write `ui().hero.title`.
 */
export const UI = {
  meta: {
    title: {
      en: 'Amir Iravani — Front-End Engineer (Angular) in Turin',
      it: 'Amir Iravani — Front-End Engineer (Angular) a Torino',
      fa: 'امیر ایروانی — مهندس فرانت‌اند (Angular) در تورین',
    },
    description: {
      en: 'Front-end engineer with 10+ years of experience in Angular, React and Vue. MSc student at Politecnico di Torino, available full-time in Italy.',
      it: 'Front-end engineer con oltre 10 anni di esperienza in Angular, React e Vue. Studente magistrale al Politecnico di Torino, disponibile full-time in Italia.',
      fa: 'مهندس فرانت‌اند با بیش از ۱۰ سال تجربه در Angular، React و Vue. دانشجوی ارشد پلی‌تکنیک تورین، آمادهٔ همکاری تمام‌وقت در ایتالیا.',
    },
  },
  common: {
    skip: { en: 'Skip to content', it: 'Vai al contenuto', fa: 'رفتن به محتوا' },
    menu: { en: 'Menu', it: 'Menu', fa: 'منو' },
    close: { en: 'Close', it: 'Chiudi', fa: 'بستن' },
    theme: { en: 'Toggle colour theme', it: 'Cambia tema', fa: 'تغییر پوسته' },
    language: { en: 'Language', it: 'Lingua', fa: 'زبان' },
    present: { en: 'Present', it: 'Attuale', fa: 'اکنون' },
    commandHint: { en: 'Command palette', it: 'Command palette', fa: 'پالت فرمان' },
  },
  nav: {
    about: { en: 'About', it: 'Chi sono', fa: 'درباره' },
    skills: { en: 'Skills', it: 'Competenze', fa: 'مهارت‌ها' },
    experience: { en: 'Experience', it: 'Esperienza', fa: 'سوابق' },
    projects: { en: 'Projects', it: 'Progetti', fa: 'پروژه‌ها' },
    education: { en: 'Education', it: 'Formazione', fa: 'تحصیلات' },
    contact: { en: 'Contact', it: 'Contatti', fa: 'تماس' },
  },
  hero: {
    hello: { en: 'Hi, I’m', it: 'Ciao, sono', fa: 'سلام، من' },
    firstName: { en: 'Amir', it: 'Amir', fa: 'امیر' },
    lastName: { en: 'Iravani', it: 'Iravani', fa: 'ایروانی' },
    pun: {
      en: 'A.I. — the human kind.',
      it: 'A.I. — la versione umana.',
      fa: 'A.I. — از نوع انسانی‌اش.',
    },
    roles: {
      en: [
        'Front-end engineer',
        'Angular specialist',
        'Ex-CTO',
        'Agency co-founder',
        'Interface obsessive',
      ],
      it: [
        'Front-end engineer',
        'Specialista Angular',
        'Ex CTO',
        'Co-fondatore di agenzia',
        'Ossessionato dalle interfacce',
      ],
      fa: [
        'مهندس فرانت‌اند',
        'متخصص Angular',
        'مدیر فنی سابق',
        'هم‌بنیان‌گذار آژانس',
        'وسواسی رابط کاربری',
      ],
    } satisfies LocalizedList,
    lead: {
      en: 'I build fast, accessible interfaces that people enjoy using — from B2B marketplaces to startup MVPs. Ten-plus years, two countries, one obsession: the details between a click and a feeling.',
      it: 'Costruisco interfacce veloci e accessibili che le persone amano usare, dai marketplace B2B agli MVP delle startup. Oltre dieci anni, due Paesi, un’ossessione: i dettagli tra un clic e un’emozione.',
      fa: 'رابط‌هایی سریع و دسترس‌پذیر می‌سازم که کاربران از کار با آن‌ها لذت ببرند؛ از بازارگاه‌های B2B تا MVP استارتاپ‌ها. بیش از ده سال، دو کشور، یک وسواس: جزئیات میان یک کلیک و یک حس.',
    },
    available: {
      en: 'Available for full-time roles in Italy',
      it: 'Disponibile per ruoli full-time in Italia',
      fa: 'آمادهٔ همکاری تمام‌وقت در ایتالیا',
    },
    ctaWork: { en: 'Explore my work', it: 'Scopri i miei lavori', fa: 'نمونه‌کارها' },
    ctaContact: { en: 'Let’s talk', it: 'Parliamone', fa: 'گفت‌وگو کنیم' },
    scroll: { en: 'Scroll', it: 'Scorri', fa: 'اسکرول' },
    statYears: {
      en: 'years shipping UI',
      it: 'anni di UI in produzione',
      fa: 'سال ساخت رابط کاربری',
    },
    statRoles: {
      en: 'roles, intern to CTO',
      it: 'ruoli, da stagista a CTO',
      fa: 'نقش، از کارآموز تا CTO',
    },
    statFrameworks: { en: 'major frameworks', it: 'framework principali', fa: 'فریم‌ورک اصلی' },
    statLanguages: { en: 'spoken languages', it: 'lingue parlate', fa: 'زبان گفتاری' },
  },
  about: {
    kicker: { en: '01 · About', it: '01 · Chi sono', fa: '۰۱ · درباره' },
    title: {
      en: 'Engineer by training. Craftsman by habit.',
      it: 'Ingegnere per formazione. Artigiano per abitudine.',
      fa: 'مهندس به‌واسطهٔ تحصیل. صنعتگر به‌واسطهٔ عادت.',
    },
    body: {
      en: [
        'I wrote my first game loop at fifteen in Tehran. Since then I’ve been an intern, a CTO, an agency co-founder and — for the last few years — the engineer startups and product teams in Turin call when an interface has to be right.',
        'Angular is my home base; React and Vue are the neighbourhoods I know by heart. I care about the boring things that make products feel effortless: performance budgets, accessible markup, honest loading states and design systems that scale.',
        'Today I’m finishing my MSc in Computer Engineering at Politecnico di Torino and looking for a full-time team in Italy that wants a front-end engineer who thinks like a product owner.',
      ],
      it: [
        'Ho scritto il mio primo game loop a quindici anni a Teheran. Da allora sono stato stagista, CTO, co-fondatore di un’agenzia e, negli ultimi anni, l’ingegnere che startup e team di prodotto a Torino chiamano quando un’interfaccia deve essere perfetta.',
        'Angular è la mia casa; React e Vue sono quartieri che conosco a memoria. Curo le cose noiose che rendono un prodotto naturale: performance budget, markup accessibile, stati di caricamento onesti e design system che scalano.',
        'Oggi sto completando la Laurea Magistrale in Ingegneria Informatica al Politecnico di Torino e cerco un team full-time in Italia che voglia un front-end engineer che ragiona come un product owner.',
      ],
      fa: [
        'اولین حلقهٔ بازی‌ام را در پانزده‌سالگی در تهران نوشتم. از آن زمان کارآموز، مدیر فنی، هم‌بنیان‌گذار آژانس و در چند سال اخیر مهندسی بوده‌ام که استارتاپ‌ها و تیم‌های محصول در تورین وقتی رابط کاربری باید بی‌نقص باشد سراغش می‌آیند.',
        'Angular خانهٔ من است؛ React و Vue محله‌هایی‌اند که از بَرم. به چیزهای به‌ظاهر کسل‌کننده‌ای اهمیت می‌دهم که محصول را روان می‌کنند: بودجهٔ کارایی، نشانه‌گذاری دسترس‌پذیر، وضعیت‌های بارگذاری صادقانه و دیزاین‌سیستم‌هایی که مقیاس‌پذیرند.',
        'اکنون در حال اتمام کارشناسی ارشد مهندسی کامپیوتر در پلی‌تکنیک تورین هستم و به دنبال تیمی تمام‌وقت در ایتالیا که مهندس فرانت‌اندی با نگاه مالک محصول بخواهد.',
      ],
    } satisfies LocalizedList,
    factBased: { en: 'Based in', it: 'Base', fa: 'محل زندگی' },
    factStudy: { en: 'Studying', it: 'Studio', fa: 'تحصیل' },
    factStudyValue: {
      en: 'MSc · Politecnico di Torino',
      it: 'LM · Politecnico di Torino',
      fa: 'ارشد · پلی‌تکنیک تورین',
    },
    factWork: { en: 'Work permit', it: 'Permesso di lavoro', fa: 'مجوز کار' },
    factWorkValue: {
      en: 'Italy · unrestricted, full-time',
      it: 'Italia · senza restrizioni, full-time',
      fa: 'ایتالیا · بدون محدودیت، تمام‌وقت',
    },
    factCommunity: { en: 'Community', it: 'Comunità', fa: 'جامعه' },
    factCommunityValue: {
      en: 'Iranian student network in Italy',
      it: 'Rete degli studenti iraniani in Italia',
      fa: 'شبکهٔ دانشجویان ایرانی در ایتالیا',
    },
    portraitHint: {
      en: 'Hover to render',
      it: 'Passa sopra per il render',
      fa: 'برای رندر نگه دارید',
    },
  },
  skills: {
    kicker: { en: '02 · Skills', it: '02 · Competenze', fa: '۰۲ · مهارت‌ها' },
    title: {
      en: 'Everything is a signal.',
      it: 'Tutto è un signal.',
      fa: 'همه‌چیز یک سیگنال است.',
    },
    lead: {
      en: 'My stack, wired like an Angular signal graph. Pick a skill and watch it propagate to every role where I used it in production — computed live, no hand-drawn lines.',
      it: 'Il mio stack, collegato come un grafo di signal Angular. Scegli una competenza e guardala propagarsi a ogni ruolo in cui l’ho usata in produzione — calcolato dal vivo.',
      fa: 'استک من، سیم‌کشی‌شده مثل گراف سیگنال Angular. یک مهارت را انتخاب کنید و ببینید چطور به همهٔ نقش‌هایی که در آن‌ها به کارش برده‌ام منتشر می‌شود — به‌صورت زنده محاسبه می‌شود.',
    },
    usedAt: { en: 'Used in production at', it: 'Usata in produzione presso', fa: 'استفاده‌شده در' },
    pick: {
      en: 'Select a skill or a role to trace its signal.',
      it: 'Seleziona una competenza o un ruolo per tracciarne il signal.',
      fa: 'یک مهارت یا نقش را انتخاب کنید تا سیگنالش را ببینید.',
    },
    roleUses: {
      en: 'Stack used in this role',
      it: 'Stack usato in questo ruolo',
      fa: 'استک این نقش',
    },
    reset: { en: 'Reset', it: 'Reset', fa: 'بازنشانی' },
    groupFrontend: { en: 'Front-end', it: 'Front-end', fa: 'فرانت‌اند' },
    groupBackend: { en: 'Back-end', it: 'Back-end', fa: 'بک‌اند' },
    groupLanguage: { en: 'Languages', it: 'Linguaggi', fa: 'زبان‌ها' },
    groupTooling: { en: 'Craft & tooling', it: 'Metodo e strumenti', fa: 'ابزار و روش' },
    approachTitle: { en: 'How I work', it: 'Come lavoro', fa: 'روش کار من' },
    approach: {
      en: [
        'HTML, CSS/SCSS, JavaScript and TypeScript as a foundation — frameworks come and go.',
        'Angular first; React and Vue whenever the team’s stack calls for them.',
        'Responsive, performant and accessible by default, with an eye for visual detail.',
        'Enough Node.js, SQL and MongoDB to integrate REST APIs on my own and speak the back-end team’s language.',
        'Own the whole front-end lifecycle: from requirements to production.',
      ],
      it: [
        'HTML, CSS/SCSS, JavaScript e TypeScript come fondamenta: i framework passano.',
        'Angular prima di tutto; React e Vue quando lo stack del team lo richiede.',
        'Responsive, performante e accessibile di default, con attenzione al dettaglio visivo.',
        'Abbastanza Node.js, SQL e MongoDB per integrare REST API in autonomia e parlare la lingua del back-end.',
        'Gestione dell’intero ciclo front-end: dai requisiti alla produzione.',
      ],
      fa: [
        'HTML، CSS/SCSS، JavaScript و TypeScript به‌عنوان پایه؛ فریم‌ورک‌ها می‌آیند و می‌روند.',
        'اول Angular؛ و React و Vue هرجا که استک تیم بخواهد.',
        'واکنش‌گرا، سریع و دسترس‌پذیر به‌طور پیش‌فرض، با دقت در جزئیات بصری.',
        'به‌قدر کافی Node.js، SQL و MongoDB برای یکپارچه‌سازی مستقل REST APIها و هم‌زبانی با تیم بک‌اند.',
        'مالکیت کامل چرخهٔ فرانت‌اند: از نیازمندی تا انتشار.',
      ],
    } satisfies LocalizedList,
  },
  experience: {
    kicker: { en: '03 · Experience', it: '03 · Esperienza', fa: '۰۳ · سوابق' },
    title: {
      en: 'git log --graph --career',
      it: 'git log --graph --carriera',
      fa: 'git log --graph --career',
    },
    lead: {
      en: 'Thirteen years as a commit history. Two branches — Tehran and Turin — merged in 2022 when I moved to Italy for my master’s.',
      it: 'Tredici anni come cronologia di commit. Due branch — Teheran e Torino — unite nel 2022 quando mi sono trasferito in Italia per la magistrale.',
      fa: 'سیزده سال در قالب تاریخچهٔ کامیت. دو شاخه — تهران و تورین — که در ۲۰۲۲ با مهاجرتم به ایتالیا برای ارشد ادغام شدند.',
    },
    merge: {
      en: 'Merge branch “tehran” into “turin” — relocated to Italy for an MSc at Politecnico di Torino',
      it: 'Merge del branch “tehran” in “turin” — trasferimento in Italia per la magistrale al Politecnico di Torino',
      fa: 'ادغام شاخهٔ «tehran» در «turin» — مهاجرت به ایتالیا برای ارشد در پلی‌تکنیک تورین',
    },
    init: {
      en: 'Initial commit — first game loop, age 15',
      it: 'Initial commit — primo game loop, a 15 anni',
      fa: 'کامیت اول — اولین حلقهٔ بازی، پانزده‌سالگی',
    },
    head: {
      en: 'HEAD → open to new roles',
      it: 'HEAD → aperto a nuovi ruoli',
      fa: 'HEAD → آمادهٔ نقش جدید',
    },
    expand: { en: 'Show details', it: 'Mostra dettagli', fa: 'نمایش جزئیات' },
    collapse: { en: 'Hide details', it: 'Nascondi dettagli', fa: 'پنهان کردن جزئیات' },
    yr: { en: 'yr', it: 'a', fa: 'سال' },
    mo: { en: 'mo', it: 'm', fa: 'ماه' },
  },
  projects: {
    kicker: { en: '04 · Projects', it: '04 · Progetti', fa: '۰۴ · پروژه‌ها' },
    title: {
      en: 'Selected work.',
      it: 'Lavori selezionati.',
      fa: 'نمونه‌کارهای منتخب.',
    },
    lead: {
      en: 'Products I designed, built or led — each card’s cover is generated from the project’s own palette.',
      it: 'Prodotti che ho progettato, costruito o guidato: ogni copertina è generata dalla palette del progetto.',
      fa: 'محصولاتی که طراحی کرده‌ام، ساخته‌ام یا رهبری‌شان کرده‌ام؛ کاور هر کارت از پالت رنگ خود پروژه تولید می‌شود.',
    },
    visit: { en: 'Visit', it: 'Visita', fa: 'مشاهده' },
    code: { en: 'Code', it: 'Codice', fa: 'کد' },
    featured: { en: 'Featured', it: 'In evidenza', fa: 'ویژه' },
    private: {
      en: 'Private / client work',
      it: 'Lavoro privato / cliente',
      fa: 'پروژهٔ خصوصی / مشتری',
    },
  },
  education: {
    kicker: { en: '05 · Education', it: '05 · Formazione', fa: '۰۵ · تحصیلات' },
    title: {
      en: 'Learning, formally and otherwise.',
      it: 'Imparare, in aula e non solo.',
      fa: 'یادگیری، رسمی و غیررسمی.',
    },
    languagesTitle: {
      en: 'Languages I speak',
      it: 'Lingue che parlo',
      fa: 'زبان‌هایی که صحبت می‌کنم',
    },
    native: { en: 'Native', it: 'Madrelingua', fa: 'زبان مادری' },
    ongoing: { en: 'In progress', it: 'In corso', fa: 'در حال تحصیل' },
    cefr: {
      en: ['Listening', 'Reading', 'Speaking', 'Interaction', 'Writing'],
      it: ['Ascolto', 'Lettura', 'Produzione orale', 'Interazione', 'Scrittura'],
      fa: ['شنیدن', 'خواندن', 'گفتار', 'تعامل', 'نوشتن'],
    } satisfies LocalizedList,
  },
  contact: {
    kicker: { en: '06 · Contact', it: '06 · Contatti', fa: '۰۶ · تماس' },
    title: {
      en: 'Have an interface that has to be right?',
      it: 'Hai un’interfaccia che deve essere perfetta?',
      fa: 'رابط کاربری‌ای دارید که باید بی‌نقص باشد؟',
    },
    lead: {
      en: 'I’m open to full-time front-end roles in Italy and selected freelance work. Write a few lines — the message opens in your own mail app, nothing is stored here.',
      it: 'Sono disponibile per ruoli front-end full-time in Italia e per progetti freelance selezionati. Scrivi due righe: il messaggio si apre nella tua app di posta, qui non viene salvato nulla.',
      fa: 'آمادهٔ همکاری تمام‌وقت فرانت‌اند در ایتالیا و پروژه‌های فریلنس منتخب هستم. چند خط بنویسید؛ پیام در برنامهٔ ایمیل خودتان باز می‌شود و اینجا چیزی ذخیره نمی‌شود.',
    },
    name: { en: 'Your name', it: 'Il tuo nome', fa: 'نام شما' },
    company: { en: 'Company (optional)', it: 'Azienda (facoltativo)', fa: 'شرکت (اختیاری)' },
    message: { en: 'What are we building?', it: 'Cosa costruiamo?', fa: 'قرار است چه بسازیم؟' },
    send: { en: 'Compose email', it: 'Scrivi l’email', fa: 'نوشتن ایمیل' },
    copy: { en: 'Copy address', it: 'Copia indirizzo', fa: 'کپی نشانی' },
    copied: { en: 'Copied!', it: 'Copiato!', fa: 'کپی شد!' },
    subject: {
      en: 'Hello from your portfolio',
      it: 'Ciao dal tuo portfolio',
      fa: 'سلام از طریق وب‌سایت',
    },
    required: {
      en: 'Please add your name and a message.',
      it: 'Inserisci nome e messaggio.',
      fa: 'لطفاً نام و پیام را وارد کنید.',
    },
    elsewhere: { en: 'Elsewhere', it: 'Altrove', fa: 'جاهای دیگر' },
  },
  footer: {
    built: {
      en: 'Designed & built by Amir Iravani with Angular 22 · zoneless · signals.',
      it: 'Progettato e sviluppato da Amir Iravani con Angular 22 · zoneless · signals.',
      fa: 'طراحی و توسعه توسط امیر ایروانی با Angular 22 · بدون Zone · سیگنال‌ها.',
    },
    print: { en: 'Print as CV', it: 'Stampa come CV', fa: 'چاپ به‌صورت رزومه' },
    source: { en: 'Source on GitHub', it: 'Codice su GitHub', fa: 'سورس در گیت‌هاب' },
    top: { en: 'Back to top', it: 'Torna su', fa: 'بازگشت به بالا' },
    tips: {
      en: 'Tip: press Ctrl K for the command palette, or ` for a terminal.',
      it: 'Suggerimento: premi Ctrl K per la command palette, o ` per il terminale.',
      fa: 'نکته: Ctrl K برای پالت فرمان، و ` برای ترمینال.',
    },
  },
  palette: {
    placeholder: {
      en: 'Type a command or search…',
      it: 'Digita un comando o cerca…',
      fa: 'فرمانی بنویسید یا جست‌وجو کنید…',
    },
    navigate: { en: 'Go to', it: 'Vai a', fa: 'رفتن به' },
    actions: { en: 'Actions', it: 'Azioni', fa: 'کارها' },
    links: { en: 'Links', it: 'Link', fa: 'پیوندها' },
    empty: { en: 'No results', it: 'Nessun risultato', fa: 'نتیجه‌ای نیست' },
    openTerminal: { en: 'Open terminal', it: 'Apri terminale', fa: 'باز کردن ترمینال' },
    toggleTheme: {
      en: 'Toggle light/dark theme',
      it: 'Cambia tema chiaro/scuro',
      fa: 'تغییر پوستهٔ روشن/تیره',
    },
    copyEmail: { en: 'Copy email address', it: 'Copia indirizzo email', fa: 'کپی نشانی ایمیل' },
    print: { en: 'Print CV', it: 'Stampa CV', fa: 'چاپ رزومه' },
    switchLang: { en: 'Switch language to', it: 'Cambia lingua in', fa: 'تغییر زبان به' },
    hint: {
      en: '↑↓ to move · Enter to run · Esc to close',
      it: '↑↓ per muoverti · Invio per eseguire · Esc per chiudere',
      fa: '↑↓ حرکت · Enter اجرا · Esc بستن',
    },
  },
} as const;

export type UiTree = typeof UI;

/** Leaves of `UI` are the only things that get resolved; everything else is a namespace. */
type Resolve<T> = T extends Localized
  ? string
  : T extends LocalizedList
    ? readonly string[]
    : { readonly [K in keyof T]: Resolve<T[K]> };

export type ResolvedUi = Resolve<UiTree>;
