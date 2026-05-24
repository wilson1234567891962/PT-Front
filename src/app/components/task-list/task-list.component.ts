import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  taskPendingStatusChange: Task | null = null;
  pendingCompletedValue = false;
  isStatusModalOpen = false;
  tasks: Task[] = [];
  selectedTask: Task | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  onEditTask(task: Task): void {
    this.selectedTask = { ...task };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteTask(task: Task): void {
    if (!task.taskId) {
      return;
    }

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar la tarea "${task.title}"?`);

    if (!confirmDelete) {
      return;
    }

    this.taskService.deleteTask(task.taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      },
    });
  }

  onToggleCompleted(task: Task, checked: boolean): void {
    this.taskPendingStatusChange = task;
    this.pendingCompletedValue = checked;
    this.isStatusModalOpen = true;
  }

  confirmStatusChange(): void {
    if (!this.taskPendingStatusChange?.taskId) {
      this.closeStatusModal();
      return;
    }

    const updatedTask: Task = {
      ...this.taskPendingStatusChange,
      completed: this.pendingCompletedValue ? 1 : 0,
    };

    this.taskService.updateTask(this.taskPendingStatusChange.taskId, updatedTask).subscribe({
      next: () => {
        this.closeStatusModal();
        this.loadTasks();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.closeStatusModal();
      },
    });
  }

  closeStatusModal(): void {
    this.isStatusModalOpen = false;
    this.taskPendingStatusChange = null;
    this.pendingCompletedValue = false;
  }

  onFormSaved(): void {
    this.selectedTask = null;
    this.loadTasks();
  }

  onEditCancelled(): void {
    this.selectedTask = null;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId ?? index;
  }
}
