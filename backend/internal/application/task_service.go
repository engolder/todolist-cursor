package application

import (
	"errors"
	"tasklist-backend/internal/domain"
)

var (
	ErrTaskNotFound = errors.New("task not found")
	ErrInvalidInput = errors.New("invalid input")
)

type TaskService struct {
	repo domain.TaskRepository
}

func NewTaskService(repo domain.TaskRepository) *TaskService {
	return &TaskService{
		repo: repo,
	}
}

func (s *TaskService) GetAllTasks() ([]domain.Task, error) {
	return s.repo.GetAll()
}

func (s *TaskService) GetTaskByID(id string) (*domain.Task, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}
	return s.repo.GetByID(id)
}

func (s *TaskService) CreateTask(input domain.CreateTaskInput) (*domain.Task, error) {
	if input.Text == "" {
		return nil, ErrInvalidInput
	}
	return s.repo.Create(input)
}

func (s *TaskService) UpdateTask(id string, input domain.UpdateTaskInput) (*domain.Task, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}
	
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrTaskNotFound
	}
	
	return s.repo.Update(id, input)
}

func (s *TaskService) DeleteTask(id string) error {
	if id == "" {
		return ErrInvalidInput
	}
	
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrTaskNotFound
	}
	
	return s.repo.Delete(id)
}