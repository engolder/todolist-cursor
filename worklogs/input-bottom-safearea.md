# iOS Safe Area 및 입력창 하단 배치 구현

## 작업 개요
- 웹앱의 입력창을 화면 하단으로 이동하여 더 나은 UX 제공
- iOS 환경에서 Safe Area(홈 인디케이터 등) 침범 방지 및 키보드 대응

## 작업 과정

### 1. 분석 및 계획
- **요구사항**: 입력창을 상단에서 하단으로 이동, iOS Safe Area 대응
- **기술적 접근**: CSS `position: fixed` + Safe Area insets + Capacitor Keyboard 플러그인
- **호환성**: 데스크탑/웹 환경에서도 레이아웃 유지

### 2. 구현

#### 컴포넌트 구조 파악
**관련 파일들**
- 입력창 컴포넌트: `frontend/src/widgets/todo/TodoList.tsx`
- 스타일 정의: `frontend/src/widgets/todo/styles.css.ts`
- 앱 엔트리: `frontend/src/app/App.tsx`

#### CSS 스타일 수정
**Safe Area 대응 스타일 적용**
```css
.container {
  padding-top: env(safe-area-inset-top, 1rem);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);
}

.form {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0px);
  left: 0;
  right: 0;
  z-index: 1000;
}
```

**viewport 메타 태그 설정**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

#### Capacitor 키보드 설정
**capacitor.config.ts 설정**
```typescript
const config: CapacitorConfig = {
  // ... 기존 설정
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
}
```

**키보드 플러그인 의존성 추가**
```bash
yarn add @capacitor/keyboard
```

### 3. 검증 및 테스트
- iOS 시뮬레이터에서 Safe Area가 올바르게 적용됨을 확인
- 키보드 표시 시 입력창이 키보드 위에 올바르게 위치함을 확인
- 데스크탑 환경에서도 레이아웃이 정상적으로 동작함을 확인

## 발생한 문제 및 해결

### 문제 1: iOS 키보드와 입력창 UI 깨짐
- **문제**: iOS에서 키보드 표시 시 입력창이 키보드에 가려지거나 Safe Area가 과도하게 남음
- **원인**: 
  - `position: fixed`가 키보드 높이를 고려하지 않음
  - Safe Area는 하드웨어 기준으로, 키보드가 올라오면 유효하지 않음
- **해결**: Capacitor Keyboard 플러그인의 `resize: 'body'` 옵션으로 키보드 표시 시 body 자동 리사이즈

### 문제 2: Safe Area insets 미동작
- **문제**: CSS `env(safe-area-inset-*)` 값이 적용되지 않음
- **원인**: viewport 메타 태그에 `viewport-fit=cover` 옵션 누락
- **해결**: index.html의 viewport 메타 태그에 `viewport-fit=cover` 추가

### 문제 3: 크로스플랫폼 호환성
- **문제**: iOS 전용 설정이 다른 플랫폼에 영향을 줄 우려
- **원인**: Safe Area insets와 Capacitor 설정이 iOS 특화 기능
- **해결**: CSS의 fallback 값과 Capacitor 플러그인의 플랫폼별 분기로 해결

## 결과 및 영향
- **최종 결과물**: iOS에서 Safe Area를 고려한 하단 입력창 UI
- **코드베이스 영향**: 
  - CSS 스타일 시스템에 Safe Area 대응 추가
  - Capacitor 키보드 플러그인 의존성 추가
  - 모바일 우선 UX 패턴 도입
- **성능 고려사항**: 키보드 이벤트 처리로 약간의 오버헤드 있지만 UX 개선 효과가 더 큼

## 향후 개선사항
- Android Safe Area 대응 검토 (API 28+ 지원)
- 키보드 애니메이션과 동기화된 입력창 애니메이션 추가
- 다양한 iOS 기기에서의 테스트 확대
- 접근성(Accessibility) 고려사항 검토

## 참고 문서
- [MDN - CSS env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [Capacitor Keyboard Plugin](https://capacitorjs.com/docs/apis/keyboard)
- [iOS Safe Area 가이드](https://developer.apple.com/design/human-interface-guidelines/layout)
- [CSS Environment Variables](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)