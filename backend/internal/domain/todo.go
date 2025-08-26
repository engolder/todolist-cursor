package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Todo struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Text      string    `json:"text" gorm:"not null"`
	Completed bool      `json:"completed" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

func (t *Todo) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = uuid.New().String()
	}
	return nil
}

type CreateTodoInput struct {
	Text string `json:"text" binding:"required,min=1"`
}

type UpdateTodoInput struct {
	Text      *string `json:"text,omitempty"`
	Completed *bool   `json:"completed,omitempty"`
}

type TodoRepository interface {
	GetAll() ([]Todo, error)
	GetByID(id string) (*Todo, error)
	Create(input CreateTodoInput) (*Todo, error)
	Update(id string, input UpdateTodoInput) (*Todo, error)
	Delete(id string) error
}