import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common';
@Component({
  selector: 'sidenav-bar',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class SideBarComponent implements OnInit  {

  clickedItem: string;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  constructor(private breakpointObserver: BreakpointObserver,location: Location) {}

  
  onClick(item: 'dashboard' | 'searchcode' | 'searchfl') {
    localStorage.setItem('selectedmneu', item);
    this.clickedItem = item;
  }
  ngOnInit() {
   
    this.clickedItem=localStorage.getItem('selectedmneu');
    if(location.pathname.indexOf("/dashboard") >= 0)
    this.clickedItem ="dashboard" ;
   

  }
  
}
