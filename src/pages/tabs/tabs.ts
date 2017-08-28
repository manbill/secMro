import { UserState } from './../../user/user.reducer';
import { NavController, NavParams } from 'ionic-angular';
import { AppStore } from './../../app/app.store';
import { Store } from 'redux';
import { AppState } from './../../app/app.reducer';
import { Component,Inject,OnInit } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage{


  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }

}
