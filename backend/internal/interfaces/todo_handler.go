package interfaces

import (
	"errors"
	"net/http"
	"todolist-backend/internal/application"
	"todolist-backend/internal/domain"

	"github.com/gin-gonic/gin"
)

type TodoHandler struct {
	service *application.TodoService
}

func NewTodoHandler(service *application.TodoService) *TodoHandler {
	return &TodoHandler{service: service}
}

func (h *TodoHandler) GetTodos(c *gin.Context) {
	todos, err := h.service.GetAllTodos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todos"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": todos})
}

func (h *TodoHandler) GetTodo(c *gin.Context) {
	id := c.Param("id")
	
	todo, err := h.service.GetTodoByID(id)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todo"})
		return
	}
	
	if todo == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": todo})
}

func (h *TodoHandler) CreateTodo(c *gin.Context) {
	var input domain.CreateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	todo, err := h.service.CreateTodo(input)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create todo"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": todo})
}

func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	
	var input domain.UpdateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	todo, err := h.service.UpdateTodo(id, input)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		if errors.Is(err, application.ErrTodoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update todo"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": todo})
}

func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	
	err := h.service.DeleteTodo(id)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
			return
		}
		if errors.Is(err, application.ErrTodoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete todo"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
}