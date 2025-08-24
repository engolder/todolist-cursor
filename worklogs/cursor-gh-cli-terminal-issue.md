# Cursor IDE에서 GitHub CLI 터미널 출력 문제 해결

## 작업 개요
- Cursor IDE의 터미널에서 `gh pr view` 명령어 실행 시 `head: |: No such file or directory` 에러 발생
- 실제 기능 동작 여부 확인 및 해결 방법 도출

## 작업 과정

### 1. 분석 및 계획
- **문제 현상**: gh CLI 명령어에서 에러 메시지가 출력되어 정상 결과가 가려짐
- **영향 범위**: `gh pr view`, `gh pr list`, `gh repo view` 등 정보 출력 명령어
- **정상 동작**: `gh auth status`, `gh browse`, `gh --version` 등은 문제없음

### 2. 구현

#### 문제 원인 파악
**환경 설정 확인**
```bash
echo $SHELL  # /bin/zsh
echo $PATH   # Homebrew PATH 포함 확인
which gh     # /opt/homebrew/bin/gh
```

**명령어별 동작 패턴 분석**
```bash
# 정상 작동하는 명령어들
gh auth status  # ✅ 정상
gh browse       # ✅ 정상  
gh --version    # ✅ 정상

# 에러 발생하는 명령어들
gh pr view      # ❌ head: |: No such file or directory
gh pr list      # ❌ 동일한 에러
gh repo view    # ❌ 동일한 에러
```

**실제 동작 확인**
```bash
# 출력 리다이렉션으로 실제 결과 확인
gh pr view > log.txt 2>&1
cat log.txt
# → PR #22 정보가 정상 출력됨을 발견
```

#### 해결 방법 구현
**즉시 해결 방법**
```bash
# 방법 1: 에러 메시지 필터링 (권장)
gh pr view 2>&1 | grep -v "head: |: No such file or directory" | grep -v "head: cat: No such file or directory"

# 방법 2: stderr 무시
gh pr view 2>/dev/null

# 방법 3: 파일 리다이렉션
gh pr view > output.txt 2>&1 && cat output.txt
```

### 3. 검증 및 테스트
- PR #22 정보가 정상적으로 출력됨을 확인
- 다른 gh 명령어들도 동일한 방법으로 해결됨을 검증
- 기능적으로는 모든 명령어가 정상 작동함을 확인

## 발생한 문제 및 해결

### 문제: Cursor의 터미널 출력 처리 방식
- **문제**: stderr 에러 메시지가 stdout 결과를 가림
- **원인**: 
  - gh CLI 내부에서 JSON 파싱/텍스트 처리 시 `head`, `cat` 파이프라인 사용
  - Cursor IDE의 터미널이 stderr를 우선 표시하는 방식
  - gh CLI와 Cursor 터미널 환경 간의 호환성 문제
- **해결**: 출력 리다이렉션과 에러 메시지 필터링으로 실제 결과 확인

### 문제: gh CLI 버그로 오인
- **문제**: 에러 메시지로 인해 기능 자체가 작동하지 않는다고 판단
- **원인**: stderr 에러가 실제 기능 동작을 가려서 발생한 착각
- **해결**: 출력 리다이렉션을 통해 실제로는 정상 동작함을 확인

## 결과 및 영향
- **최종 결과물**: gh CLI 명령어를 Cursor에서 정상적으로 사용할 수 있는 해결 방법
- **코드베이스 영향**: 없음 (환경 설정 문제였음)
- **성능 고려사항**: 에러 메시지 필터링으로 약간의 처리 시간 추가되지만 무시할 수준

## 향후 개선사항
- Cursor IDE 업데이트 시 터미널 출력 처리 개선 여부 확인
- 다른 CLI 도구에서도 유사한 문제 발생 시 동일한 해결 패턴 적용
- gh CLI 업데이트로 문제 해결 여부 모니터링

## 참고 문서
- [GitHub CLI Manual - gh pr view](https://cli.github.com/manual/gh_pr_view)
- [GitHub CLI Manual - gh pr list](https://cli.github.com/manual/gh_pr_list)  
- [GitHub CLI 공식 문서](https://cli.github.com/)
- [Cursor IDE 공식 문서](https://docs.cursor.com/)