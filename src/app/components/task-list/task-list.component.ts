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
    if (!task.taskId) {
      return;
    }

    const updatedTask: Task = {
      ...task,
      completed: checked ? 1 : 0,
    };

    this.taskService.updateTask(task.taskId, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      },
    });
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
