## 1. 요구사항 분석 및 기술 명세

### 1.1 요구사항 정리
- 현재 웹앱을 iOS 네이티브 앱으로 래핑
- Capacitor 프레임워크를 사용하여 구현
- 웹앱의 기능을 iOS 환경에서 동일하게 제공

### 1.2 기술 명세

#### 의존성 추가
- @capacitor/core@7.4.2 (최신 안정 버전)
- @capacitor/ios@7.4.2
- @capacitor/cli@7.4.2

#### 환경 설정
1. iOS 개발 환경 요구사항
   - macOS Sonoma 14.0 이상
   - Xcode 15.0 이상
   - CocoaPods
   - Node.js 18.0 이상
   - iOS 14.0 이상 지원

2. Capacitor 설정
   - capacitor.config.ts 파일 생성 및 설정
     - 앱 이름, 앱 ID, 버전 등 기본 설정
     - iOS 특정 설정 (권한, 스타일 등)

3. iOS 프로젝트 설정
   - Info.plist 설정
   - 앱 아이콘 및 스플래시 스크린
   - 필요한 iOS 권한 설정

#### 수정이 필요한 파일
1. frontend/package.json
   - Capacitor 관련 의존성 추가
   - iOS 빌드 스크립트 추가

2. frontend/vite.config.ts
   - iOS 환경을 위한 설정 추가

3. 신규 생성 파일
   - capacitor.config.ts
   - ios/ 디렉토리 (Capacitor iOS 프로젝트)

### 1.3 작업 순서 및 진행 상황

1. 개발 환경 설정 ⚠️
   - Xcode 및 CocoaPods 설치 확인
     - ✅ Xcode 설치 및 경로 설정 완료
       ```bash
       # Xcode Command Line Tools에서 Xcode로 전환
       sudo xcode-select --switch /Applications/Xcode.app
       ```
     - ⚠️ Ruby 3.4.5 설치 및 환경 설정
       ```bash
       # Homebrew로 Ruby 설치
       brew install ruby
       
       # Ruby 환경 변수 설정 (.zshrc에 추가 필요)
       echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
       echo 'export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"' >> ~/.zshrc
       echo 'export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"' >> ~/.zshrc
       ```
     - ⚠️ CocoaPods 1.16.2 설치 및 환경 설정
       ```bash
       # CocoaPods 설치
       gem install cocoapods

       # CocoaPods 실행 파일 경로를 PATH에 추가 (.zshrc에 추가 필요)
       echo 'export PATH="/Users/joonmo.yeon/.local/share/gem/ruby/3.4.0/bin:$PATH"' >> ~/.zshrc
       
       # 변경사항 적용
       source ~/.zshrc
       ```
     - 발견된 이슈:
       1. Ruby와 CocoaPods PATH 설정이 영구적으로 저장되지 않음
          - 원인: 환경 변수가 .zshrc에 등록되지 않음
          - 해결: PATH 설정을 .zshrc에 추가하고 source 명령어로 적용
   - Node.js 버전 확인 및 업데이트 ✅

2. Capacitor 설치 및 설정 ✅
   - Capacitor 패키지 설치 ✅
     ```bash
     # Capacitor 패키지 설치
     cd frontend
     yarn add @capacitor/core@7.4.2 @capacitor/ios@7.4.2
     yarn add -D @capacitor/cli@7.4.2
     ```
   - 프로젝트 초기화 ✅
     ```bash
     # Capacitor 프로젝트 초기화
     npx cap init TodoList io.cursor.todolist --web-dir dist
     ```
   - iOS 설정 추가 ✅
     - capacitor.config.ts 파일 생성 및 설정
       ```typescript
       import { CapacitorConfig } from '@capacitor/cli';

       const config: CapacitorConfig = {
         appId: 'io.cursor.todolist',
         appName: 'TodoList',
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

       export default config;
       ```

3. 빌드 및 iOS 프로젝트 생성 ✅
   - 웹앱 빌드 및 iOS 프로젝트 생성
     ```bash
     # 웹앱 빌드
     yarn build
     
     # iOS 프로젝트 생성 (기존 프로젝트가 있는 경우)
     rm -rf ios && npx cap add ios
     
     # Xcode에서 프로젝트 열기
     npx cap open ios
     ```
   - 해결된 이슈들:
     1. 파일 경로 불일치 ✅
        - 모든 import 경로를 프로젝트 구조에 맞게 수정
     2. TypeScript 타입 오류 ✅
        - Todo 타입 정의 추가
     3. 웹앱 빌드 성공
     4. iOS 프로젝트 생성 완료

