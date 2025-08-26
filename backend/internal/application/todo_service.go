package application

import (
	"errors"
	"todolist-backend/internal/domain"
)

var (
	ErrTodoNotFound = errors.New("todo not found")
	ErrInvalidInput = errors.New("invalid input")
)

type TodoService struct {
	repo domain.TodoRepository
}

func NewTodoService(repo domain.TodoRepository) *TodoService {
	return &TodoService{
		repo: repo,
	}
}

func (s *TodoService) GetAllTodos() ([]domain.Todo, error) {
	return s.repo.GetAll()
}

func (s *TodoService) GetTodoByID(id string) (*domain.Todo, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}
	return s.repo.GetByID(id)
}

func (s *TodoService) CreateTodo(input domain.CreateTodoInput) (*domain.Todo, error) {
	if input.Text == "" {
		return nil, ErrInvalidInput
	}
	return s.repo.Create(input)
}

func (s *TodoService) UpdateTodo(id string, input domain.UpdateTodoInput) (*domain.Todo, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}
	
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrTodoNotFound
	}
	
	return s.repo.Update(id, input)
}

func (s *TodoService) DeleteTodo(id string) error {
	if id == "" {
		return ErrInvalidInput
	}
	
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrTodoNotFound
	}
	
	return s.repo.Delete(id)
}