import { Component, OnInit } from '@angular/core';
import {Database,set,ref,update,onValue} from '@angular/fire/database';
import { ActivatedRoute,Router } from '@angular/router';
import { push } from '@firebase/database';
import { Liga } from '../models/liga.model';
import { LigaUser } from '../models/ligaUser.model';
import { UserIDService } from '../services/user-id.service';
import { UserService } from '../services/user.service';
import{ ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';


@Component({
  selector: 'app-liga',
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.css']
})

export class LigaComponent implements OnInit {
ligas: Liga = new Liga();
userID!: number | null;
LigasId = 0;
admin = false;
aux!: number | null;
usuarios: Array<any>=[];
usuariosPendientes: Array<any>=[];
partidos: Array<any>=[];
  constructor(
    public database:Database,
    public userService: UserService,
    private route: ActivatedRoute,
    private userIDService: UserIDService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.LigasId = this.route.snapshot.params['id'];
    this.userID = Number(this.userIDService.getIduser());
      this.obtenerLiga();
     this.obtenerUsuario();
     this.obtenerPartidos();
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

    obtenerUsuario(){
      this.userService.UserLigasFindByLigaID(this.LigasId).subscribe((data: LigaUser[])=>{
        data.forEach((childSnapshot) => {
          const Data1 = childSnapshot;
          let usuario ={IdUnion:Data1.id,Estado:Data1.estado,Nombre:Data1.usuario.nombre, Correo:Data1.usuario.email };
          if(usuario.Estado=='Pendiente'){
            this.usuariosPendientes.push(usuario);
          }else if(usuario.Estado=='Aceptado'){
            this.usuarios.push(usuario);
          }
        });
        });

  }

  obtenerPartidos(){
    const starJor1 = ref(this.database, 'Partidos/Jornada1/');
    onValue(starJor1, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const Data1 = childSnapshot.val();
        let partidos ={bandera1:Data1.Bandera1,bandera2:Data1.Bandera2,pais1:Data1.Pais1,
          pais2:Data1.Pais2, horario:Data1.Horario, fecha:Data1.Fecha,grupos1:Data1.Tamaño};
        this.partidos.push(partidos);
      });
    });
  }

  //Funciones para Administrar usuarios de la liga
  Aceptar(id:number){
    this.userService.ChangeEstado(id,1).subscribe((data:LigaUser)=>{
      this.toastr.success('Usuario Aceptado', 'OK', {
        timeOut: 3000
      });
      
  }, 
  error =>{
    this.toastr.error('Error al aceptar Usuario:'+error.status, 'Fail', {
      timeOut: 6000,  positionClass: 'toast-top-center',
    });
  }
    );
  }

  Rechazar(id:number){
    this.userService.ChangeEstado(id,2).subscribe((data:LigaUser)=>{
      this.toastr.success('Usuario Rechazado', 'OK', {
        timeOut: 3000
      });
      
  }, 
  error =>{
    this.toastr.error('Error al rechazar usuario:'+error.status, 'Fail', {
      timeOut: 6000,  positionClass: 'toast-top-center',
    });
  });

  }
//Funcion para Invitar Usuarios

invitarUsuario(correo:String){
  this.userService.InvitarLiga(correo, this.userID).subscribe((data:String)=>{
    this.toastr.success('Usuario Invitado: '+correo, 'OK', {
      timeOut: 3000
    });
    
}, 
error =>{

  if(error.status == '200'){
    this.toastr.success('Usuario Invitado: '+correo, 'OK', {
      timeOut: 3000
    });
  }else{
  this.toastr.error('Error al invitar Usuario:'+error.status, 'Fail', {
    timeOut: 6000,  positionClass: 'toast-top-center',
  });
}
}
  );
}
}
