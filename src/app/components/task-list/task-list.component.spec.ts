import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', [
      'getAllTasks',
      'getTaskById',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);

    taskServiceSpy.getAllTasks.and.returnValue(of([]));
    taskServiceSpy.createTask.and.returnValue(
      of({
        taskId: 1,
        title: 'Nueva tarea',
        description: 'Descripción',
        completed: false,
      })
    );
    taskServiceSpy.updateTask.and.returnValue(
      of({
        taskId: 1,
        title: 'Tarea actualizada',
        description: 'Descripción',
        completed: true,
      })
    );
    taskServiceSpy.deleteTask.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskServiceSpy.getAllTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual([]);
  });
});
