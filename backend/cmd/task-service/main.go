package main

import (
	"log"
	"tasklist-backend/internal/application"
	"tasklist-backend/internal/infrastructure"
	"tasklist-backend/internal/interfaces"
	"tasklist-backend/pkg/config"
)

func main() {
	cfg := config.Load()

	database, err := infrastructure.NewDatabase()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	taskRepo := infrastructure.NewTaskRepository(database.GetDB())
	taskService := application.NewTaskService(taskRepo)
	router := interfaces.NewRouter(taskService)

	log.Printf("Starting task-service on port %s", cfg.Port)
	log.Printf("Database path: %s", cfg.DBPath)
	
	log.Printf("API endpoints available:")
	log.Printf("  GET    /health")
	log.Printf("  GET    /ready")
	log.Printf("  GET    /api/v1/tasks")
	log.Printf("  GET    /api/v1/tasks/:id")
	log.Printf("  POST   /api/v1/tasks")
	log.Printf("  PUT    /api/v1/tasks/:id")
	log.Printf("  DELETE /api/v1/tasks/:id")

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}