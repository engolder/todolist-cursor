package infrastructure

import (
	"tasklist-backend/internal/domain"

	"gorm.io/gorm"
)

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) domain.TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) GetAll() ([]domain.Task, error) {
	var tasks []domain.Task
	err := r.db.Order("created_at DESC").Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) GetByID(id string) (*domain.Task, error) {
	var task domain.Task
	err := r.db.Where("id = ?", id).First(&task).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) Create(input domain.CreateTaskInput) (*domain.Task, error) {
	task := domain.Task{
		Text:      input.Text,
		Completed: false,
	}
	
	err := r.db.Create(&task).Error
	if err != nil {
		return nil, err
	}
	
	return &task, nil
}

func (r *taskRepository) Update(id string, input domain.UpdateTaskInput) (*domain.Task, error) {
	var task domain.Task
	err := r.db.Where("id = ?", id).First(&task).Error
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
		err = r.db.Model(&task).Updates(updates).Error
		if err != nil {
			return nil, err
		}
	}

	err = r.db.Where("id = ?", id).First(&task).Error
	return &task, err
}

func (r *taskRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Task{}).Error
}