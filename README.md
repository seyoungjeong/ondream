# ON드림

[ON드림 웹사이트](https://ondream.co.kr)를 모바일 앱으로 감싸는 프로젝트입니다.

## 저장소 구성

- **`mobile/`** — React Native(Expo) 모바일 앱 소스코드. 개발 환경 설정, 실행,
  빌드, 배포 방법은 **[`mobile/README.md`](mobile/README.md)** 를 참고하세요.
- **`docs/superpowers/specs/`** — 앱의 설계 문서
- **`docs/superpowers/plans/`** — 구현 계획 및 개발 중 발견된 버그와 수정 이력
- **`.github/workflows/eas-build.yml`** — GitHub Actions에서 수동으로 실행하는
  EAS 빌드 워크플로. GitHub 저장소의 Actions 탭에서 "EAS Build" 워크플로를
  선택 → "Run workflow"로 플랫폼(all/android/ios)과 프로필(preview/production)을
  골라 실행합니다. 최초 1회, 저장소 Settings → Secrets and variables → Actions에
  `EXPO_TOKEN` 시크릿을 등록해야 합니다 (expo.dev 계정 설정에서
  Access Token 발급). 실제 컴파일은 GitHub가 아닌 Expo의 클라우드 서버에서
  이루어지므로 macOS 러너가 없어도 iOS 빌드가 가능합니다.