4. iOS 프로젝트 설정 ⚠️
   - 기본 설정 완료
   - 진행 중인 작업:
     1. iOS 관련 스크립트 추가 ✅
        ```json
        // package.json에 추가할 스크립트
        {
          "scripts": {
            "ios:build": "yarn build && npx cap sync ios",  // 웹앱 빌드 후 iOS 프로젝트 동기화
            "ios:open": "npx cap open ios",                 // Xcode에서 iOS 프로젝트 열기
            "ios:dev": "yarn ios:serve & npx cap run ios --scheme App",     // 개발 모드로 iOS 시뮬레이터에서 실행
            "ios:serve": "vite build --mode development --watch" // 개발 중 실시간 리로드
          }
        }
        ```
        - 발견된 이슈:
          ```bash
          # yarn ios:dev 실행 시 오류 발생
          xcodebuild: error: The workspace named "App" does not contain a scheme named "app"
          ```
        - 원인:
          1. Xcode Scheme이란?
             - Xcode에서 프로젝트를 빌드/실행하기 위한 설정 모음
             - 빌드할 타겟, 실행 환경, 테스트 설정 등을 포함
             - 하나의 프로젝트에 여러 Scheme 보유 가능 (개발용/배포용 등)

          2. 대소문자 구분 문제
             - Capacitor는 기본적으로 'app'(소문자) scheme을 찾음
             - Xcode 프로젝트는 'App'(대문자)으로 생성됨
             - macOS/iOS는 파일 시스템 레벨에서 대소문자를 구분
             - iOS/macOS 네이밍 컨벤션: 클래스/타겟 이름은 대문자로 시작

          3. 크로스 플랫폼 도구의 한계
             - Capacitor가 iOS의 네이밍 컨벤션을 완벽히 반영하지 못함
             - 이는 크로스 플랫폼 도구에서 흔히 발생하는 문제
             - 특히 Windows/Linux 기반 도구들이 macOS의 대소문자 구분을 고려하지 않는 경우가 많음

        - 해결 방안:
          1. package.json 스크립트 수정
             ```json
             "ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
             ```
          2. `--scheme App` 옵션으로 정확한 scheme 이름을 명시
          3. 결과: 빌드 및 시뮬레이터 실행 성공

     2. 앱 이름 설정 ✅
        - capacitor.config.ts 수정
          ```typescript
          const config: CapacitorConfig = {
            appId: 'io.cursor.todolist',
            appName: 'Todo List',  // 앱 이름 변경
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
        - 변경사항 적용
          ```bash
          # iOS 프로젝트에 변경사항 동기화
          yarn ios:build
          
          # 시뮬레이터에서 확인
          yarn ios:dev
          ```
        - 결과: 홈 화면과 앱 내에서 "Todo List"로 표시됨

   - 추가 필요 사항:
     1. ~~앱 아이콘 설정~~
     2. ~~스플래시 스크린 설정~~
     3. ~~필요한 iOS 권한 설정~~
     4. ~~빌드 설정 검토~~

5. 테스트 🔄
   - 시뮬레이터 테스트 준비 중
   - 실제 디바이스 테스트는 추후 진행 예정

### 1.4 고려가 필요한 점

#### 기술적 고려사항
1. 웹앱 호환성
   - iOS WebView에서의 기본 동작 확인
   - 터치 이벤트 동작 확인

2. 보안
   - iOS 앱 보안 요구사항 준수
   - 데이터 저장 및 전송 보안

#### 잠재적 이슈
1. 웹앱-네이티브 통신
   - 웹뷰와 네이티브 코드 간 통신 확인
   - 데이터 동기화 확인

2. 플랫폼 특화 기능
   - iOS 특정 기능 구현 필요성 확인
   - 플랫폼별 차이점 파악

#### 향후 계획
1. 버전 업데이트 계획
   - Capacitor 버전 업데이트 대응
   - iOS 버전 업데이트 대응

2. 기능 확장 검토
   - 푸시 알림 지원 검토
   - 생체 인증 통합 검토
   - 디바이스 API 활용 검토

### 1.5 스크립트 개선 작업 (2024-03-27)

#### 변경사항
1. `ios:dev` 스크립트 병렬 실행 방식으로 변경
   ```json
   // 기존
   "ios:dev": "yarn build && npx cap run ios --scheme App"
   
   // 변경
   "ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
   ```

#### 개선 효과
1. 개발 효율성 향상
   - 개발 서버와 시뮬레이터 동시 실행
   - 파일 변경 시 자동 리빌드 및 리로드
   - 빌드 시간 단축

#### 주의사항
1. 백그라운드 프로세스 관리
   - 개발 서버가 백그라운드에서 실행되므로 종료 시 주의 필요
   - 프로세스 정리를 위한 명시적인 종료 필요

2. 메모리 사용량
   - 개발 서버가 메모리에서 동작하므로 리소스 모니터링 필요
   - 장시간 개발 시 메모리 누수 가능성 고려