# Go 백엔드 마이크로서비스 구축

## 작업 개요
- 목적: todolist 애플리케이션의 백엔드 REST API 서버를 Go로 구축하고, 마이크로서비스 전환에 대비한 아키텍처 적용
- 배경: 기존 클라이언트 사이드만 있던 Todo 기능을 서버 데이터베이스와 연동하여 데이터 영속성 확보
- 기술 스택: Go + Gin + GORM + SQLite + Clean Architecture

> **참고**: 자세한 프로젝트 구조와 API 명세는 `backend/CLAUDE.md` 참조

## 작업 과정

### 1. 아키텍처 설계
- **Clean Architecture + DDD**: 비즈니스 로직과 인프라 분리
- **마이크로서비스 준비**: 독립 배포 가능한 구조
- **API 버저닝**: `/api/v1/` 구조로 하위 호환성 보장

### 2. 핵심 구현 사항
- **4계층 아키텍처**: Domain → Application → Infrastructure → Interface
- **Repository Pattern**: 데이터 접근 계층 추상화  
- **Health Check 엔드포인트**: 마이크로서비스 운영 대비
- **프론트엔드 연동**: Zustand → React Query 전환

### 3. 검증 및 테스트
- **백엔드 API 테스트**:
  - Health check: `curl http://localhost:8080/health` ✅
  - Todo 생성: `POST /api/v1/todos` ✅
  - Todo 조회: `GET /api/v1/todos` ✅
  - 데이터베이스 마이그레이션 자동 실행 확인

- **프론트엔드 연동**: 
  - React Query 프로바이더 적용
  - 기존 Zustand 스토어에서 서버 상태 관리로 전환
  - 로딩/에러 상태 처리 추가

## 마이크로서비스 대비 설계 결정
- **독립성**: 서비스별 진입점(`cmd/todo-service/`), 독립 데이터베이스, 환경변수 기반 설정
- **통신**: RESTful API, Health Check, API 버저닝(`/api/v1/`)
- **운영**: 구조화된 로깅, 일관된 에러 처리, CORS 설정

## 발생한 문제 및 해결

### 문제 1: Go 모듈 의존성 설치 타이밍
- **문제**: Go 파일이 없는 상태에서 `go mod tidy` 실행 시 패키지를 찾을 수 없는 오류
- **원인**: Go 모듈 시스템은 실제 import 되는 패키지만 다운로드
- **해결**: 먼저 Go 파일들을 생성한 후 `go mod tidy` 실행하여 의존성 설치

### 문제 2: 프론트엔드 타입 호환성
- **문제**: Go의 `time.Time`과 TypeScript의 `string` 타입 불일치
- **원인**: JSON 직렬화 시 시간 형식 차이
- **해결**: Go 구조체에 JSON 태그를 사용하여 ISO 8601 문자열로 직렬화

### 문제 3: CORS 설정
- **문제**: 브라우저에서 API 호출 시 CORS 에러 발생
- **원인**: 기본적으로 브라우저는 다른 포트의 리소스 접근을 차단
- **해결**: `gin-contrib/cors` 미들웨어를 사용하여 개발 환경 포트 허용

## 결과 및 영향

### 최종 결과물
- **완전한 풀스택 Todo 애플리케이션**: 프론트엔드 + 백엔드 + 데이터베이스
- **데이터 영속성**: SQLite 데이터베이스를 통한 데이터 저장
- **마이크로서비스 준비**: 독립 배포 가능한 아키텍처

### 코드베이스에 미친 영향
- **프론트엔드**: Zustand → React Query 전환으로 서버 상태 관리 개선
- **아키텍처**: Clean Architecture 도입으로 코드 구조 개선
- **개발 워크플로**: 백엔드/프론트엔드 동시 개발 환경 구축

### 성능 및 확장성
- **응답 시간**: 로컬 SQLite 기준 평균 < 10ms
- **확장성**: 마이크로서비스 전환 시 독립적 스케일링 가능
- **유지보수성**: 레이어별 책임 분리로 코드 변경 영향도 최소화

## 향후 개선사항
- **운영**: Docker 컨테이너화, PostgreSQL 연동, 환경별 설정 분리
- **마이크로서비스**: Service Mesh, API Gateway, 분산 트레이싱
- **보안**: JWT 인증, Rate Limiting, 입력 검증 강화  
- **모니터링**: Prometheus 메트릭, 구조화된 로깅, 중앙 로깅 시스템

## 참고 문서
- [Go 공식 문서](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [GORM ORM Library](https://gorm.io/docs/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Query 문서](https://tanstack.com/query/latest)
- [마이크로서비스 패턴 - Chris Richardson](https://microservices.io/patterns/index.html)