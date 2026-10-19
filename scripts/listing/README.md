# Listing kit (F-010)

Captures a project's real UI from an app running on localhost, then composes a 16:10 cover and 4:5 (web) or 9:16 (mobile) slides as WebP. Requirements: `docs/specs/F-010-listing-images/`.

## Run

```sh
npm run listing:capture -- --selfcheck   # guard check: exits 1 with example.com under "blocked"
npm run listing:capture -- <slug>        # .listing-cache/<slug>/<shot>.png + hosts.json
npm run listing:compose -- <slug>        # src/assets/images/listings/<slug>/cover.webp, 01.webp, ...
npm test                                 # includes the guard tests, which launch Chrome
```

- Chrome comes from `CHROME_PATH`, default `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` (`/usr/bin/google-chrome` on Linux). `playwright-core` never downloads a browser.
- Slugs starting with `_` are kit demos (`_kit-demo`, `_kit-demo-mobile`): they serve `fixtures/kit-demo/` themselves and compose into `.listing-cache/<slug>/out/`, never into `src/assets`.
- Compose fails, and writes no image, when the last capture log shows a blocked host, a web font does not load, a caption does not fit, or a file stays over budget at WebP quality 70 (cover 250 KB, slide 200 KB).

## Project config

One file per project in `projects/<slug>.mjs`; it holds every value that can appear on a slide.

```js
// A named const, not an anonymous default export, keeps the repo lint clean.
const project = {
  slug: "example",                          // must match the file name
  baseUrl: "http://localhost:5173",         // localhost, 127.0.0.1, or ::1 only
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ["fonts.googleapis.com", "fonts.gstatic.com"], // exact names beyond loopback; no wildcards
  serve: undefined,                         // optional: absolute fixture folder the kit serves at baseUrl
  setup: async (context) => {},             // optional: route stubs, cookies, init scripts; runs before the guard routes
  teardown: async () => {},                 // optional: runs after the browser closes, even when setup threw (stop an emulator here)
  shots: [{ name: "dashboard", path: "/", waitUntil: "networkidle", waitFor: "main", before: async (page) => {}, settle: 600, timeout: 30000 }],
  listing: {
    type: "web",                            // "web" (4 slides) | "mobile" (4 or 5 slides)
    label: null,                            // "Full-stack" | "UI slicing" | null
    sampleData: true,                       // adds the tag "Sample data · client records replaced"
    title: "Project title", tagline: "One line",
    cover: { shot: "dashboard" },
    slides: [{ shot: "dashboard", caption: "One-line benefit" }], // caption doubles as alt text (BR-016)
    sources: {},                            // shot name -> absolute path of an existing screenshot (mobile)
  },
};

export default project;
```

Each shot waits for network idle (or the shot's `waitUntil`: `load` for apps that keep a request open for good, such as a Firestore listen channel, where `before` must then prove the data arrived), `document.fonts.ready`, its `waitFor` selector, and loaded images, runs `before`, settles, then screenshots; a timeout retries once and then fails with the pending requests.

## Safety rules

- BR-012: a capture never talks to production or staging. The guard aborts every request, websocket, or service worker fetch to a host outside loopback and `allowHosts`, and Chrome's resolver refuses those names as a second wall. Any blocked host fails the run (exit 1), and no PNG from it is kept.
- Every run writes `.listing-cache/<slug>/hosts.json` (`{ allowed, blocked }`); it is the task evidence for NFR-002. Compose writes its own `compose-hosts.json`.
- Node-side Playwright requests (`context.request`, `page.request`, `route.fetch()`, and any other request context such as `request.newContext()`) are checked against the same allowlist and logged in the same `hosts.json`; one to an outside host throws and fails the run, even when `setup` does not catch it. They never follow redirects: a 3xx comes back to the caller.
- Plain Node `fetch` or `http` cannot be guarded. Seed emulators and call upstreams only through `context.request` in `setup`.
- Firebase apps use `lib/firebase-emulator.mjs`: `firebaseEmulator({ slug, projectId })` refuses any project id that does not start with `demo-`, writes `firebase.json` into `.listing-cache/<slug>/emulator/` (auth, Firestore, hub, and logging on fixed loopback ports, UI off), and `start()` runs `firebase emulators:start --only auth,firestore` with `JAVA_HOME` set to the Android Studio JBR for that process only (`LISTING_JAVA_HOME` and `FIREBASE_TOOLS_BIN` override). `seed(context.request, { users, collections })` clears the emulator, then creates users and commits documents through the emulator REST endpoints with the guarded request context. Call `start` and `seed` in `setup` and `stop` in `teardown`; an exit or Ctrl+C also stops the emulator. The app itself must be pointed at the emulator inside its temporary worktree (`connectAuthEmulator`, `connectFirestoreEmulator`), with every `NEXT_PUBLIC_FIREBASE_*` value passed as process environment so no hardcoded fallback is used.
- Supabase apps use `lib/supabase-stub.mjs` in `setup`. A fixture that throws answers `500` with a `MISSING error ...` line instead of hanging the request. With `strict: true` the stub registers a run check when it installs: any `MISSING` table, path, rpc, write, or unsupported filter fails the capture after that shot (exit 1, no PNG kept). Use it for every app that holds client records. Embeds such as `pasien:patients(*)` are answered only from declared `relations` (`{ visits: { patients: { local: "pasien_id" } } }`, matched to the embedded row's `id` unless `foreign` says otherwise, `many: true` for a list); an undeclared, nested, or hinted embed and a filter on an embed are `MISSING`.
- Do not add `page.route` in `before`; put stubs in `setup`. A page route that lets a request through is still counted as blocked and fails the run.
- BR-013: sample data is invented and lives in the project file; never copy production, staging, exports, or fixtures that hold real people.
- BR-014: client repositories are used only through a temporary worktree from the production branch; nothing is committed or pushed there, and the worktree is removed after capture.
- BR-015: slides show the real app UI; frames, type, and ornaments come from `templates/` only.
