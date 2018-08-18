import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { GrupoEntity } from '../../model/grupo-entity';

//SERVICES
import { GrupoService } from '../../providers/grupo-service';

//PAGES
import { SubGruposListPage } from '../sub-grupos-list/sub-grupos-list';

@IonicPage()
@Component({
  selector: 'page-grupos-list',
  templateUrl: 'grupos-list.html',
})
export class GruposListPage {
  private loading = null;
  // private categoria: any;
  private idCategoria: number;
  private gruposList;
  private grupoEntity: GrupoEntity;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private grupoService: GrupoService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.grupoEntity = new GrupoEntity();
    this.idCategoria = navParams.get("idCategoria");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    this.findGruposList();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  findGruposList(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.grupoEntity.idCategoria = this.idCategoria;
      this.grupoService.findGruposByCategoria(this.grupoEntity)
      .then((gruposListResult: GrupoEntity) => {
        this.gruposList = gruposListResult;

        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
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

  getItems(searchbar) {
    let q = searchbar.srcElement.value;
    if (!q) {
      this.findGruposList();
    }
  
    this.gruposList = this.gruposList.filter((v) => {
      if(v.grupo && q) {
        if (v.grupo.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  openSubGruposList(idGrupo) {
    this.navCtrl.push(SubGruposListPage, {
      idGrupo: idGrupo
    })
  }

}
