import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITIES
import { AgendaEntity } from '../../model/agenda-entity'

//SERVICES
import { AgendaService } from '../../providers/agenda-service';

//PAGES
import { AgendaDetalhePage } from '../agenda-detalhe/agenda-detalhe';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-agenda-list',
  templateUrl: 'agenda-list.html',
})
export class AgendaListPage {
  private loading = null;
  private agendaList: any = null;
  public idUsuario: string = null;
  private agendaEntity: AgendaEntity;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private agendaService: AgendaService,
              public platform: Platform,
              public navParams: NavParams) {
    this.agendaEntity = new AgendaEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {}

  ionViewWillEnter(){
    this.agendaList = null;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    if (localStorage.getItem(Constants.ID_USUARIO)) {
      this.findAgendaList();
    }
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  findAgendaList() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...',
      });
      this.loading.present();

      this.agendaService.findListAgenda()
        .then((agendaListResult: AgendaEntity) => {
          this.agendaList = agendaListResult;
          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          err.message = err.message ? err.message : 'Falha ao conectar ao servidor';
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  openDetalhesAgenda(idAgenda) {
    this.navCtrl.push(AgendaDetalhePage, {
      idAgenda: idAgenda
    })
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
