.PHONY: dev dev-frontend dev-backend

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