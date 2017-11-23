import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TeamService } from '../../services/data/team.service';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';


export interface Post {
  teamForm: FormGroup;
}

@Component({
  selector: 'teamSelector',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  providers: [TeamService]
})

export class TeamComponent implements OnInit {


  public showForm = true;
  public showReport = false;

  public viewAddTeam = false;


  public numberTeams: number;
  public numberPlayers: number;
  public youngestPlayer;
  public oldestPlayer;
  public substitutePlayer: number;
  public averageAgePlayer;
  public oldestCouch;

  public teamForm: FormGroup;
  public teams;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private afs: AngularFirestore,
    private _teamService: TeamService,
  ) {


    const collection: AngularFirestoreCollection<Post> = afs.collection('post');
    const collection$: Observable<any> = collection.valueChanges();
    collection$.subscribe(data => {
      this.teams = data;
      this.numberTeams = data.length;

      this.getPlayers(data);
      this.getYoungestPlayer(data);
      this.getOldestPlayer(data);
      this.getSubstitutePlayer(data);
      this.getDateAveragePlayer(data);
      this.getCouchMoreOldest(data);

    });


  }

  ngOnInit() {
    this.teamForm = this._fb.group({
      players: this._fb.array([this.initItemRows()]),
      trainers: this._fb.array([this.initTrainers()]),
      team: this._fb.array([this.initTeam()]),
    });

  }

  initItemRows() {
    return this._fb.group({
      namePlayer: [''],
      LastNamePlayer: [''],
      datePlayer: [''],
      positionPlayer: [''],
      numberShirtPlayer: [''],
      isTitular: [''],
      imagePlayer: [''],
    });
  }

  initTeam() {
    return this._fb.group({
      nameTeam: [''],
      flagTeam: [''],
      countryTeam: [''],
    });
  }

  initTrainers() {
    return this._fb.group({
      nameTrainer: [''],
      LastNameTrainer: [''],
      dateTrainer: [''],
      nacionalityTrainer: [''],
      rolTrainer: ['']
    });
  }

  addNewRowPlayer() {
    const control = <FormArray>this.teamForm.controls['players'];
    control.push(this.initItemRows());
  }

  addNewRowTrainer() {
    const control = <FormArray>this.teamForm.controls['trainers'];
    control.push(this.initTrainers());
  }

  deleteRowPlayer(index: number) {
    const control = <FormArray>this.teamForm.controls['players'];
    control.removeAt(index);
  }

  deleteRowTrainer(index: number) {
    const control = <FormArray>this.teamForm.controls['trainers'];
    control.removeAt(index);
  }


  addTeam(formTeam) {
    this.afs.collection('post').add(formTeam);
    this.viewAddTeam = true;
    this.showForm = false;

  }

viewAddReport(value) {
  if (!value) {
    this.showForm = true;
    this.viewAddTeam = false;
  }
}


  viewReport(value) {

    if (value) {
      this.showForm = false;
      this.showReport = true;
    } else {
      this.showForm = true;
      this.showReport = false;
    }

  }

  getPlayers(teams) {
    const totalPlayers = teams.map(team => team.players.length).reduce((total, next) => (total + next), 0);
    this.numberPlayers = totalPlayers;
  }

  getYoungestPlayer(teams) {
    const players = teams.map(team => team.players);
    let dateAux = '';
    players.forEach(player => {
      player.forEach(dateplayer => {

        let datePlayer = dateplayer.datePlayer;
        if (dateAux === '') {
          dateAux = datePlayer;
        }
        if (datePlayer > dateAux) {
          dateAux = datePlayer;
          this.youngestPlayer = dateplayer.namePlayer + ' ' + dateplayer.LastNamePlayer;
        }
      });
    });
  }

  getOldestPlayer(teams) {
    const players = teams.map(team => team.players);
    let dateAux = '';
    players.forEach(player => {
      player.forEach(dateplayer => {

        let datePlayer = dateplayer.datePlayer;
        if (dateAux === '') {

          dateAux = datePlayer;
        }
        if (datePlayer < dateAux) {
          dateAux = datePlayer;
          this.oldestPlayer = dateplayer.namePlayer + ' ' + dateplayer.LastNamePlayer;
        }
      });
    });
  }


  getSubstitutePlayer(teams) {
    const players = teams.map(team => team.players);
    let totalSubstitutePlayer = [];
    players.forEach(player => {
      player.forEach(substitutePlayer => {

        let playerTitualOrSubstitute = substitutePlayer.isTitular;
        if (playerTitualOrSubstitute === 'No') {
          totalSubstitutePlayer.push(substitutePlayer);
        }
      });
    });
    this.substitutePlayer = totalSubstitutePlayer.length;
  }


  getDateAveragePlayer(teams) {


    const totalPlayers = teams.map(team => team.players.length).reduce((total, next) => (total + next), 0);
    let dates = [];
    let datePromedio;
    let dateAveragePlayer;
    let datePlayer;
    const players = teams.map(team => team.players);
    players.forEach(player => {
      player.forEach(dateplayer => {
        datePlayer = dateplayer.datePlayer;
        const age = moment().diff(datePlayer, 'years');
        dates.push(age);

        datePromedio = dates.reduce((total, next) => (total + next), 0);
      });
    });

    dateAveragePlayer = (datePromedio / totalPlayers);
    this.averageAgePlayer = dateAveragePlayer;
  }


getCouchMoreOldest(teams) {

   const trainers = teams.map(team => team.trainers);
    let dateAux = '';
    let dateCouch;
    trainers.forEach(trainer => {
      trainer.forEach(dateTrainer => {
        dateCouch = dateTrainer.dateTrainer;
        if (dateAux === '') {

          dateAux = dateCouch;
        }
        if (dateCouch < dateAux) {
          dateAux = dateCouch;
          this.oldestCouch = dateTrainer.nameTrainer + ' ' + dateTrainer.LastNameTrainer;
        }
      });
    });

}



  /*
    getAverageSubstitutePlayer(teams) {
      let arraySubstitutePlayer = [];
      let totalSubstitutePlayer;
      let totalPlayers;
      let nameTeam;
      let AverageSubstitutePlayer;
      const teamNames = teams.map(team => team.team);
      teamNames.forEach(teamName => {
        teamName.forEach(name => {
          nameTeam = name.nameTeam;
        });
        const players = teams.map(team => team.players);

        players.forEach(player => {
          player.forEach(substitutePlayer => {
            let playerTitualOrSubstitute = substitutePlayer.isTitular;
            if (playerTitualOrSubstitute === 'No') {
              arraySubstitutePlayer.push(substitutePlayer);
            }
            totalSubstitutePlayer = arraySubstitutePlayer.length;
            totalPlayers = player.length;
          });
          AverageSubstitutePlayer = (totalSubstitutePlayer / totalPlayers) * 100;
      console.log(this.averageSubstitutePlayer);
      this.averageSubstitutePlayer = nameTeam + ':  ' + AverageSubstitutePlayer + '%';
      console.log(this.averageSubstitutePlayer);
        });
      });
    }

  */



}
