import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Partido } from '../models/partido.model';
import { Liga } from '../models/liga.model';
import { ToastrService } from 'ngx-toastr';
import { UserIDService } from '../services/user-id.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listado-vaticinios',
  templateUrl: './listado-vaticinios.component.html',
  styleUrls: ['./listado-vaticinios.component.css']
})
export class ListadoVaticiniosComponent implements OnInit {
  ligas: Liga = new Liga();
  userID!: number | null;
  LigasId = 0;
  idpartido = 0;
  admin = false;
  aux!: number | null;
  partidos: Partido= new Partido();
  marcador1!: number;
  marcador2!: number;


  constructor(
      public userService: UserService,
      private route: ActivatedRoute,
      private userIDService: UserIDService,
      private toastr: ToastrService ) { }

  ngOnInit(): void {
      this.idpartido = this.route.snapshot.params['idpartido'];
      this.LigasId = this.route.snapshot.params['idliga'];
      this.userID = Number(this.userIDService.getIduser());
      this.obtenerLiga();
      this.obtenerPartidos(this.idpartido);
  }

  onSubmit(){
      console.warn(this.marcador1);
  }


obtenerPartidos(id:number){
  this.userService.partidoFindByID(id).subscribe((data:Partido)=>{
  this.partidos=data;
  console.log(this.partidos);
},
error =>{
  this.toastr.error('Error al obtener partido:'+error.status, 'Fail', {
    timeOut: 6000,  positionClass: 'toast-top-center',
  });
}
  );
}


obtenerLiga(){
  this.userService.Verificador(this.LigasId).subscribe((data:number)=>{
   this.aux=data;
   if(this.aux==this.userID){
    this.admin = true;
  }else{
    this.admin = false;
  }

  }
  );

  this.userService.ligasFindById(this.LigasId).subscribe((data:Liga)=>{
      this.ligas = data;
      let userliga = this.ligas.id;
  });
  }



}
