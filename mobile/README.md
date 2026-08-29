# ON드림 모바일 앱

[ON드림 웹사이트](https://ondream.co.kr) (학교 밖 청소년 지원 플랫폼)를
네이티브 iOS/Android 앱으로 감싸는 React Native(Expo) 프로젝트입니다.

## 1. 이 앱의 구조

**하이브리드 방식**: 별도의 백엔드 서버 없이, 앱이 실제 ondream.co.kr 웹사이트를
그대로 보여줍니다.

- 네이티브 하단 탭바(5개 탭)만 앱이 직접 구현합니다.
- 4개 탭(나의 ON드림 / 공지사항 / 게시판 / 자주 묻는 질문)은 각각
  `WebViewScreen` 컴포넌트로 실제 웹사이트 페이지를 WebView 안에 띄웁니다.
- 나머지 1개 탭(상담)만 완전히 네이티브 화면입니다(1388 상담 전화 안내).
- 로그인 세션은 WebView의 쿠키 저장소에 그대로 의존합니다. 앱이 직접 관리하는
  세션/인증 코드는 없습니다.

즉, **웹사이트 자체를 수정하는 프로젝트가 아닙니다.** 이 저장소는 그 웹사이트를
모바일 앱처럼 보여주는 "포장지" 역할만 합니다. 웹사이트 콘텐츠나 기능을
바꾸려면 ondream.co.kr 자체를 수정해야 합니다.

### 왜 WebView 방식을 선택했는가

원래 웹사이트의 모든 화면을 다시 네이티브로 만드는 대신(그 경우 유지보수가
훨씬 어려워집니다), 실제 웹페이지를 그대로 보여주고 필요한 부분만 앱이
보정합니다. 그 보정 로직은 딱 두 파일에 모여 있습니다:

- `src/screens/WebViewScreen.tsx` — 뒤로가기/새로고침/로그아웃 버튼, 로딩·에러
  화면, 페이지 이동 감지
- `src/webview/injectedStyle.ts` — 웹페이지 안에 주입하는 JS/CSS 보정 스크립트

## 2. 폴더 구조

```
mobile/
├── App.tsx                        앱 진입점
├── app.json                       Expo 설정(앱 이름, 아이콘, 스플래시, 번들 ID)
├── eas.json                       EAS 빌드 프로필 설정
├── assets/                        아이콘, 스플래시, 로고 이미지
└── src/
    ├── navigation/
    │   └── RootTabs.tsx           하단 탭바 5개 정의
    ├── screens/
    │   ├── WebViewScreen.tsx      웹뷰 탭 4개가 공유하는 재사용 컴포넌트
    │   ├── AccountScreen.tsx      "나의 ON드림" 탭 (로그인/대시보드)
    │   ├── NoticesScreen.tsx      "공지사항" 탭
    │   ├── BoardScreen.tsx        "게시판" 탭
    │   ├── FaqScreen.tsx          "자주 묻는 질문" 탭
    │   └── CounselingScreen.tsx   "상담" 탭 (완전 네이티브)
    ├── webview/
    │   ├── injectedStyle.ts       웹페이지에 주입하는 JS 스크립트 3종
    │   └── errorMessage.ts        에러 코드 → 한글 에러 메시지 변환
    └── constants/
        └── urls.ts                각 탭이 여는 실제 웹사이트 URL 목록
```

## 3. 개발 환경 준비

- Node.js (LTS 버전 권장)
- 자신의 스마트폰(iOS 또는 Android)에 **Expo Go** 앱 설치, 또는
  Xcode/Android Studio의 시뮬레이터·에뮬레이터

```bash
cd mobile
npm install
```

## 4. 실행 방법 (개발 중 테스트)

```bash
npx expo start
```

터미널에 나오는 QR코드를 본인 폰의 Expo Go 앱(카메라 아님, Expo Go 앱 내
스캐너)으로 스캔하면 바로 실행됩니다. 시뮬레이터/에뮬레이터를 쓰려면:

```bash
npm run ios       # iOS 시뮬레이터 (macOS + Xcode 필요)
npm run android   # Android 에뮬레이터 (Android Studio 필요)
```

**주의**: Expo Go로 실행하면 앱의 실제 스플래시 화면과 앱 아이콘은 보이지
않습니다(Expo Go 자체의 로딩 화면이 대신 뜹니다). 실제 스플래시/아이콘을
확인하려면 6번 항목의 EAS 빌드가 필요합니다.

## 5. 테스트 & 타입 검사

```bash
npm test          # 단위 테스트 (Jest)
npm run typecheck # TypeScript 타입 검사
```

두 명령 모두 커밋 전에 항상 통과해야 합니다.

## 6. 배포용 빌드 (EAS Build)

이 앱은 [Expo Application Services (EAS)](https://expo.dev)의 클라우드
빌드를 사용합니다. 로컬에 Xcode/Android Studio의 배포용 빌드 도구가 없어도
실제 설치 가능한 앱(.apk / .ipa)을 만들 수 있습니다.

### 최초 1회 설정 (새로운 담당자용)

1. [expo.dev](https://expo.dev)에서 무료 계정 생성 (또는 기존 팀 초대받기)
2. 로컬에서 로그인:
   ```bash
   cd mobile
   npx eas-cli@latest login
   ```
3. 이 프로젝트는 이미 EAS 프로젝트(`extra.eas.projectId`, `owner` 필드가
   `app.json`에 저장되어 있음)에 연결되어 있습니다. 같은 프로젝트에 접근하려면
   해당 Expo 팀(`sanjarak99s-team`)에 협업자로 초대받아야 합니다.

### GitHub Actions로 빌드하기 (로컬 설치 없이)

저장소 루트의 `.github/workflows/eas-build.yml`을 GitHub Actions 탭에서 수동으로
실행하면, 로컬에 아무것도 설치하지 않고도 빌드를 시작할 수 있습니다. 최초 1회
저장소 Settings → Secrets and variables → Actions에서 `EXPO_TOKEN` 시크릿을
등록해야 합니다 (expo.dev 계정 설정 → Access Tokens에서 발급). 이후에는
Actions 탭 → "EAS Build" → "Run workflow"에서 플랫폼과 프로필만 고르면 됩니다.

### 로컬에서 빌드 실행

```bash
# Android 테스트용 APK (무료 계정으로 가능, Play 스토어 계정 불필요)
eas build --platform android --profile preview

# iOS 시뮬레이터용 빌드 (Apple 개발자 계정 불필요)
eas build --platform ios --profile preview

# 실제 iOS 기기에 설치하려면 유료 Apple Developer 계정이 필요하며
# eas.json의 preview 프로필에서 ios.simulator를 제거하거나
# 별도 프로필을 만들어야 합니다.
```

빌드가 끝나면 (보통 5~15분 소요):

```bash
eas build:run --platform android --latest   # 에뮬레이터에 자동 설치+실행
eas build:run --platform ios --latest       # 시뮬레이터에 자동 설치+실행
```

### 앱스토어/플레이스토어 정식 배포

정식 배포에는 각각 별도 유료 계정이 필요합니다 (이 프로젝트에는 아직
설정되어 있지 않음):

- **Google Play Console**: 최초 1회 $25
- **Apple Developer Program**: 연 $99

계정 준비 후 `eas submit` 명령으로 제출할 수 있습니다. 자세한 내용은
[Expo 공식 문서](https://docs.expo.dev/submit/introduction/)를 참고하세요.

## 7. 웹페이지 보정 로직 (`src/webview/injectedStyle.ts`)

웹뷰 안에서 실제 웹사이트가 로드될 때마다 아래 3가지 스크립트가 자동으로
주입됩니다. 웹사이트가 나중에 리뉴얼되면 이 스크립트들이 깨질 수 있으니,
문제가 생기면 가장 먼저 확인해야 할 파일입니다.

| 스크립트 | 하는 일 | 왜 필요한가 |
|---|---|---|
| `HIDE_CHROME_JS` | 웹사이트 자체의 상단 헤더/푸터를 숨김 | 앱 자체 탭바와 중복되는 네비게이션을 감춤 |
| `FIX_MYPAGE_LAYOUT_JS` | "나의 ON드림" 대시보드의 사이드바 메뉴를 가로 스크롤로 변경 | 웹사이트의 사이드바가 PC 전용 고정폭 레이아웃이라 좁은 화면에서 메뉴가 잘림 |
| `SUPPRESS_LOGIN_ALERTS_JS` | "로그인이 필요합니다" 등 로그인 관련 네이티브 알림창을 숨김 | 이 알림들은 항상 리다이렉트가 뒤따라오는데, 안내 없는 빈 홈 화면으로 튕기는 문제가 있어 `WebViewScreen.tsx`에서 로그인 페이지로 다시 이동시킴 |

이 스크립트들은 CSS class 이름(`.mypage_section`, `.mypage_header` 등)과
alert 메시지에 포함된 한글 문자열("로그인")에 의존합니다. **웹사이트가
바뀌면 이 부분들을 다시 확인해야 합니다.**

## 8. 알아두어야 할 제약 사항

- **백엔드 없음**: 이 앱은 서버를 직접 운영하지 않습니다. 로그인, 게시판,
  공지사항 등 모든 데이터는 실제 웹사이트에서 그대로 가져옵니다.
- **웹사이트 변경에 취약함**: 위 7번 항목의 보정 스크립트들은 현재
  ondream.co.kr의 HTML/CSS 구조를 기준으로 작성되었습니다. 웹사이트가
  리뉴얼되면 이 스크립트들을 다시 확인/수정해야 할 수 있습니다.
- **푸시 알림 없음**: 새 공지사항이나 댓글 알림 등은 구현되어 있지 않습니다.
  구현하려면 별도의 백엔드/알림 서버가 필요합니다(현재 "백엔드 없음"이라는
  설계 원칙과 상충되므로 별도 논의 필요).
- **모든 화면 텍스트는 한국어**: 이 앱의 대상 사용자가 한국 청소년이기
  때문에, 네이티브로 직접 작성한 화면(탭 이름, 버튼, 에러 메시지)은 모두
  한국어입니다. 웹뷰로 띄우는 화면은 웹사이트 자체가 이미 한국어이므로 별도
  번역이 필요 없습니다.

## 9. 문제가 생겼을 때 확인할 곳

- **화면이 깨지거나 콘텐츠가 안 보임**: `src/webview/injectedStyle.ts`의
  CSS 선택자가 여전히 유효한지 확인 (웹사이트 HTML 구조 변경 여부)
- **로그인 후 이상하게 빈 화면으로 이동함**: `WebViewScreen.tsx`의
  `handleNavigationStateChange` 로직 확인 — 홈페이지(`https://ondream.co.kr/`)로
  튕기는 상황을 감지해서 로그인 페이지로 다시 보내는 로직입니다
- **탭 전환 시 이전 화면이 그대로 보임**: `RootTabs.tsx`의
  `detachInactiveScreens={false}` 설정이 유지되어 있는지 확인 (제거하면
  WebView가 iOS에서 다시 깨질 수 있음)
- **빌드는 성공했는데 앱 아이콘/스플래시가 이상함**: `app.json`의 `icon`,
  `splash`, `android.adaptiveIcon` 경로가 `assets/` 폴더의 실제 파일을
  가리키는지 확인. Expo Go에서는 이 설정이 아예 반영되지 않으니 반드시 EAS
  빌드로 확인해야 합니다.

## 10. 원본 설계 문서

이 프로젝트가 왜 지금과 같은 구조로 만들어졌는지 더 자세한 배경은
저장소 루트의 `docs/superpowers/specs/`와 `docs/superpowers/plans/`
폴더에 있는 설계 문서·구현 계획 문서를 참고하세요. 실제 웹사이트를
사용하며 발견된 버그와 그 수정 이유가 상세히 기록되어 있습니다.
