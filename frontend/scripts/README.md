# 개발 스크립트

이 디렉토리는 프로젝트 개발을 위한 다양한 스크립트들을 포함합니다.

## 📁 디렉토리 구조

```
scripts/
├── utils/                    # 공통 유틸리티 함수들
│   ├── network.js           # 네트워크 관련 유틸리티
│   ├── capacitor.js         # Capacitor 관련 유틸리티
│   └── dev-server.js        # 개발 서버 관련 유틸리티
├── setup-live-reload.js     # Live Reload 기본 설정
├── ios-build.js             # iOS 앱 빌드
└── README.md                # 이 파일
```

## 🚀 사용법

### iOS 개발

#### 1. Live Reload 개발

```bash
# Xcode 열기 + 개발 서버
yarn ios:dev
```

**특징:**
- ✅ 자동 IP 감지
- ✅ Xcode 열기 + 개발 서버
- ✅ Live Reload 지원

#### 2. iOS 앱 빌드

```bash
# 웹앱 빌드 + iOS 동기화
yarn ios:build
```

**특징:**
- ✅ 프로덕션 빌드
- ✅ iOS 프로젝트 동기화
- ✅ 배포 준비 완료

#### 3. Xcode 열기

```bash
# Xcode에서 프로젝트 열기
yarn ios:open
```

## 🔧 유틸리티 함수

### network.js
- `getLocalIP()`: 현재 컴퓨터의 IP 주소 가져오기
- `getLiveReloadURL(ip, port)`: Live Reload URL 생성
- `logNetworkInfo(ip, port)`: 네트워크 정보 출력

### capacitor.js
- `syncIOSProject()`: iOS 프로젝트 동기화
- `openXcode()`: Xcode 열기
- `runIOSWithLiveReload(ip, port, scheme)`: Live Reload로 iOS 실행
- `runIOSWithBuild(scheme)`: 빌드 기반으로 iOS 실행

### dev-server.js
- `startViteDevServer()`: Vite 개발 서버 시작
- `killProcess(process, name)`: 프로세스 안전 종료
- `setupProcessHandlers(viteProcess)`: 프로세스 종료 핸들러 설정

## 📋 개발 워크플로우

### Live Reload 개발
1. `yarn ios:dev` 실행
2. Xcode 자동 열기
3. Vite 개발 서버 시작
4. 코드 수정 시 자동 반영

### 배포 준비
1. `yarn ios:build` 실행
2. 웹앱 빌드 및 iOS 동기화
3. `yarn ios:open`으로 Xcode 열기
4. Xcode에서 최종 빌드 및 배포

## ⚠️ 주의사항

1. **디렉토리 위치**: 모든 명령어는 `frontend` 디렉토리에서 실행
2. **네트워크 환경**: Live Reload 사용 시 기기와 컴퓨터가 같은 Wi-Fi에 연결
3. **Git 관리**: `ios:dev` 사용 시 Git 변경사항 발생 가능
4. **프로세스 종료**: Ctrl+C로 안전하게 종료 가능

## 🐛 문제 해결

### Live Reload가 작동하지 않는 경우
1. IP 주소 확인: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Vite 서버 상태 확인: `ps aux | grep vite`
3. 네트워크 연결 확인: `curl http://<IP>:5173`

### 빌드 오류가 발생하는 경우
1. 의존성 확인: `yarn install`
2. 캐시 정리: `yarn build --force`
3. iOS 프로젝트 재생성: `rm -rf ios && npx cap add ios`

## 🔮 향후 확장 계획

### Android 개발
- Android Studio 연동 스크립트
- Android Live Reload 지원
- Android 빌드 자동화

### 웹 개발
- 웹 개발 서버 설정
- 브라우저 자동 열기
- Hot Module Replacement 설정

### 테스트
- 테스트 실행 스크립트
- 테스트 커버리지 측정
- E2E 테스트 자동화

### 배포
- 자동 배포 스크립트
- 환경별 설정 관리
- 배포 전 검증 자동화 