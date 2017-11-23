import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TeamComponent } from './components//team/team.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

import {routing, appRoutingProviders} from './app.routin';


var firebaseConfig = {
    apiKey: "AIzaSyCflXP1AKEWqKqsAwIq70JIAZQvTSVFNoc",
    authDomain: "fifateams-b3dc7.firebaseapp.com",
    databaseURL: "https://fifateams-b3dc7.firebaseio.com",
    projectId: "fifateams-b3dc7",
    storageBucket: "fifateams-b3dc7.appspot.com",
    messagingSenderId: "932988620126"
};


@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
