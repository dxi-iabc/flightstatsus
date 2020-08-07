import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureAirportComponent } from './departure-airport.component';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('DepartureAirportComponent', () => {
  const mockHttpClient = jasmine.createSpyObj('httpClient', ['get']);
  let component: DepartureAirportComponent;
  let fixture: ComponentFixture<DepartureAirportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ],
      imports: [
        RouterTestingModule,
        NbLayoutModule,
        NbThemeModule.forRoot({name: 'cosmic'}),
        FormsModule,
        ChartsModule
      ],
      declarations: [ DepartureAirportComponent ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureAirportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
