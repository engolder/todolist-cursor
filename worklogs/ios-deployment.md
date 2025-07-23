## iOS 앱 배포 및 TestFlight 설정

### 1. 환경 정보
- OS: macOS
- Xcode 버전: 설치됨
- 프로젝트: Capacitor iOS 앱
- 배포 대상: TestFlight 및 실제 기기

### 2. 필수 준비사항

1. Apple Developer Program 가입 [⚠️]
   - 연간 $99 비용 발생
   - https://developer.apple.com/programs/ 에서 가입
   - 개인 또는 조직 계정 선택

2. 개발 환경 설정 [✅]
   - macOS 설치된 컴퓨터
   - Xcode 최신 버전
   - Apple ID
   - iPhone/iPad (테스트용)
   - USB 케이블

### 3. 진행된 작업 및 결과

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
   - 현재 상태:
     - "Communication with Apple Failed" 에러 발생
     - "Your team has no devices" 에러 발생
   
   - 진단 결과:
     1. Apple 서버 연결 테스트 (✅)
        - SSL 연결 성공
        - 인증서 검증 성공
        - HTTP 200 응답 수신
        - VPN이 통신을 방해하지 않음
     
     2. 실제 문제 원인:
        - 실제 기기가 등록되지 않음
        - 프로비저닝 프로파일 생성 불가
        - 기기 등록 필요

   - 해결 방법:
     1. 기기 연결 방법 (권장)
        - iPhone을 USB 케이블로 Mac에 연결
        - iPhone에서 Mac을 신뢰하도록 설정
        - Xcode에서 자동 기기 인식
     
     2. 수동 기기 등록
        - 기기의 UDID 확인
        - Apple Developer 사이트에서 수동 등록

   - 주요 발견사항:
     1. Apple Developer Program ($99/년, 약 129,000원)
        - TestFlight 배포에 필수
        - App Store 출시에 필수
        - 무제한 실제 기기 테스트 가능
        - 연간 구독 형태로 운영
     
     2. 무료 Apple ID
        - 시뮬레이터 테스트 가능
        - 실제 기기에서 7일 한정 테스트
        - TestFlight/App Store 배포 불가
        - 개발 및 디버깅 목적으로만 사용 가능

### 4. TestFlight 배포 계획

1. App Store Connect 설정 [🔄]
   - 새로운 앱 등록
   - 앱 기본 정보 설정
   - 스크린샷 및 설명 준비

2. 빌드 및 업로드 준비 [🔄]
   - 버전 및 빌드 번호 설정
   - 앱 아이콘 확인
   - 필요한 권한 설정 검토

3. TestFlight 설정 [🔄]
   - 내부 테스터 그룹 구성
   - 테스트 정보 작성
   - 빌드 노트 준비

### 5. 현재 상태
- 빌드 및 동기화까지는 정상 완료
- Apple Developer 계정 연동 필요
- TestFlight 배포를 위한 준비 작업 필요

### 6. 다음 단계

1. Apple Developer Program 가입
   - 계정 생성 및 결제
   - 개발자 인증서 발급

2. App Store Connect 설정
   - 앱 등록 및 기본 정보 입력
   - 스크린샷 및 설명 준비

3. TestFlight 배포
   - 앱 빌드 및 업로드
   - 테스터 그룹 설정
   - 테스트 시작

### 7. 참고사항
- TestFlight 배포 후 테스트 가능까지 약 1일 소요
- 내부 테스터는 즉시 테스트 가능
- 외부 테스터는 Apple 심사 후 테스트 가능 (약 1일 소요)
- 무료 Apple ID로는 TestFlight 배포 불가 (Apple Developer Program 필수)