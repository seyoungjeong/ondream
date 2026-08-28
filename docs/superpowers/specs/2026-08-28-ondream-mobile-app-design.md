# ON드림 Mobile App — Design

Date: 2026-08-28

## 1. Overview & Goals

Build a React Native mobile app (iOS + Android, single codebase) that gives ON드림
(ondream.co.kr) users a native app experience for the site's existing functionality.

ON드림 is a support platform run by the Korean Youth Counseling & Welfare Development
Institute for out-of-school youth, offering announcements, a community board, FAQ,
and access to the national 1388 counseling hotline.

**Primary motivation:** better native UX (smoother navigation, native feel) compared
to using the mobile website directly. This is a one-time, solo build with no prior
JavaScript/web or Dart experience, and no plan to modify the existing website.

## 2. Scope

**In scope (v1) — full feature parity with the website:**
- Login (회원가입 credentials)
- Signup / 회원가입
- Notices — list + detail (공지사항)
- Community board — list, post detail, write new post, comment (게시판)
- FAQ (자주 묻는 질문)
- Counseling / 1388 hotline access (tap-to-call / info screen)

**Explicitly out of scope (v1):**
- Push notifications (no equivalent exists on the website today; deferred to a
  future version)
- Any changes to the existing website or its backend
- A separate backend/proxy service — the app must be the only thing built and
  deployed
- Offline caching beyond basic error/retry states
- Admin or moderation tooling

## 3. Architecture

**Hybrid: native shell + WebView content.**

- The app provides a native bottom tab bar and native navigation frame.
- Each content tab (Notices, Board, FAQ, My Account) renders the corresponding
  ondream.co.kr page inside a WebView (`react-native-webview`). Internal links
  (e.g. opening a board post) navigate within the same WebView, same as a browser.
- The Counseling tab is fully native (static hotline info + tap-to-call button) —
  simple enough to not need a WebView, and loads instantly.
- No backend service and no on-device HTML parsing. Login, signup, board posting,
  and comments all work because they run the website's own forms/JS as-is inside
  the WebView — this avoids reverse-engineering login endpoints, CSRF tokens, or
  cookie handling.
- Session/login state is handled automatically by the WebView engine (like a
  mobile browser) and persists across app restarts without custom code.

This architecture was chosen over two alternatives after discussion:
- **Fully native (on-device HTML scraping/parsing):** best possible native feel,
  but requires reverse-engineering the site's login/signup/board-post request
  formats and is brittle to any HTML/markup changes on the site. Rejected due to
  the risk/effort not fitting a solo, no-prior-experience, one-time build.
- **Backend proxy + fully native:** removes the "ship an app update to fix
  scraping" problem, but requires building and hosting a second service. Rejected
  because the goal is to build and ship the app only.

## 4. Tech Stack & Dev Environment

- **Framework:** React Native with Expo (managed workflow) — avoids native build
  tooling for day-to-day development, given no prior mobile dev experience.
- **Content rendering:** `react-native-webview`.
- **Navigation:** React Navigation — bottom tab bar (Notices / Board / FAQ /
  Counseling / My Account) with a stack per tab for list → detail → write/comment
  flows where relevant.
- **Testing during development:** Expo Go app on a physical iPhone (no Mac
  required), plus the Android emulator (via Android Studio, installed solely for
  its virtual device — the user has no physical Android phone).
- **Production builds:** Expo EAS Build (cloud) — builds both the Android app
  bundle (.aab) and iOS app (.ipa) without local Xcode or Android Studio.
  Publishing requires a Google Play Console account (one-time $25) and an Apple
  Developer Program membership ($99/year).

## 5. Screens & Navigation

Bottom tab bar, 5 tabs, in this order:

- **나의 ON드림 (Account)** — native header + WebView of the login/dashboard flow;
  the site's own URL adapts automatically (login form when logged out, dashboard
  when logged in), so this doubles as the app's home/landing tab and is first in
  the tab order.
