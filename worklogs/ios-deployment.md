## iOS 앱 배포 및 TestFlight 설정

### 1. 기본 실행 방법

#### 1.1 준비사항
- macOS + Xcode 설치
- Apple ID (실제 기기 테스트용)
- iPhone/iPad (USB 연결)

#### 1.2 공식 문서 기준 실행 방법
```bash
# 1. 웹앱 빌드
yarn build

# 2. iOS 프로젝트 동기화
npx cap sync ios

# 3. Xcode에서 프로젝트 열기
npx cap open ios

# 4. Xcode에서 앱 실행 (시뮬레이터 또는 실제 기기)
```

#### 1.3 Live Reload 개발 방법
```bash
# 1. Vite 개발 서버 시작
yarn dev

# 2. capacitor.config.ts에 server 설정 추가
# server: { url: "http://<IP>:5173", cleartext: true }

# 3. iOS 프로젝트 동기화
npx cap copy ios

# 4. Xcode에서 앱 실행
npx cap open ios
```

### 2. 자동화 스크립트 개발 과정

#### 2.1 문제점 식별
- 매번 IP 주소 확인 → 설정 변경 → 동기화 → Xcode 열기 과정 반복
- 네트워크 환경 변경 시 IP 주소 수동 업데이트 필요
- 여러 단계의 명령어를 순서대로 실행해야 함

#### 2.2 자동화 스크립트 구현
```bash
# 최종 자동화 스크립트
yarn ios:dev
```

**동작 과정:**
1. 현재 IP 주소 자동 감지
2. capacitor.config.ts 자동 업데이트
3. iOS 프로젝트 동기화
4. Xcode 열기
5. Vite 개발 서버 실행

#### 2.3 스크립트 정리
```
scripts/
├── utils/                    # 공통 유틸리티
│   ├── network.js           # IP 감지, URL 생성
│   ├── capacitor.js         # iOS 동기화, Xcode 열기
│   └── dev-server.js        # Vite 서버 관리
├── setup-live-reload.js     # Live Reload 설정
└── ios-build.js             # iOS 빌드
```

**정리 이유:**
- 중복 코드 제거
- 공통 기능 재사용
- 향후 Android 등 추가 시 편의성

### 3. 최종 개발 워크플로우

#### 3.1 Live Reload 개발
```bash
yarn ios:dev
# 하나의 명령어로 모든 과정 자동화
```

#### 3.2 배포 준비
```bash
yarn ios:build
# 웹앱 빌드 → iOS 동기화 → Xcode에서 최종 빌드
```

### 4. 트러블슈팅

#### 4.1 검은 화면 문제
**문제**: iOS 앱 실행 시 검은 화면만 표시
**원인**: 웹뷰가 콘텐츠를 제대로 로드하지 못함
**해결**: 웹앱 빌드 → iOS 동기화 → Clean Build Folder 순서 준수

#### 4.2 Live Reload IP 주소 문제
**문제**: 네트워크 환경 변경 시 Live Reload 작동 안됨
**원인**: 하드코딩된 IP 주소
**해결**: 자동 IP 감지 스크립트 구현

#### 4.3 Apple Developer 인증 문제
**문제**: "Communication with Apple Failed" 에러
**원인**: 실제 기기 연결 없이 프로비저닝 프로파일 생성 불가
**해결**: iPhone 연결 → 개발자 모드 활성화 → 인증서 신뢰 설정

### 5. 핵심 교훈

#### 5.1 Capacitor 개발 특성
- 웹앱을 네이티브로 래핑하는 방식 이해
- iOS 보안 정책과 개발자 인증 과정 숙지
- 개발용/배포용 설정 구분의 중요성

#### 5.2 자동화의 가치
- 개발자 경험 향상과 실수 방지
- 일관성 있는 개발 환경 제공
- 팀 협업 효율성 증대

#### 5.3 스크립트 정리의 이점
- 중복 코드 제거로 간결함
- 공통 기능 재사용
- 향후 확장 시 편의성

### 6. 현재 상태
- ✅ Live Reload 개발 환경 완성
- ✅ 자동화 스크립트 구현
- ✅ 실제 기기 테스트 완료
- ⚠️ Apple Developer Program 가입 필요 (TestFlight 배포용)

### 7. 다음 단계
1. Apple Developer Program 가입 ($99/년)
2. App Store Connect에서 앱 등록
3. TestFlight 배포

### 8. 참고 문서
- @https://capacitorjs.com/docs/guides/live-reload - Live Reload 공식 가이드
- @https://capacitorjs.com/docs/config - Capacitor 설정 파일 참조