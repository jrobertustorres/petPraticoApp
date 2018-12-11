import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

//SERVICES
import { GrupoService } from '../../providers/grupo-service';

//ENTITYS
import { SubGrupoEntity } from '../../model/sub-grupo-entity';

//PAGES
import { ProdutosSubGrupoListPage } from '../produtos-sub-grupo-list/produtos-sub-grupo-list';

@IonicPage()
@Component({
  selector: 'page-sub-grupos-list',
  templateUrl: 'sub-grupos-list.html',
})
export class SubGruposListPage {
  private loading = null;
  public idGrupo: number;
  private subGruposList;
  private subGrupoEntity: SubGrupoEntity;
  tabBarElement: any;

  // private unregisterBackButtonAction: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private grupoService: GrupoService,
              public platform: Platform,
              public loadingCtrl: LoadingController) {
    this.subGrupoEntity = new SubGrupoEntity();
    this.idGrupo = navParams.get("idGrupo");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  ngOnInit() {
    this.findSubGruposList();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }
  
  findSubGruposList() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.subGrupoEntity.idGrupo = this.idGrupo;
      this.grupoService.findSubGruposByGrupo(this.subGrupoEntity)
      .then((subGruposListResult: SubGrupoEntity) => {
        this.subGruposList = subGruposListResult;
        
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
      this.findSubGruposList();
    }
  
    this.subGruposList = this.subGruposList.filter((v) => {
      if(v.subGrupo && q) {
        if (v.subGrupo.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  openProdutosSubGrupoListPage(idSubGrupo, nomeSubGrupo) {
    this.navCtrl.push(ProdutosSubGrupoListPage, {
      idSubGrupo: idSubGrupo,
      nomeSubGrupo: nomeSubGrupo
    })
  }

}
