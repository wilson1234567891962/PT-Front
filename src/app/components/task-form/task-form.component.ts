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
        completed: this.taskToEdit.completed === 1,
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
      completed: formValue.completed ? 1 : 0,
    };

    const request$ =
      this.isEditMode && task.taskId
        ? this.taskService.updateTask(task.taskId, task)
        : this.taskService.createTask(task);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.formSaved.emit();
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message;
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    this.editCancelled.emit();
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
