package infrastructure

import (
	"todolist-backend/internal/domain"

	"gorm.io/gorm"
)

type todoRepository struct {
	db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) domain.TodoRepository {
	return &todoRepository{db: db}
}

func (r *todoRepository) GetAll() ([]domain.Todo, error) {
	var todos []domain.Todo
	err := r.db.Order("created_at DESC").Find(&todos).Error
	return todos, err
}

func (r *todoRepository) GetByID(id string) (*domain.Todo, error) {
	var todo domain.Todo
	err := r.db.Where("id = ?", id).First(&todo).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &todo, nil
}

func (r *todoRepository) Create(input domain.CreateTodoInput) (*domain.Todo, error) {
	todo := domain.Todo{
		Text:      input.Text,
		Completed: false,
	}
	
	err := r.db.Create(&todo).Error
	if err != nil {
		return nil, err
	}
	
	return &todo, nil
}

func (r *todoRepository) Update(id string, input domain.UpdateTodoInput) (*domain.Todo, error) {
	var todo domain.Todo
	err := r.db.Where("id = ?", id).First(&todo).Error
	if err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})
	if input.Text != nil {
		updates["text"] = *input.Text
	}
	if input.Completed != nil {
		updates["completed"] = *input.Completed
	}

	if len(updates) > 0 {
		err = r.db.Model(&todo).Updates(updates).Error
		if err != nil {
			return nil, err
		}
	}

	err = r.db.Where("id = ?", id).First(&todo).Error
	return &todo, err
}

func (r *todoRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Todo{}).Error
}