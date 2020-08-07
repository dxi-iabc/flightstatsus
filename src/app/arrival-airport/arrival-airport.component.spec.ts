import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalAirportComponent } from './arrival-airport.component';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('ArrivalAirportComponent', () => {
  const mockHttpClient = jasmine.createSpyObj('httpClient', ['get']);
  let component: ArrivalAirportComponent;
  let fixture: ComponentFixture<ArrivalAirportComponent>;

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
      declarations: [ ArrivalAirportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalAirportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
