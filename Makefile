.PHONY: dev dev-frontend dev-backend test-e2e test-e2e-ci

# Frontend
dev-frontend:
	cd frontend && yarn dev

# Backend(all services)
dev-backend:
	$(MAKE) -C backend dev

# Full application
dev:
	@echo "Starting full application..."
	@$(MAKE) dev-backend &
	@$(MAKE) dev-frontend &
	@wait

# E2E Tests
test-e2e:
	@echo "Running E2E tests (requires running dev environment)..."
	cd frontend && yarn test:e2e

# E2E Tests with services auto-start for CI
test-e2e-ci:
	@echo "Running E2E tests with full CI setup..."
	./scripts/e2e-ci.sh