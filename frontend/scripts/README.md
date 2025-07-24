# 개발 스크립트

이 디렉토리는 프로젝트 개발을 위한 다양한 스크립트들을 포함합니다.

## 📁 디렉토리 구조

```
scripts/
├── utils/
│   └── network.js           # 네트워크 관련 유틸리티
├── setup-live-reload.js     # iOS Live Reload 실행
├── ios-build.js             # iOS 앱 빌드
└── README.md                # 이 파일
```

## 🚀 사용법

### iOS 개발

#### 1. Live Reload 개발

```bash
# 1. 프론트엔드 개발 서버 실행 (터미널 1)
yarn dev

# 2. iOS 앱을 Live Reload 모드로 실행 (터미널 2)
yarn ios:live
# 또는
npx cap run ios --live-reload --host <IP> --port 5173
```

**특징:**
- ✅ 자동 IP 감지
- ✅ iOS 앱 Live Reload 자동 실행
- ✅ 프론트엔드 서버와 iOS 앱 실행 분리 필요

#### 2. iOS 앱 빌드

```bash
# 웹앱 빌드 + iOS 동기화
yarn ios:build
```

**특징:**
- ✅ 프로덕션 빌드
- ✅ iOS 프로젝트 동기화
- ✅ 배포 준비 완료

## 🔧 유틸리티 함수

### network.js
- `getLocalIP()`: 현재 컴퓨터의 IP 주소 가져오기
- `getLiveReloadURL(ip, port)`: Live Reload URL 생성
- `logNetworkInfo(ip, port)`: 네트워크 정보 출력

## 📋 개발 워크플로우

### Live Reload 개발
1. `yarn dev` 실행 (프론트엔드 개발 서버)
2. `yarn ios:live` 실행 (iOS 앱 Live Reload)
   - 두 명령어를 각각 터미널에서 실행하거나, concurrently 등으로 병렬 실행 가능
3. 코드 수정 시 자동 반영

### 배포 준비
1. `yarn ios:build` 실행
2. 웹앱 빌드 및 iOS 동기화
3. Xcode에서 최종 빌드 및 배포

## ⚠️ 주의사항

1. **디렉토리 위치**: 모든 명령어는 `frontend` 디렉토리에서 실행
2. **네트워크 환경**: Live Reload 사용 시 기기와 컴퓨터가 같은 Wi-Fi에 연결
3. **프로세스 종료**: Ctrl+C로 안전하게 종료 가능

## 🐛 문제 해결

### Live Reload가 작동하지 않는 경우
1. IP 주소 확인: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Vite 서버 상태 확인: `ps aux | grep vite`
3. 네트워크 연결 확인: `curl http://<IP>:5173`

### 빌드 오류가 발생하는 경우
1. 의존성 확인: `yarn install`
2. 캐시 정리: `yarn build --force`
3. iOS 프로젝트 재생성: `rm -rf ios && npx cap add ios` 