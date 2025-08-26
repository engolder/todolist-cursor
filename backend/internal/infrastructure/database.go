package infrastructure

import (
	"log"
	"os"
	"todolist-backend/internal/domain"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	db *gorm.DB
}

func NewDatabase() (*Database, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./todos.db"
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&domain.Todo{}); err != nil {
		return nil, err
	}

	log.Println("Database connected and migrated successfully")
	return &Database{db: db}, nil
}

func (d *Database) GetDB() *gorm.DB {
	return d.db
}