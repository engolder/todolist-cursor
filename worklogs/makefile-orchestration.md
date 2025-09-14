# Makefile 기반 애플리케이션 오케스트레이션 시스템 구축

## 작업 개요
- **목적**: 루트 디렉토리에서 한 번의 명령으로 전체 애플리케이션(프론트엔드 + 백엔드)을 실행할 수 있는 계층적 스크립트 시스템 구축
- **배경**: 개발 시 프론트엔드(yarn dev)와 백엔드(go run) 명령어를 각각 실행해야 하는 번거로움 해결

## 작업 과정

### 1. 분석 및 계획
- **현재 프로젝트 구조 분석**:
  - 프론트엔드: `/frontend` - Vite 기반, `yarn dev` 명령어로 실행
  - 백엔드: `/backend` - Go 기반, `go run cmd/task-service/main.go` 명령어로 실행
  - 현재 Makefile 없음

- **모노레포 레이어 설계 철학**:
  - **모노레포의 이해**:
    - 클라이언트: 보통 remote API 하나만 의존, local 개발 시 dev stage의 backend endpoint 사용
    - 백엔드 MSA: microservice당 DB, 메시지큐, 다른 microservice 등 많은 의존성
    - 현실적 MSA 전략: 작업중인 microservice 하나(+DB)만 로컬, 다른 의존은 dev 환경 참조
    - **이 프로젝트는 소규모**이므로 전체 실행 전략 가능
    - 멀티레포 구조는 병렬 실행이 어려움

- **계층별 설계 원칙**:
  - **루트 레이어**: 인프라 + 프론트엔드 + 모든 서비스 레이어 통합
  - **인프라 레이어**: 외부형 의존성(out of process) - Postgres/MySQL, Redis, RabbitMQ/Kafka 등
  - **프론트엔드 레이어(SPA)**: 독립적 실행 가능
  - **백엔드 레이어**: 
    - **서비스 레이어**: 내장형 의존성(in-process) 포함 - SQLite 등
  
- **실행 전략 매핑**:
  - **프론트엔드 레이어**: `yarn dev` (frontend 디렉토리에서)
  - **서비스 레이어**: `make dev-task` (backend 디렉토리에서 특정 서비스)
  - **백엔드 레이어**: `make dev` (backend 디렉토리에서 모든 서비스)
  - **루트 레이어**: `make dev` (루트에서 전체 애플리케이션)

### 2. 설계 결정사항

#### 계층별 책임 분리
- **Root Makefile** (`/Makefile`): 고수준 오케스트레이션
  - 전체 애플리케이션 실행
  - 프론트엔드/백엔드 개별 실행
  - 병렬 처리로 동시 실행
  
- **Backend Makefile** (`/backend/Makefile`): 세부 서비스 관리
  - 개별 서비스 실행 제어
  - 모든 백엔드 서비스 동시 실행
  - 향후 서비스 추가 시 확장 가능한 구조

#### 명명 규칙 결정
- **초기 계획**: 콜론 기반 (`make dev:task`) - 사용자 선호
- **구현 이슈**: Makefile에서 콜론은 특수문자로 이스케이프 필요
- **최종 결정**: 하이픈 기반 (`make dev-task`) - 문법적 안정성과 가독성 고려

#### 실행 범위 결정
- **루트에서**: 고수준 제어만 (dev, dev-frontend, dev-backend)
- **backend/에서**: 세부 제어 (dev-task, dev-all 등)
- **설계 원칙**: "특정 서비스 실행은 해당 디렉토리에서만" - 일관성과 직관성

### 3. 구현

#### Root Makefile (`/Makefile`)
```makefile
.PHONY: dev dev-frontend dev-backend

# 프론트엔드만 실행
dev-frontend:
	cd frontend && yarn dev

# 백엔드 전체 실행 (모든 서비스)
dev-backend:
	$(MAKE) -C backend dev

# 전체 애플리케이션 실행 (프론트 + 백엔드)
dev:
	@echo "Starting full application..."
	@$(MAKE) dev-backend &
	@$(MAKE) dev-frontend &
	@wait
```

