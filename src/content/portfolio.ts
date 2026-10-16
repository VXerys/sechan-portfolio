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
export type Experience = { company: string; role: string; period: string; points: string[] };
export type Achievement = { title: string; issuer: string; year: string; note: string | null };
export type SkillGroup = { group: string; items: string[] };
// Availability copy follows the owner's positioning decision of 2026-10-16: freelance first, then full-time, then internships.
export type Contact = { ctaLabel: string; subject: string; body: string; hiringLabel: string };

// Canonical origin. The apex sechanalfarisi.dev 308-redirects here (Vercel domain setting, 2026-10-16).
export const siteUrl = "https://www.sechanalfarisi.dev";

export const profile: Profile = {
  name: "M Sechan Alfarisi",
  shortName: "Sehan",
  role: "Full-Stack Mobile Software Engineer and Applied AI Engineer",
  headline: "I build mobile and web products that real people use.",
  intro:
    "A reading app on Google Play, a clinic system that replaced spreadsheets, and a marketplace that won national startup funding. I take on freelance builds for businesses, and I'm open to full-time roles and internships.",
  location: "Sukabumi, West Java, Indonesia",
  availability:
    "Available for freelance mobile and web projects, from first spec to launch. Also open to full-time roles and 3 to 6 month internships, remote or hybrid (Sukabumi, Bandung, Jakarta).",
  about: [
    "I study Informatics Engineering at Universitas Nusa Putra (GPA 3.73/4.00, expected graduation 2027) and work across Flutter, React Native, Next.js and Supabase, with applied AI on top.",
    "I'm Co-Founder and CTO of Marketiv, a marketplace that connects Indonesian MSMEs with local micro-creators. The team was funded by P2MW 2026 and received Juara Harapan 2 at KMI EXPO 2026. I'm also a Mobile Software Engineer Intern at PT Mangcoding, where I'm the main contributor to BookMate on Google Play, and I take freelance full-stack work for local businesses.",
    "On the AI side, I was first author of a SENTIMETER 2026 paper on a voice shopping assistant that runs speech recognition on the phone and sends only text to an LLM, so it stays usable on weak in-store signal. I'm currently in the Next-Gen AI Engineer path of Asah led by Dicoding.",
    "How I work: specs before code, tests on the logic that handles money or health data, and database rules that hold even when the UI is wrong.",
  ],
  manifesto: {
    text: "Specs before code, tests on the logic that handles money or health data, and database rules that hold",
    accent: "even when the UI is wrong.",
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
    client: "PT Mangcoding",
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
    links: [
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
    links: [],
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
    // Unnamed until the clinic approves being named (assumption A-001).
    client: "A primary care clinic in Sukabumi",
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
    slug: "mangkasir-ritel",
    title: "MangKasir Ritel",
    client: "PT Mangcoding (internal product)",
    year: "2026",
    role: "Mobile Software Engineer Intern, sole committer",
    category: "Retail POS",
    summary: "An offline-first, multi-tenant retail point-of-sale app in Flutter.",
    problem:
      "Mangcoding needed a retail edition of its MangKasir point-of-sale app that keeps working without a connection and serves multiple stores.",
    contribution: [
      "Built the design system, a theme checked for WCAG contrast, and mobile-first barcode scanner support.",
      "Built sessions and role-based access across about 45 routes.",
      "Built Flutter modules for products, catalog master data, CRM, purchasing and an inventory ledger with stock opname and warehouse transfers.",
      "Set up multi-tab cashier state with BLoC on a local drift database.",
    ],
    stack: ["Flutter", "flutter_bloc", "get_it", "go_router", "drift", "Supabase"],
    outcomes: [],
    status: "In development, not yet released",
    links: [],
    featured: false,
    imageHint: "Product catalog or cashier screen, phone or tablet frame",
  },
  {
    slug: "welling-ayah-hebat",
    title: "Welling and Ayah Hebat",
    client: "PT Mangcoding clients",
    year: "2026",
    role: "Mobile Software Engineer Intern (feature work)",
    category: "Client mobile apps",
    summary:
      "Feature work on two client apps: a women's health app for a South Korean client and an Islamic parenting app.",
    problem:
      "Welling was being migrated to React Native Expo, and its Community and test-strip scan screens had to be ready on time for the client's backend team in Korea. Ayah Hebat needed rankings by period and a structured way to pick a Kuttab zone and location.",
    contribution: [
      "Welling: built and integrated the Community feature (search, event carousel, category filter, post feed), working with a teammate.",
      "Welling: fixed the Scan Test Pack flow: camera guide for the test strip, failed-photo handling and the result screen. The analysis itself runs on the client's backend.",
      "Ayah Hebat: updated the ranking screen with Daily, Monthly and Ever tabs and a card showing the user's own position.",
      "Ayah Hebat: made the Kuttab zone and location dropdowns in the parent biodata form dynamic.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Flutter", "Dart"],
    outcomes: [],
    status: "Delivered during the 2026 internship",
    links: [],
    featured: false,
    imageHint:
      "Ayah Hebat ranking screen with test data, phone frame (confirm permission with Mangcoding); no Welling screenshots without permission",
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
    company: "PT Mangcoding",
    role: "Mobile Software Engineer Intern",
    period: "Feb 2026 - Present",
    points: [
      "Main contributor to BookMate on Google Play: 286 of 326 commits across Flutter and Supabase.",
      "Built BookMate's reading activity tracker on an atomic Postgres function, the reflection studio and a badge system.",
      "Welling (React Native Expo, South Korean client): built the Community feature and fixed the test-strip scan flow with a teammate.",
      "Ayah Hebat (Flutter): updated the ranking screen and made the Kuttab zone and location dropdowns dynamic.",
      "Full on-site Feb to Jun 2026; since Jul 2026 on-site 2 to 3 days a week, maintaining BookMate and building MangKasir Ritel, an offline-first POS.",
    ],
  },
  {
    company: "Freelance",
    role: "Freelance Full-Stack Developer",
    period: "May 2026 - Present",
    points: [
      "A primary care clinic in Sukabumi: sole developer of a clinic information system on Next.js 16 and Supabase, including a migration of 7,493 legacy rows.",
      "VisualKain: built a finance system for a garment manufacturer with its money rules covered by 21 test files.",
      "InztaMoto: moved a JavaScript ERP into a Next.js 14 shell without stopping daily operations.",
      "Also built a wedding invitation site with a live RSVP guestbook and an admin panel (Next.js 16, Supabase).",
    ],
  },
];

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
  body: "Hi Sehan,\n\nI'd like to talk about:\n- Project or role:\n- Timeline:\n- Budget range (optional):\n\nThanks,\n",
  hiringLabel: "Hiring? Find me on LinkedIn",
};
