import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('show error true', () => {
    component.errorStatus = {
      message: 'error occured',
      status: 'Not Ok'
    };
    expect(component.onError())
    expect(component.showError).toBeTruthy();
  })

  it('show error false', () => {
    component.errorStatus = {
      message: '',
      status: 'Not Ok'
    };
    expect(component.onError())
    expect(component.showError).toBeFalsy();
  })

  it('close dialog', () => {
    expect(component.closeErrorDialog())
    expect(component.showError).toBeFalsy();
  })
});
