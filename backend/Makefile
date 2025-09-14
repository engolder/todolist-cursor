.PHONY: dev dev-task dev-all

# task service
dev-task:
	go run cmd/task-service/main.go

# Future services(not implemented)
# dev-user:
#	go run cmd/user-service/main.go
# dev-auth:
#	go run cmd/auth-service/main.go

# All services
dev-all:
	@echo "Starting all backend services..."
	@$(MAKE) dev-task &
	@wait

# Default: all services
dev: dev-all