## 1. 요구사항 분석 및 기술 명세

### 1.1 요구사항 정리
- 입력창(input창)을 화면 상단에서 하단으로 이동
- iOS 환경에서 Safe Area(홈 인디케이터 등) 침범 방지
- 데스크탑/웹 환경에서도 레이아웃이 깨지지 않아야 함

### 1.2 기술 명세
- 입력창을 하단에 고정(position: fixed)
- iOS 환경에서 Safe Area inset(`env(safe-area-inset-bottom)`, `env(safe-area-inset-top)`)을 padding에 반영
- container에 paddingTop: `env(safe-area-inset-top, 1rem)`, paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 4.5rem)` 등 개별적으로 분리 적용
- 데스크탑/웹 환경에서는 기존과 동일하게 동작
- CSS 예시:
  - 상단: `padding-top: env(safe-area-inset-top, 1rem);`
  - 하단: `padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);`

### 1.3 작업 순서 및 진행 상황
1. 입력창 관련 컴포넌트 및 스타일 파일 위치 파악 ✅
2. 입력창을 하단에 고정하는 방식으로 스타일 수정 ✅
3. iOS Safe Area 대응 CSS 적용(상단/하단 모두) ✅
4. capacitor.config.ts에 Keyboard 플러그인 resize: 'body' 옵션 적용 ✅
5. 데스크탑/웹 환경에서의 영향 확인 🔄
6. 결과물 검증 및 스크린샷 비교 🔄

### 1.4 고려가 필요한 점
- iOS 외 환경(안드로이드 등)도 Safe Area가 필요한지 여부
- 입력창이 스크롤되는 리스트와 겹치지 않도록 z-index, padding 등 조정 필요

---

## 2. 입력창 관련 컴포넌트 및 스타일 파일 위치

- **입력창 렌더링/상태관리/이벤트 처리**: `frontend/src/widgets/todo/TodoList.tsx`
  - `<form className={styles.form} ...>` 내부에 `<input ... />` 존재
  - 입력값 상태: `useState`로 관리
  - 입력 이벤트: `onChange`, `onSubmit` 등 처리
- **스타일 파일**: `frontend/src/widgets/todo/styles.css.ts`
  - `.form`, `.input`, `.container` 등 스타일 정의
- **앱 엔트리**: `frontend/src/app/App.tsx` → `<TodoList />` 렌더링

---

## 3. 참고사항
- Safe Area 적용은 CSS에서 `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)` 모두 활용
- iOS에서 safe-area-inset-*이 동작하려면 index.html의 viewport meta 태그에 `viewport-fit=cover`가 반드시 포함되어야 함
- 공식 문서: [MDN - env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- iOS Safari 및 WebView에서만 동작 

---

## 4. 트러블슈팅: iOS 키보드와 입력창 UI 깨짐 문제

### 문제 상황
- iOS에서 입력창에 포커스 시 키보드가 올라오면, 입력창이 키보드에 가려지거나 하단 Safe Area가 과도하게 남아 UI가 깨지는 현상 발생
- position: fixed + safe-area-inset-* 만으로는 키보드 높이를 알 수 없어 완벽하게 대응 불가

### 원인
- iOS의 position: fixed는 키보드가 올라와도 뷰포트 기준으로 남아있어 입력창이 키보드에 가려짐
- Safe Area는 홈 인디케이터 등 하드웨어 기준, 키보드가 올라오면 더 이상 유효하지 않음

### 실전 대응법
- **Capacitor/Cordova 앱**: @capacitor/keyboard 플러그인 등으로 키보드 이벤트 감지, 입력창 위치/여백을 JS로 동적으로 조정하거나, capacitor.config.ts에 `resize: 'body'` 옵션을 적용해 키보드가 올라올 때 body가 자동으로 리사이즈되도록 설정
- **Pure Web**: window.visualViewport API로 키보드 영역 감지, 입력창 위치를 JS로 조정
- CSS만으로는 iOS에서 완벽 대응 불가(최소한의 대응만 가능)

### 참고 코드
- Capacitor Keyboard 이벤트 활용 예시, visualViewport 활용 예시 등은 본 문서 상단 참고 