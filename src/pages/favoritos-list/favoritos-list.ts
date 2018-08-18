import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//SERVICES
import { FavoritosService } from './../../providers/favoritos-service';

//ENTITYS
import { FavoritoEntity } from '../../model/favorito-entity';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-favoritos-list',
  templateUrl: 'favoritos-list.html',
})
export class FavoritosListPage {
  public loading = null;
  public favoritosList: any;
  private favoritoEntity: FavoritoEntity;
  private toastMessage: string;
  public idUsuario: string;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public favoritosService: FavoritosService,
              public navParams: NavParams) {
    this.favoritoEntity = new FavoritoEntity();
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
  }
  
  ionViewDidLoad() {
  }
  
  ionViewWillEnter(){
    if (this.idUsuario) {
      this.getListaFavoritos();
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.toastMessage,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getListaFavoritos(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritosService.getFavoritos()
      .then((favoritosListResult: FavoritoEntity) => {
        this.favoritosList = favoritosListResult;

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

  removerFavorito(idFavoritos) {
    console.log(idFavoritos);
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEntity.idFavoritos = idFavoritos;
      this.favoritosService.removerFavoritos(this.favoritoEntity)
      .then((favoritosListResult: FavoritoEntity) => {
        let index = this.favoritosList.indexOf(idFavoritos);
        this.favoritosList.splice(index, 1);
        this.loading.dismiss();
        this.toastMessage = 'O produto foi removido dos seus favoritos!';

        this.presentToast();
        // setTimeout(() => {
          // this.navCtrl.setRoot(HomePage);
        // }, 2000);

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

  showConfirmrRemover(idFavoritos) {
    const confirm = this.alertCtrl.create({
      title: 'Remover produto favorito?',
      message: 'Remover este produto dos seus favoritos?',
      buttons: [
        {
          text: 'MANTER',
          handler: () => {
          }
        },
        {
          text: 'REMOVER',
          handler: () => {
            this.removerFavorito(idFavoritos);
          }
        }
      ]
    });
    confirm.present();
  }

  openProdutosPorLojaListPage(idProduto) {
    this.navCtrl.push(ProdutosPorLojaListPage, {
      idProduto: idProduto
    })
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
