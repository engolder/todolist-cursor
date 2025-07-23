## iOS 앱 실제 기기 설치 트러블슈팅

### 1. 환경 정보
- OS: macOS
- Xcode 버전: 설치됨
- 프로젝트: Capacitor iOS 앱
- 문제 발생 시점: 2024-03-XX

### 2. 시도한 작업 및 결과

1. 프로젝트 빌드 [✅]
   ```bash
   cd frontend && yarn build
   ```
   - 결과: 성공
   - 빌드 산출물이 `dist` 디렉토리에 생성됨

2. iOS 프로젝트 동기화 [✅]
   ```bash
   npx cap sync ios
   ```
   - 결과: 성공
   - 웹 빌드가 iOS 프로젝트로 복사됨
   - Pod install 완료

3. Xcode 프로젝트 설정 [⚠️]
   - Xcode에서 프로젝트 오픈
   - Signing & Capabilities 설정 시도
   - 문제 발생: "Communication with Apple failed" 에러
   - 원인: VPN으로 인한 Apple 서버와의 통신 제한

### 3. 현재 상태
- 빌드 및 동기화까지는 정상 완료
- Apple Developer 계정 연동 단계에서 블록됨
- VPN으로 인한 통신 제한으로 프로비저닝 프로파일 생성 불가

### 4. 다음 단계
1. VPN이 없는 환경에서 재시도 필요
   - Apple Developer 계정 연동
   - 프로비저닝 프로파일 설정
   - 실제 기기 연결 및 빌드

### 5. 참고사항
- VPN이 없는 환경에서 작업 시 필요한 준비물:
  - macOS 설치된 컴퓨터
  - Xcode
  - Apple ID
  - iPhone/iPad
  - USB 케이블
- 무료 Apple ID 사용 시 7일 제한 있음 