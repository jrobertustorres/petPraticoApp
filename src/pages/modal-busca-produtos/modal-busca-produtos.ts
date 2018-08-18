import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';

//ENTITYS
import { ProdutoEntity } from '../../model/produto-entity';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';

@IonicPage()
@Component({
  selector: 'page-modal-busca-produtos',
  templateUrl: 'modal-busca-produtos.html',
})
export class ModalBuscaProdutosPage {
  public loading = null;
  private produtoEntity: ProdutoEntity;
  private produtosList: any;
  public nomeProduto: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private produtoService: ProdutoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.produtoEntity = new ProdutoEntity();
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getProdutoByNomeList(this.nomeProduto);
      infiniteScroll.complete();
    }, 500);
  }
  
  getProdutoByNomeList(nomeProduto){
    
    try {
      this.nomeProduto = nomeProduto.srcElement.value;
      if (this.nomeProduto) {
            
        this.produtoEntity.limiteDados = this.produtoEntity.limiteDados ? this.produtosList.length : null;

          if(this.nomeProduto) {
            this.loading = this.loadingCtrl.create({
              content: 'Aguarde...'
            });
            this.loading.present();
          }

          this.produtoEntity.produto = this.nomeProduto;
          this.produtoService.findProdutoByNome(this.produtoEntity)
          .then((produtoResult: ProdutoEntity) => {
            this.produtosList = produtoResult;
            this.produtoEntity.limiteDados = this.produtosList.length;

            this.loading.dismiss();
          }, (err) => {
            this.loading.dismiss();
            this.alertCtrl.create({
              subTitle: err.message,
              buttons: ['OK']
            }).present();
          });

      } else {
        this.showAlert();
      }
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Buscar produto!',
      subTitle: 'Favor informar algum produto no campo de Busca!',
      buttons: ['OK']
    });
    alert.present();
  }

  openProdutosPorLojaListPage(idProduto) {
    this.navCtrl.push(ProdutosPorLojaListPage, {
      idProduto: idProduto
    })
  }

}
