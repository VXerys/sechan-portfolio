// Every fact here traces to a VERIFIED entry in the about-me knowledge base (files 03, 06, 07, 08, 09 and the
// 14 Oct 2026 corrections in 16). Update those sources first, then this file (BR-001).

export type Link = { label: string; href: string };
export type Profile = {
  name: string;
  shortName: string;
  role: string;
  headline: string; // headline: one strong line for the hero, <= 12 words
  intro: string; // 1-2 sentences under the hero
  location: string;
  availability: string;
  about: string[]; // 2-4 short paragraphs
  manifesto: { text: string; accent: string }; // the "How I work" line from about[3], split for typesetting
  email: string | null;
  links: Link[];
};
export type Project = {
  slug: string;
  title: string;
  client: string | null;
  year: string;
  role: string;
  category: string;
  summary: string; // one sentence
  problem: string;
  contribution: string[];
  stack: string[];
  outcomes: string[]; // verified only, may be []
  status: string;
  links: Link[];
  featured: boolean;
  imageHint: string;
};
// legalName is shown small under the brand, so a reader can match the company on official records.
export type Experience = { company: string; legalName?: string; role: string; period: string; points: string[] };
// No capstone field: about-me records no VERIFIED capstone partner, so the card cannot name one (BR-011).
export type Program = { name: string; path: string; role: string; period: string; status: string };
// Projects are referenced by slug so a chip can only point at a case study or More work row that exists.
// context is null where about-me records no course or context for the project.
export type EducationProject = { slug: string; context: string | null };
export type Education = {
  label: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  projectsLabel: string;
  projects: EducationProject[];
};
export type Achievement = { title: string; issuer: string; year: string; note: string | null };
export type SkillGroup = { group: string; items: string[] };
// Availability copy follows the owner's positioning decision of 2026-10-16: freelance first, then full-time, then internships.
export type Contact = { ctaLabel: string; subject: string; body: string; hiringLabel: string };

// Canonical origin. The apex sechanalfarisi.dev 308-redirects here (Vercel domain setting, 2026-10-16).
export const siteUrl = "https://www.sechanalfarisi.dev";

export const profile: Profile = {
  name: "M Sechan Alfarisi",
  shortName: "Sechan",
  role: "Full-Stack Mobile Software Engineer and Applied AI Engineer",
  headline: "I build mobile and web products that real people use.",
  intro:
    "A reading app on Google Play, a clinic system that replaced spreadsheets, and a marketplace that won national startup funding. I take on freelance builds for businesses, and I'm open to full-time roles and internships.",
  location: "Sukabumi, West Java, Indonesia",
  availability:
    "Available for freelance mobile and web projects, from first spec to launch. Also open to full-time roles and 3 to 6 month internships, remote or hybrid (Sukabumi, Bandung, Jakarta).",
  about: [
    "I study Informatics Engineering at Universitas Nusa Putra (GPA 3.73/4.00, expected graduation 2027) and work across Flutter, React Native, Next.js and Supabase, with applied AI on top.",
    "I'm Co-Founder and CTO of Marketiv, a marketplace that connects Indonesian MSMEs with local micro-creators. The team was funded by P2MW 2026 and received Juara Harapan 2 at KMI EXPO 2026. I'm also a Mobile Software Engineer Intern at Mangcoding, where I'm the main contributor to BookMate on Google Play, and I take freelance full-stack work for local businesses.",
    "On the AI side, I was first author of a SENTIMETER 2026 paper on a voice shopping assistant that runs speech recognition on the phone and sends only text to an LLM, so it stays usable on weak in-store signal. I'm currently in the Next-Gen AI Engineer path of Asah led by Dicoding.",
    "How I work: I plan before I build, test every rule that touches money or patient data, and enforce access in the database, so a broken screen can't get around it.",
  ],
  manifesto: {
    text: "I plan before I build, test every rule that touches money or patient data, and enforce access in the database,",
    accent: "so a broken screen can't get around it.",
  },
  email: "sehanalfarisi9@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/VXerys" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sehanalfarisi/" },
  ],
};

