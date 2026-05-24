import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;

  @Output() formSaved = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  isSubmitting = false;
  errorMessage = '';

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    completed: [false],
  });

  get isEditMode(): boolean {
    return !!this.taskToEdit?.taskId;
  }

  get titleInvalid(): boolean {
    const titleControl = this.taskForm.controls.title;
    return titleControl.invalid && (titleControl.dirty || titleControl.touched);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description ?? '',
        completed: this.taskToEdit.completed,
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.taskForm.getRawValue();

    const task: Task = {
      taskId: this.taskToEdit?.taskId,
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      completed: formValue.completed,
    };

    if (this.isEditMode && task.taskId) {
      this.taskService.updateTask(task.taskId, task).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: (error: Error) => {
          this.handleError(error);
        },
      });

      return;
    }

    this.taskService.createTask(task).subscribe({
      next: (createdTask: Task) => {
        if (task.completed && createdTask.taskId) {
          this.taskService.completeTask(createdTask.taskId).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (error: Error) => {
              this.handleError(error);
            },
          });

          return;
        }

        this.handleSuccess();
      },
      error: (error: Error) => {
        this.handleError(error);
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    this.editCancelled.emit();
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.resetForm();
    this.formSaved.emit();
  }

  private handleError(error: Error): void {
    this.isSubmitting = false;
    this.errorMessage = error.message;
  }

  private resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      completed: false,
    });

    this.errorMessage = '';
  }
}
