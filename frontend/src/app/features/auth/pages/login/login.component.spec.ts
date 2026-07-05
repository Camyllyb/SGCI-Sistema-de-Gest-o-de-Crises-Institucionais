import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show error message when login fails', () => {
    const component = fixture.componentInstance;
    component.email.set('admin@crisis.local');
    component.password.set('wrong-password');

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    req.flush({ authenticated: false, message: 'Credenciais inválidas' });

    expect(component.errorMessage()).toBe('Credenciais inválidas');
  });
});
