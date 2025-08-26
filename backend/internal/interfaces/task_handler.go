package interfaces

import (
	"errors"
	"net/http"
	"tasklist-backend/internal/application"
	"tasklist-backend/internal/domain"

	"github.com/gin-gonic/gin"
)

type TaskHandler struct {
	service *application.TaskService
}

func NewTaskHandler(service *application.TaskService) *TaskHandler {
	return &TaskHandler{service: service}
}

func (h *TaskHandler) GetTasks(c *gin.Context) {
	tasks, err := h.service.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": tasks})
}

func (h *TaskHandler) GetTask(c *gin.Context) {
	id := c.Param("id")
	
	task, err := h.service.GetTaskByID(id)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch task"})
		return
	}
	
	if task == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": task})
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	var input domain.CreateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	task, err := h.service.CreateTask(input)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"data": task})
}

func (h *TaskHandler) UpdateTask(c *gin.Context) {
	id := c.Param("id")
	
	var input domain.UpdateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	task, err := h.service.UpdateTask(id, input)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		if errors.Is(err, application.ErrTaskNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": task})
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	id := c.Param("id")
	
	err := h.service.DeleteTask(id)
	if err != nil {
		if errors.Is(err, application.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
			return
		}
		if errors.Is(err, application.ErrTaskNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}