# iOS 앱 배포 및 자동화 환경 구축

## 작업 개요
- Capacitor 기반 iOS 앱의 개발 및 배포 환경 구축
- Live Reload 개발 워크플로우 자동화 스크립트 구현
- 실제 기기 테스트 및 배포 준비 과정 문서화

## 작업 과정

### 1. 분석 및 계획
- **문제점**: 매번 IP 주소 확인 → 설정 변경 → 동기화 → Xcode 실행 과정 반복
- **목표**: 개발자 경험 향상을 위한 자동화된 워크플로우 구축
- **요구사항**: Live Reload, 실제 기기 테스트, 자동 IP 감지

### 2. 구현

#### 기본 실행 방법 정립
**공식 문서 기준 워크플로우**
```bash
# 1. 웹앱 빌드
yarn build

# 2. iOS 프로젝트 동기화
npx cap sync ios

# 3. Xcode에서 프로젝트 열기
npx cap open ios
```

**Live Reload 개발 방법**
```bash
# 1. Vite 개발 서버 시작 (터미널 1)
yarn dev

# 2. iOS 앱 Live Reload 실행 (터미널 2)
yarn ios:live
# 또는
npx cap run ios --live-reload --host <IP> --port 5173
```

#### 자동화 스크립트 구현
**스크립트 구조**
```
scripts/
├── utils/                    # 공통 유틸리티
│   ├── network.js           # IP 감지, URL 생성
│   ├── capacitor.js         # iOS 동기화, Xcode 열기
│   └── dev-server.js        # Vite 서버 관리
├── setup-live-reload.js     # Live Reload 설정
└── ios-build.js             # iOS 빌드
```

**자동화 동작 과정**
1. 현재 네트워크 IP 주소 자동 감지
2. capacitor.config.ts 파일 자동 업데이트
3. iOS 프로젝트 동기화 (필요시)
4. Vite 개발 서버 실행 준비
5. iOS 앱 Live Reload 모드 실행

#### 패키지 스크립트 정의
```json
{
  "scripts": {
    "dev": "vite",
    "ios:live": "node scripts/setup-live-reload.js",
    "ios:build": "node scripts/ios-build.js",
    "dev:ios": "concurrently \"yarn dev\" \"yarn ios:live\""
  }
}
```

### 3. 검증 및 테스트
- 시뮬레이터에서 Live Reload 동작 확인
- 실제 iPhone 기기에서 테스트 완료
- 네트워크 환경 변경 시 자동 IP 감지 동작 확인

## 발생한 문제 및 해결

### 문제 1: iOS 앱 검은 화면 문제
- **문제**: iOS 앱 실행 시 검은 화면만 표시되고 콘텐츠가 로드되지 않음
- **원인**: 웹뷰가 웹앱 빌드 결과물을 제대로 찾지 못함
- **해결**: 웹앱 빌드 → iOS 동기화 → Clean Build Folder 순서 철저히 준수

### 문제 2: Live Reload IP 주소 문제
- **문제**: 네트워크 환경 변경 시 Live Reload가 작동하지 않음
- **원인**: capacitor.config.ts에 하드코딩된 IP 주소
- **해결**: 
  - 네트워크 인터페이스에서 자동 IP 감지 로직 구현
  - capacitor.config.ts 파일 자동 업데이트 스크립트 작성

### 문제 3: Apple Developer 인증 문제
- **문제**: "Communication with Apple Failed" 에러로 실제 기기 테스트 불가
- **원인**: 
  - 실제 iPhone이 연결되지 않은 상태에서 프로비저닝 프로파일 생성 불가
  - iOS 개발자 모드 미활성화
- **해결**: 
  - iPhone USB 연결 확인
  - 기기에서 개발자 모드 활성화
  - Xcode에서 인증서 신뢰 설정

### 문제 4: 스크립트 중복 코드 문제
- **문제**: 여러 스크립트에서 동일한 기능(IP 감지, Capacitor 설정 등) 중복 구현
- **원인**: 초기 구현 시 재사용성을 고려하지 않은 구조
- **해결**: 공통 기능을 utils 모듈로 분리하여 재사용 가능한 구조로 리팩토링

## 결과 및 영향
- **최종 결과물**: 자동화된 iOS 개발 환경 및 Live Reload 워크플로우
- **코드베이스 영향**: 
  - 개발 도구 스크립트 추가로 프로젝트 구조 확장
  - 개발자 경험 크게 향상
  - 일관성 있는 개발 환경 제공
- **성능 고려사항**: 자동화 스크립트 실행 시간은 무시할 수준, 개발 효율성 크게 향상

## 향후 개선사항
- Apple Developer Program 가입 및 TestFlight 배포 설정
- Android 플랫폼 지원을 위한 스크립트 확장
- CI/CD 파이프라인 통합 검토
- 팀 개발을 위한 환경 설정 표준화

---

## [2025-08-24] iOS 시뮬레이터 자동 선택 기능 개선

### 작업 개요
- 사용자가 `yarn ios:dev` 실행 시 디바이스 선택 메뉴 없이 부팅된 시뮬레이터를 자동으로 사용하도록 개선
- 개발 워크플로우의 추가적인 효율성 향상

### 발생한 문제
- **문제**: `yarn ios:dev` 실행 시 매번 시뮬레이터 선택 메뉴가 표시됨
- **원인**: Capacitor의 기본 동작이 사용 가능한 디바이스 목록을 보여주고 사용자 선택을 요구
- **사용자 요구사항**: 이미 부팅된 시뮬레이터가 있으면 자동으로 그것을 사용하고 싶음

### 해결 방법
부팅된 시뮬레이터의 UDID를 자동 감지하여 `--target` 옵션으로 전달하는 방식 구현:

```javascript
// 부팅된 시뮬레이터의 UDID 가져오기
let targetOption = "";
try {
  const bootedLine = execSync("xcrun simctl list devices | grep '(Booted)'", { 
    encoding: "utf-8", 
    stdio: "pipe" 
  }).trim();
  
  if (bootedLine) {
    // UDID 추출 (괄호 안의 첫 번째 값)
    const udidMatch = bootedLine.match(/\(([A-F0-9-]+)\)/);
    if (udidMatch && udidMatch[1]) {
      const udid = udidMatch[1];
      targetOption = ` --target ${udid}`;
      console.log("📱 Using currently booted simulator automatically");
    }
  } else {
    console.log("📱 No booted simulator found, Capacitor will show device selection");
  }
} catch (error) {
  console.log("📱 Capacitor will show device selection");
}
```

### 구현 세부사항
1. `xcrun simctl list devices | grep '(Booted)'`로 부팅된 시뮬레이터 확인
2. 정규식을 사용하여 UDID 추출: `/\(([A-F0-9-]+)\)/`
3. UDID가 있으면 `--target UDID` 옵션을 Capacitor 명령어에 추가
4. UDID가 없으면 기본 동작(디바이스 선택 메뉴) 유지

### 결과
- 부팅된 시뮬레이터가 있는 경우: 자동으로 해당 시뮬레이터에서 앱 실행
- 부팅된 시뮬레이터가 없는 경우: 기존처럼 디바이스 선택 메뉴 표시
- 사용자 경험 추가 개선으로 개발 효율성 향상

---

## 참고 문서
- [Capacitor Live Reload 가이드](https://capacitorjs.com/docs/guides/live-reload)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)
- [iOS Developer Program](https://developer.apple.com/programs/)
- [Xcode 프로비저닝 가이드](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [xcrun simctl 명령어 가이드](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)