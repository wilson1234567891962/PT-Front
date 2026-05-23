import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', ['createTask', 'updateTask']);

    taskServiceSpy.createTask.and.returnValue(
      of({
        taskId: 1,
        title: 'Nueva tarea',
        description: 'Descripción',
        completed: 0,
      })
    );

    taskServiceSpy.updateTask.and.returnValue(
      of({
        taskId: 1,
        title: 'Tarea actualizada',
        description: 'Descripción actualizada',
        completed: 1,
      })
    );

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title as required', () => {
    const titleControl = component.taskForm.controls.title;

    titleControl.setValue('');
    titleControl.markAsTouched();

    expect(titleControl.invalid).toBeTrue();
    expect(component.titleInvalid).toBeTrue();
  });

  it('should create task when form is valid', () => {
    spyOn(component.formSaved, 'emit');

    component.taskForm.setValue({
      title: 'Nueva tarea',
      description: 'Descripción',
      completed: false,
    });

    component.onSubmit();

    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(component.formSaved.emit).toHaveBeenCalled();
  });
});
