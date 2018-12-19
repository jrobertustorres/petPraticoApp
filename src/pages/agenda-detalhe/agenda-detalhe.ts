import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { AgendaService } from '../../providers/agenda-service';

//ENTITIES
import { AgendaDetalheEntity } from '../../model/agenda-detalhe-entity';

@IonicPage()
@Component({
  selector: 'page-agenda-detalhe',
  templateUrl: 'agenda-detalhe.html',
})
export class AgendaDetalhePage {
  private idAgenda: number;
  private loading = null;
  private agendaDetalheEntity: AgendaDetalheEntity;
  listDescricaoServico: string[];

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private agendaService: AgendaService,
              public navParams: NavParams) {
    this.idAgenda = navParams.get("idAgenda"); 
    this.agendaDetalheEntity = new AgendaDetalheEntity();
  }

  ngOnInit() {
    this.findDetalhesAgenda();
  }

  findDetalhesAgenda() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...',
      });
      this.loading.present();

      this.agendaDetalheEntity.idAgenda = this.idAgenda;
      this.agendaService.findDetalheAgenda(this.agendaDetalheEntity)
        .then((agendaDetalheResult: AgendaDetalheEntity) => {
          this.agendaDetalheEntity = agendaDetalheResult;
          this.listDescricaoServico = this.agendaDetalheEntity.listDescricaoServico;

          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          // err.message = err.message ? err.message : 'Falha ao conectar ao servidor';
          this.alertCtrl.create({
            subTitle: err.message = err.message ? err.message : 'Falha ao conectar ao servidor',
            buttons: ['OK']
          }).present();
        });
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

}