- **Notices** — native header + WebView of the notices section.
- **Board** — native header + WebView of the board section (list, post detail,
  write, comment all handled within the WebView via the site's own pages).
- **FAQ** — native header + WebView of the FAQ section.
- **Counseling** — fully native: 1388 hotline info and tap-to-call button.

Each WebView-backed tab has a thin native header (with the ON드림 wordmark logo)
and three actions: 뒤로 (back, wired to the WebView's own navigation history),
새로고침 (refresh), and 로그아웃 (logout — the site's only logout link lives in its
own top nav, which this app hides, so a native equivalent is required). An earlier
draft of this design included a home button and pull-to-refresh; the home button
was removed once the account tab became the default/first tab (making it
redundant), and pull-to-refresh was never implemented — 새로고침 covers the same
need via an explicit tap.

Live testing surfaced two further mechanisms beyond the original chrome-hiding
idea, injected alongside it:
- The account dashboard's own CSS is a fixed-width desktop sidebar layout with no
  responsive breakpoint, cutting off menu items on a phone-width WebView — an
  injected style override makes it scroll horizontally on one row instead.
- The site alerts and redirects to a blank, unexplained homepage when a page
  requires login and the user is logged out (or just logged out) — login-related
  alert popups are suppressed, and the app detects the resulting bounce to the
  bare homepage and redirects a second time to the real login form instead.

**Chrome-hiding:** inject CSS/JS into each WebView to hide the website's own
header/footer, since the app's native tab bar and header already provide
navigation — avoids showing two stacked navigation layers. Deliberately does not
target the site's other `nav` elements (e.g. the dashboard sidebar above), since
those carry real in-page content, not just redundant site-wide navigation.

## 6. Data Flow & Error Handling

Each WebView-backed tab: loading state (spinner) → loaded content, or a native
error screen (retry button) if the page fails to load (offline, timeout, or the
site being unavailable).

## 7. Visual Design

Match the existing ON드림 website's branding (colors, logo, tone) so the app feels
like the same trusted institution, restyled with native mobile patterns (tab bar,
native headers). Exact brand colors/assets to be extracted from the website during
implementation.

**Language:** the app's audience is Korean youth, so all natively-built UI text
(tab labels, header buttons, error messages, the Counseling screen) must be in
Korean. This does not require any extra work for the WebView-backed tabs
(Notices, Board, FAQ, My Account) since they render the real ondream.co.kr pages,
which are already in Korean. Code comments remain English/ASCII per the global
engineering conventions — this requirement is about user-facing copy only.

## 8. Testing Approach

The app has very little custom logic (mostly native shell + WebView wiring), so
testing is primarily manual verification via Expo Go (iPhone) and the Android
emulator. There is no meaningful HTML-parsing or business logic to unit test under
this architecture.

## 9. Risks & Open Questions

- **Mobile responsiveness of the site itself:** WebViews show ondream.co.kr's
  mobile pages as-is. If any page isn't well-optimized for a narrow screen, that
  carries into the app unchanged, beyond what CSS injection can fix.
- **App Store review risk:** Apple's "minimum functionality" guideline (4.2) can
  flag apps perceived as bare website wrappers. Mitigated by the native tab bar,
  the fully native Counseling screen, and header/footer injection making the app
  feel purpose-built rather than a browser wrapper.
- **Notices/Board/FAQ require login.** Confirmed directly against the live site
  (including with a fresh session cookie, bypassing the app entirely): anonymous
  requests to `/notice`, `/board`, and `/faq` all return a script that alerts
  "로그인이 필요합니다" (login required) and redirects to the site root — not the
  publicly browsable content originally assumed during brainstorming. The app's
  behavior correctly mirrors this; a user must log in (My Account tab) before
  these tabs show real content, since the WebView shares session cookies with
  the same domain across all tabs.
- **Chrome-hiding is not fully reliable across navigations.** Confirmed on iOS:
  the injected chrome-hiding script ran on a tab's initial page load but not
  after an in-page redirect (e.g. the login-required redirect above) to a new
  page within the same WebView instance — the site's own header briefly
  reappeared. Already noted as "optional polish" rather than a hard requirement;
  this is a known limitation, not a blocking defect.

## 10. Non-Goals / Future Work

- Push notifications (new notices, replies to posts) — natural next step once v1
  ships, would require revisiting the backend-less constraint since triggering
  notifications needs a server-side component.
- Any deeper native rendering of specific screens, if WebView UX turns out to be
  unsatisfactory for a particular section after real-world testing.
