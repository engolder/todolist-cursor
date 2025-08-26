# Capacitor iOS 앱 래핑 구현

## 작업 개요
- 기존 웹앱을 Capacitor 프레임워크를 사용하여 iOS 네이티브 앱으로 래핑
- 웹앱의 기능을 iOS 환경에서 동일하게 제공하면서 네이티브 앱 경험 구현

## 작업 과정

### 1. 분석 및 계획
- **요구사항**: 웹앱 → iOS 앱 변환
- **기술 선택**: Capacitor 7.4.2 (최신 안정 버전)
- **호환성**: iOS 14.0 이상 지원
- **개발환경**: macOS Sonoma, Xcode 15.0+

### 2. 구현

#### 환경 설정
**Ruby & CocoaPods 설정**
```bash
# Ruby 설치 및 PATH 설정
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc

# CocoaPods 설치
gem install cocoapods
echo 'export PATH="/Users/joonmo.yeon/.local/share/gem/ruby/3.4.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Xcode 설정**
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

#### Capacitor 설치 및 설정
**의존성 설치**
```bash
cd frontend
yarn add @capacitor/core@7.4.2 @capacitor/ios@7.4.2
yarn add -D @capacitor/cli@7.4.2
```

**프로젝트 초기화**
```bash
npx cap init TaskList io.cursor.tasklist --web-dir dist
```

**capacitor.config.ts 설정**
```typescript
const config: CapacitorConfig = {
  appId: 'io.cursor.tasklist',
  appName: 'Task List',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'app',
    backgroundColor: '#ffffff',
    limitsNavigationsToAppBoundDomains: true
  }
}
```

#### iOS 프로젝트 생성 및 빌드
```bash
yarn build
rm -rf ios && npx cap add ios
```

#### 개발 스크립트 추가
**package.json 스크립트**
```json
{
  "scripts": {
    "ios:build": "yarn build && npx cap sync ios",
    "ios:open": "npx cap open ios", 
    "ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
  }
}
```

### 3. 검증 및 테스트
- Xcode 시뮬레이터에서 앱 실행 성공
- 웹앱 기능이 iOS 환경에서 정상 동작 확인
- 앱 이름이 "Task List"로 정상 표시

## 발생한 문제 및 해결

### 문제 1: Ruby/CocoaPods PATH 설정 
- **문제**: 환경 변수가 영구적으로 저장되지 않음
- **원인**: .zshrc 파일에 PATH 설정이 누락
- **해결**: PATH 설정을 .zshrc에 추가하고 source 명령어로 적용

### 문제 2: Xcode Scheme 대소문자 불일치
- **문제**: `xcodebuild: error: The workspace named "App" does not contain a scheme named "app"`
- **원인**: 
  - Capacitor는 'app'(소문자) scheme을 찾음
  - Xcode는 'App'(대문자)으로 생성
  - iOS 네이밍 컨벤션과 크로스플랫폼 도구 간의 차이
- **해결**: `--scheme App` 옵션으로 정확한 scheme 이름 명시

### 문제 3: 개발 효율성 개선
- **문제**: 매번 전체 빌드 후 시뮬레이터 실행으로 개발 속도 저하
- **해결**: 개발 서버와 시뮬레이터를 병렬로 실행하는 방식으로 개선
  ```json
  "ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
  ```

## 결과 및 영향
- **최종 결과물**: iOS 시뮬레이터에서 동작하는 네이티브 앱
- **코드베이스 영향**: 
  - Capacitor 관련 의존성 추가
  - iOS 개발용 스크립트 추가
  - 크로스플랫폼 지원 기반 마련
- **성능 고려사항**: 
  - WebView 기반으로 네이티브 대비 약간의 성능 오버헤드
  - 웹앱 최적화가 iOS 앱 성능에 직접 영향

## 향후 개선사항
- 앱 아이콘 및 스플래시 스크린 추가
- iOS 특정 권한 설정 (필요시)
- 푸시 알림 지원 검토
- 실제 디바이스에서의 테스트
- App Store 배포 준비

## 참고 문서
- [Capacitor iOS 공식 문서](https://capacitorjs.com/docs/ios)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)
- [iOS Development Guide](https://developer.apple.com/ios/)
- [CocoaPods 설치 가이드](https://guides.cocoapods.org/using/getting-started.html)