export const projects: Project[] = [
  {
    slug: "bookmate",
    title: "BookMate",
    client: "Mangcoding",
    year: "2026",
    role: "Mobile Software Engineer Intern, main contributor (Flutter and Supabase)",
    category: "Mobile app",
    summary:
      "A reading-community app on Google Play for tracking reading progress, writing reflections and borrowing books.",
    problem:
      "Most reading trackers only log page counts and give readers no reason to come back. Progress across chapters is hard to follow, and reflections end up scattered in separate note apps with no community around them.",
    contribution: [
      "Wrote 286 of 326 non-merge commits across Flutter (GetX, Clean Architecture: DataSource, Repository, UseCase, Controller, UI) and Supabase.",
      "Built the reading activity tracker (pages, chapters, percentage, daily reflection) on an atomic Postgres function, record_reading_activity_atomic, so two updates arriving together cannot reset a book's progress.",
      "Built the Book Reflection Studio: an editorial layout with Newsreader and Inter type, floating section navigation and an embedded 16:9 YouTube player.",
      "Built a tarot-themed badge system with celebration animations and a three-badge showcase on reader profiles.",
      "Fixed a Postgres 22P02 crash in the genre filter by rewriting the JSONB query with the containment operator.",
      "Tightened Supabase row-level security and reduced release size with WebP assets and ProGuard shrinking.",
    ],
    stack: ["Flutter", "Dart", "GetX", "Supabase", "PostgreSQL"],
    outcomes: ["Live on Google Play (developer: Mangcoding)"],
    status: "Live on Google Play",
    // The website comes first: it is what the case study's recording shows, so the frame opens it.
    links: [
      { label: "Website", href: "https://bookmate-web.vercel.app" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.mangcoding.bookmate2",
      },
    ],
    featured: true,
    imageHint: "BookMate Google Play listing or reading activity screen, phone frame",
  },
  {
    slug: "marketiv",
    title: "Marketiv",
    client: null,
    year: "2026",
    role: "Co-Founder & CTO",
    category: "Marketplace",
    summary:
      "A marketplace that connects Indonesian MSMEs with local micro-creators through pay-per-view campaigns and fixed-price rate cards.",
    problem:
      "Small businesses in cities like Sukabumi need digital promotion but cannot risk paying for ads up front. Marketiv offers two modes: pay-per-view campaigns with no chat, and fixed-price rate cards with escrow and chat.",
    contribution: [
      "Lead the web platform in Next.js 16, React 19, TypeScript and Tailwind CSS v4. Authored 231 of 398 non-merge commits in the main repository.",
      "Separated the MSME and creator dashboards at the layout level so they share no client state, checked by an automated data-contract script.",
      "Co-built the Appwrite backend with the CEO: Cloud Functions for Midtrans payments, escrow, creator withdrawals with a balance guard, and an AI campaign brief generator on Vertex AI.",
      "Added idempotency keys to checkout so a double tap or a retry on a weak connection cannot create a second payment.",
      "Matched Zod schemas to Appwrite column sizes so long forms show field-level errors before submitting instead of a generic 400.",
      "Moved the admin dashboard into its own Next.js app with fail-closed role checks (admin, staff).",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Appwrite", "Midtrans", "Vertex AI", "Vitest", "Playwright"],
    outcomes: [
      "Funded by P2MW 2026 (Kemendikbudristek RI)",
      "Team award: Juara Harapan 2, KMI EXPO 2026, Digital Business (Early Stage)",
    ],
    status: "MVP, in active development",
    links: [{ label: "Website", href: "https://marketiv.id" }],
    featured: true,
    imageHint: "MSME or creator dashboard in a desktop browser, or the KMI EXPO 2026 booth",
  },
  {
    slug: "cartify",
    title: "Cartify",
    client: null,
    year: "2026",
    role: "Lead mobile and AI engineer, first author",
    category: "Mobile app, applied AI research",
    summary:
      "A voice shopping assistant that turns spoken Indonesian into cart items and keeps a running budget offline.",
    problem:
      "Shoppers in physical stores often only learn their total at the cashier. Typing every item into a calculator while holding a basket is slow, and mobile signal inside stores is often too weak to upload audio.",
    contribution: [
      "Split the work between device and cloud: speech recognition runs on the phone with expo-speech-recognition, and only the transcript goes to the LLM.",
      "Wrote few-shot prompts for Groq (Llama 3.1 8B) and Gemini that parse local price slang such as \"goceng\" and \"ceban\" and tell unit price from total price, returning typed JSON.",
      "Stored carts and history in Expo SQLite so the app works with no connection.",
      "Added budget warnings with color changes and haptic feedback, plus automatic failover to a backup API key on rate limits.",
      "Wrote the paper and presented it at SENTIMETER 2026.",
    ],
    stack: ["React Native", "Expo SDK 54", "TypeScript", "Groq (Llama 3.1 8B)", "Gemini API", "Expo SQLite"],
    outcomes: ["Published in the SENTIMETER 2026 proceedings (Vol 5, pp. 62-75) as first author"],
    status: "Functional prototype",
    links: [
      { label: "App repository", href: "https://github.com/VXerys/cartify-app" },
      { label: "Web companion repository", href: "https://github.com/VXerys/voicecart-web" },
      {
        label: "Paper",
        href: "https://prosiding.sentimeter.nusaputra.ac.id/index.php/prosiding/article/view/104",
      },
    ],
    featured: true,
    imageHint: "Cartify cart screen with budget bar and voice input, phone frame",
  },
  {
    slug: "clinic-information-system",
    title: "Clinic Information System",
    // Named with the clinic's approval (assumption A-001, confirmed 2026-10-17).
    client: "Klinik Cikidang Medika",
    year: "2026",
    role: "Freelance full-stack developer (sole developer)",
    category: "Clinic system",
    summary:
      "A clinic information system that replaced spreadsheets for registration, queue, medical records, billing and reports.",
    problem:
      "The clinic ran patient registration, queue, doctor records, BPJS and general billing, the cash book and reports on separate Google Sheets and Excel files. Years of legacy data sat in CSV files of uneven quality.",
    contribution: [
      "Designed and built the whole system alone: architecture, database schema, UI and deployment.",
      "Wrote a spec for each feature before building it, plus four architecture decision records.",
      "Migrated 7,493 legacy rows into PostgreSQL, handling mislabeled columns and medical record numbers of mixed length.",
      "Made the reconciliation script deterministic, so re-running it on production plans zero changes. Possible duplicate patients are left for the clinic to decide instead of being merged automatically.",
      "Protected patient data with 17 versioned SQL migrations, row-level security and two roles (owner, doctor-admin).",
      "Built the dashboard, Excel export, Puskesmas reports, health-program registers, therapy packages and queue cancellation.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Zod", "Vitest", "Vercel"],
    outcomes: ["Delivered to and accepted by the client"],
    status: "Delivered to client",
    links: [],
    featured: true,
    imageHint: "Clinic dashboard with dummy data only, desktop browser; never real patient data",
  },
  {
    slug: "fluxa",
    title: "Fluxa",
    client: null,
    year: "2026",
    role: "Lead mobile and machine learning engineer (solo project)",
    category: "Mobile app, applied AI",
    summary: "A personal finance app where a transaction is logged by voice or by scanning a receipt, and it keeps working offline.",
    problem:
      "People stop tracking spending because every entry means typing an amount, a category, a wallet and a note. Cloud-only apps also fail where the signal is weak, such as a traditional market or a basement car park.",
    contribution: [
      "Built the Flutter app on Clean Architecture, with a domain layer free of Flutter and data-source code and Either<Failure, T> returns for predictable errors.",
      "Designed an offline queue and local cache with sqflite and get_storage; transactions save locally first and sync to Supabase when the connection returns.",
      "Built the voice pipeline as a FastAPI service on Hugging Face Spaces: faster-whisper speech-to-text, normalization, a transaction classifier, an amount parser and a title extractor that return structured JSON.",
      "Added a Groq Llama 3.3 70B fallback that runs only when transcription confidence is low, with a guardrail that it never changes a parsed amount.",
      "Added receipt scanning (OCR) that fills the transaction form from a photo, and designed Free and PRO tiers with monthly quotas for scans and voice notes.",
    ],
    stack: ["Flutter", "Dart", "GetX", "sqflite", "Supabase", "FastAPI", "faster-whisper", "Groq"],
    outcomes: [],
    status: "Functional MVP, in active development",
    links: [
      { label: "App repository", href: "https://github.com/VXerys/fluxa_app" },
      { label: "Model API repository", href: "https://github.com/VXerys/fluxa-model" },
      { label: "ML pipeline repository", href: "https://github.com/VXerys/fluxa-ml" },
    ],
    featured: false,
    imageHint: "Transaction list or voice entry screen, phone frame",
  },
  {
    slug: "artconnect",
    title: "ArtConnect",
    client: null,
    year: "2025",
    role: "Lead full-stack developer (team of five, Universitas Nusa Putra course project)",
    category: "Web app, CRM",
    summary: "A CRM and workspace for visual artists to keep artworks, collectors and sales in one place.",
    problem:
      "Independent artists keep their inventory without proper metadata, collector and gallery contacts in personal chat apps, and sales in manual books, with no view of a work moving from concept to sold.",
    contribution: [
      "Led the architecture from database design to interface in a team of five.",
      "Built the React 18, TypeScript, Tailwind and shadcn/ui front end, including a drag-and-drop Kanban (dnd-kit) that moves each artwork from concept to sold.",
      "Made the Kanban optimistic: cards move instantly through the React Query cache and roll back automatically if the Supabase write fails.",
      "Secured data with Supabase row-level security so each artist reads and edits only their own inventory, with Google OAuth and magic-link sign-in.",
      "Built a standalone REST API alternative in Node.js, Express, Prisma and MySQL, plus sales charts with Recharts and PDF, CSV and Excel export.",
    ],
    stack: ["React 18", "TypeScript", "Tailwind CSS", "Supabase", "Node.js", "Express", "Prisma", "MySQL"],
    outcomes: ["Live on Netlify"],
    status: "Live",
    links: [
      { label: "Live demo", href: "https://artconnect-crm.netlify.app" },
      { label: "Frontend repository", href: "https://github.com/VXerys/artconnect-crm" },
      { label: "Backend repository", href: "https://github.com/VXerys/artconnect-backend" },
    ],
    featured: false,
    imageHint: "Artwork Kanban board in a desktop browser",
  },
  {
    slug: "welling",
    title: "Welling",
    client: "Mangcoding client",
    year: "2026",
    role: "Mobile Software Engineer Intern (feature work)",
    category: "Client mobile app",
    summary: "Feature work on Welling, a women's health app for a South Korean client.",
    problem:
      "Welling was being migrated to React Native Expo, and its Community and test-strip scan screens had to be ready on time for the client's backend team in Korea.",
    contribution: [
      "Built and integrated the Community feature (search, event carousel, category filter, post feed), working with a teammate.",
      "Fixed the Scan Test Pack flow: camera guide for the test strip, failed-photo handling and the result screen. The analysis itself runs on the client's backend.",
    ],
    stack: ["React Native", "Expo", "TypeScript"],
    outcomes: [],
    status: "Delivered during the 2026 internship",
    links: [],
    featured: false,
    imageHint: "Welling Community and scan screens in a phone frame, end users' names and photos covered (Mangcoding permission, A-004)",
  },
  {
    slug: "visualkain-finance",
    title: "VisualKain Finance",
    client: "VisualKain",
    year: "2026",
    role: "Freelance full-stack developer (sole developer on the finance app)",
    category: "Finance dashboard",
    summary:
      "A finance system for a garment manufacturer that separates real cash from money that belongs to vendors.",
    problem:
      "Each customer payment mixes the vendor's production cost with the company's margin, and the business rule requires a 70% down payment before production starts. The owner needed to see real cash, not just money received.",
    contribution: [
      "Built the finance app alone: real-cash reconciliation (opening balance plus money in minus money out), receivables and vendor payables.",
      "Split each customer payment proportionally into vendor cost and margin, and enforced the 70% down-payment threshold.",
      "Kept the money rules in one calculator module covered by 21 test files.",
      "Before this, contributed a dashboard redesign and build fixes to the client's existing operations app.",
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "Firebase", "Vitest", "Testing Library"],
    outcomes: [],
    status: "Core features complete, further work in progress",
    links: [],
    featured: false,
    imageHint: "Finance dashboard with placeholder figures, desktop browser; no real client numbers",
  },
  {
    slug: "inztamoto-erp",
    title: "InztaMoto ERP",
    client: "InztaMoto",
    year: "2026",
    role: "Freelance full-stack developer",
    category: "ERP dashboard",
    summary:
      "An internal ERP for a motorcycle bag and riding gear brand, moved into a Next.js shell without stopping daily operations.",
    problem:
      "Stock and orders from Shopee, Tokopedia and the offline store were tracked in separate spreadsheets, which caused stock mismatches, unclear production status and no daily view of margins.",
    contribution: [
      "Moved a JavaScript ERP of about 9,400 lines into a Next.js 14 shell step by step, keeping it running for daily operations.",
      "Covers production stages (raw material, sewing queue, QC, ready to ship), multi-channel stock, and sales and margin charts on Firebase.",
      "Added daily performance tracking and report filters in a September 2026 update.",
      "Authored 40 of 43 non-merge commits.",
    ],
    stack: ["Next.js 14", "React 18", "Firebase", "Cloudinary", "Chart.js"],
    outcomes: [],
    status: "MVP delivered, updated September 2026",
    links: [],
    featured: false,
    imageHint: "Sales and margin chart view with placeholder data, desktop browser",
  },
  {
    slug: "webgis-gunung-puyuh",
    title: "Gunung Puyuh WebGIS",
    client: null,
    year: "2026",
    role: "Lead developer (team of five)",
    category: "WebGIS, spatial analysis",
    summary:
      "An interactive map that shows which neighbourhoods of Gunung Puyuh, Sukabumi, sit too far from schools and health facilities.",
    problem:
      "Housing in Gunung Puyuh grew fast, but schools and clinics stayed concentrated in the old town centre, leaving newer neighbourhoods on the edge more than 15 minutes from basic services.",
    contribution: [
      "Led development and turned the team's field-survey GPS points into validated GeoJSON.",
      "Built the map with Leaflet 1.9 on OpenStreetMap and Esri satellite imagery, in plain JavaScript split into seven single-purpose modules.",
      "Added 5, 10 and 15 minute isochrone service areas and compliance ratios against national facility standards.",
      "Built an analytics panel with animated counters and interactive layer controls.",
    ],
    stack: ["Leaflet", "JavaScript (ES6+)", "GeoJSON", "OpenStreetMap", "Esri World Imagery"],
    outcomes: [],
    status: "Released v2.0.0",
    links: [{ label: "Repository", href: "https://github.com/VXerys/accessibility-gap-analysis-webgis" }],
    featured: false,
    imageHint: "Map with isochrone rings over Gunung Puyuh, desktop browser",
  },
];

export const experience: Experience[] = [
  {
    company: "Marketiv",
    role: "Co-Founder & Chief Technology Officer",
    period: "Feb 2026 - Present",
    points: [
      "Co-founded a marketplace connecting Indonesian MSMEs with local micro-creators. Funded by P2MW 2026 and awarded Juara Harapan 2 at KMI EXPO 2026.",
      "Lead the Next.js 16 web platform with separate MSME and creator dashboards; authored 231 of 398 commits in the main repository.",
      "Co-built the Appwrite backend: Midtrans payments, escrow, creator withdrawals and a Vertex AI campaign brief generator.",
      "Added idempotency keys to checkout so retries cannot create a second payment.",
    ],
  },
  {
    // Brand name per the owner (2026-10-16); the legal entity is PT Nugraha Kreasi Digital.
    company: "Mangcoding",
    legalName: "PT Nugraha Kreasi Digital",
    role: "Mobile Software Engineer Intern",
    period: "Feb 2026 - Present",
    points: [
      "Main contributor to BookMate on Google Play: 286 of 326 commits across Flutter and Supabase.",
      "Built BookMate's reading activity tracker on an atomic Postgres function, the reflection studio and a badge system.",
      "Welling (React Native Expo, South Korean client): built the Community feature and fixed the test-strip scan flow with a teammate.",
      "Full on-site Feb to Jun 2026; since Jul 2026 on-site 2 to 3 days a week, maintaining BookMate.",
    ],
  },
  {
    company: "Freelance",
    role: "Freelance Full-Stack Developer",
    period: "May 2026 - Present",
    points: [
      "Klinik Cikidang Medika: sole developer of a clinic information system on Next.js 16 and Supabase, including a migration of 7,493 legacy rows.",
      "VisualKain: built a finance system for a garment manufacturer with its money rules covered by 21 test files.",
      "InztaMoto: moved a JavaScript ERP into a Next.js 14 shell without stopping daily operations.",
      "Also built a wedding invitation site with a live RSVP guestbook and an admin panel (Next.js 16, Supabase).",
    ],
  },
];

// The Asah achievement below stays as the certificate line in Proof; this is the Experience highlight.
export const program: Program = {
  name: "Asah 2026 led by Dicoding supported by GoTo",
  path: "Next-Gen AI Engineer path",
  role: "Fellow",
  period: "Aug 2026 - Jan 2027",
  status: "In progress",
};

export const education: Education = {
  label: "Education",
  institution: "Universitas Nusa Putra",
  degree: "S.Kom. Informatics Engineering",
  period: "Sep 2023 - 2027 (expected)",
  gpa: "3.73",
  projectsLabel: "Built while studying",
  projects: [
    { slug: "webgis-gunung-puyuh", context: null },
    { slug: "artconnect", context: "Web Programming course" },
    { slug: "cartify", context: "Research Methodology and Mobile Programming" },
    { slug: "fluxa", context: "Independent" },
  ],
};

export const achievements: Achievement[] = [
  {
    title: "Juara Harapan 2, KMI EXPO 2026, Digital Business (Early Stage)",
    issuer: "Belmawa Kemendikbudristek RI and Universitas Jenderal Soedirman",
    year: "2026",
    note: "Team award with Marketiv. I built the platform and demoed it at the booth.",
  },
  {
    title: "P2MW 2026 Funding Recipient",
    issuer: "Kemendikbudristek RI",
    year: "2026",
    note: "National student entrepreneurship funding for Marketiv.",
  },
  {
    title: "First Author and Presenter, SENTIMETER 2026",
    issuer: "Universitas Nusa Putra",
    year: "2026",
    note: "Paper on Cartify, a voice shopping assistant. Proceedings Vol 5, pp. 62-75.",
  },
  {
    title: "Next-Gen AI Engineer path, Asah 2026",
    issuer: "Dicoding Indonesia, supported by GoTo",
    year: "2026",
    note: "Certified independent study, Aug 2026 to Jan 2027. In progress.",
  },
  {
    title: "MTCNA (MikroTik Certified Network Associate)",
    issuer: "MikroTik",
    year: "2026",
    note: "Credential ID 2605NA1866",
  },
  {
    title: "Database Foundations",
    issuer: "Oracle Academy",
    year: "2025",
    note: "Award of completion",
  },
];

export const skills: SkillGroup[] = [
  {
    group: "Mobile",
    items: ["Flutter", "Dart", "React Native", "Expo", "GetX", "BLoC", "Clean Architecture", "Offline-first (SQLite, drift)", "Google Play release"],
  },
  {
    group: "Web",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zod"],
  },
  {
    group: "Backend and data",
    items: ["Supabase", "PostgreSQL", "Row-level security", "Appwrite Cloud Functions", "Firebase", "Midtrans"],
  },
  {
    group: "Applied AI",
    items: ["LLM integration (Groq, Gemini, Vertex AI)", "Prompt engineering", "On-device speech recognition", "FastAPI", "OpenCV"],
  },
  {
    group: "Quality and workflow",
    items: ["Vitest", "Playwright", "flutter_test", "Sentry", "Git and GitHub", "Spec-driven development"],
  },
];

export const contact: Contact = {
  ctaLabel: "Start a project",
  subject: "Project inquiry from your portfolio",
  body: "Hi Sechan,\n\nI'd like to talk about:\n- Project or role:\n- Timeline:\n- Budget range (optional):\n\nThanks,\n",
  hiringLabel: "Hiring? Find me on LinkedIn",
};