#### Backend Makefile (`/backend/Makefile`)
```makefile
.PHONY: dev dev-task dev-all

# 개별 서비스 실행 (백엔드 디렉토리에서만 사용)
dev-task:
	go run cmd/task-service/main.go

# 향후 추가될 서비스 예시
# dev-user:
#	go run cmd/user-service/main.go
# dev-auth:
#	go run cmd/auth-service/main.go

# 모든 백엔드 서비스 동시 실행
dev-all:
	@echo "Starting all backend services..."
	@$(MAKE) dev-task &
	@wait

# 기본 dev는 모든 서비스 실행
dev: dev-all
```

### 4. 검증 및 테스트
- **Dry-run 테스트**: 모든 타겟에 대해 `make --dry-run` 실행
- **문법 검증**: Makefile 문법 오류 해결 (콜론 이스케이프 이슈)
- **계층별 실행 검증**: 루트와 backend 디렉토리에서 각각 테스트

## 발생한 문제 및 해결

### 문제 1: Makefile 콜론 문법 오류
- **문제**: `dev\:task:` 형태의 타겟 정의 시 "multiple target patterns" 오류
- **원인**: Makefile에서 콜론(`:`)은 타겟과 의존성을 구분하는 특수문자
- **해결**: 하이픈 기반 명명으로 변경 (`dev-task`) - 더 안전하고 일반적인 패턴

### 문제 2: 사용자 경험 설계
- **초기 제안**: 루트에서 모든 백엔드 서비스 개별 실행 가능
- **사용자 피드백**: "루트에서 특정 서비스 실행은 어색함"
- **해결**: 계층별 책임 명확히 분리 - 루트는 고수준, backend/는 세부 제어

## 결과 및 영향

### 최종 결과물
- **2개의 Makefile 생성**: 루트와 백엔드에 각각 배치
- **계층적 명령어 체계**: 사용 목적에 따른 명확한 구분
- **확장 가능한 구조**: 새로운 서비스 추가 시 쉽게 확장

### 사용법
```bash
# 루트에서 - 전체 또는 레이어별 실행
make dev              # 전체 애플리케이션
make dev-frontend     # 프론트엔드만
make dev-backend      # 백엔드 전체

# backend/에서 - 세부 서비스 제어
cd backend
make dev              # 모든 백엔드 서비스
make dev-task         # task 서비스만
make dev-all          # 모든 서비스 (명시적)
```

### 코드베이스에 미친 영향
- **개발 효율성 향상**: 단일 명령어로 전체 스택 실행 가능
- **일관된 개발 환경**: 모든 개발자가 동일한 방식으로 애플리케이션 실행
- **확장성 확보**: 마이크로서비스 추가 시 쉬운 확장 가능

## 향후 개선사항

### 계획된 추가 기능
- **인프라 레이어 지원**: `make up` 타겟으로 외부형 의존성(Postgres, Redis 등) 컨테이너 실행
- **로그 분리**: 각 서비스별 로그를 구분하여 출력하는 방식 추가
- **헬스 체크**: 서비스 시작 후 정상 동작 확인 로직 추가
- **환경 변수**: 개발/운영 환경별 설정 관리

### 장기 개선사항
- **테스트 통합**: `make test`, `make test-frontend`, `make test-backend` 추가
- **배포 스크립트**: `make deploy` 등 배포 관련 타겟 추가

### 서비스 확장 시 고려사항
새로운 서비스(예: user-service, auth-service) 추가 시:
1. `backend/Makefile`에 `dev-{service}` 타겟 추가
2. `dev-all` 타겟에 새 서비스 추가
3. 각 서비스의 의존성 및 실행 순서 고려

## 참고 문서
- [GNU Make Manual](https://www.gnu.org/software/make/manual/) - Makefile 문법 참조
- [Make 타겟 명명 규칙](https://www.gnu.org/prep/standards/html_node/Makefile-Conventions.html) - GNU 권장 명명 규칙
- 프로젝트 CLAUDE.md - 브랜치 및 PR 관리 가이드라인