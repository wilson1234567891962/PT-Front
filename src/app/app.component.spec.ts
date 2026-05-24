import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';

describe('AppComponent', () => {
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
      imports: [AppComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should have the title task', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.title).toEqual('task');
  });
});
