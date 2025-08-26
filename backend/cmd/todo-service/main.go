package main

import (
	"log"
	"todolist-backend/internal/application"
	"todolist-backend/internal/infrastructure"
	"todolist-backend/internal/interfaces"
	"todolist-backend/pkg/config"
)

func main() {
	cfg := config.Load()

	database, err := infrastructure.NewDatabase()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	todoRepo := infrastructure.NewTodoRepository(database.GetDB())
	todoService := application.NewTodoService(todoRepo)
	router := interfaces.NewRouter(todoService)

	log.Printf("Starting todo-service on port %s", cfg.Port)
	log.Printf("Database path: %s", cfg.DBPath)
	
	log.Printf("API endpoints available:")
	log.Printf("  GET    /health")
	log.Printf("  GET    /ready")
	log.Printf("  GET    /api/v1/todos")
	log.Printf("  GET    /api/v1/todos/:id")
	log.Printf("  POST   /api/v1/todos")
	log.Printf("  PUT    /api/v1/todos/:id")
	log.Printf("  DELETE /api/v1/todos/:id")

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}