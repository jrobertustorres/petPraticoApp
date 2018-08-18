import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

//ENTITYS
import { ProdutoEntity } from '../../model/produto-entity';

//SERVICES
import { GrupoService } from '../../providers/grupo-service';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';

@IonicPage()
@Component({
  selector: 'page-produtos-sub-grupo-list',
  templateUrl: 'produtos-sub-grupo-list.html',
})
export class ProdutosSubGrupoListPage {
  private loading = null;
  public idSubGrupo: number;
  public nomeSubGrupo: string;
  private produtosList;
  private produtoEntity: ProdutoEntity;
  tabBarElement: any;
  private refresh: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private grupoService: GrupoService,
              private sanitizer: DomSanitizer,
              public loadingCtrl: LoadingController) {
    this.produtoEntity = new ProdutoEntity();
    this.idSubGrupo = navParams.get("idSubGrupo");
    this.nomeSubGrupo = navParams.get("nomeSubGrupo");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  ngOnInit() {
    this.findProdutosSubGruposList();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.findProdutosSubGruposList();
      infiniteScroll.complete();
    }, 500);
  }
  
  findProdutosSubGruposList() {
    try {
      this.produtoEntity.limiteDados = this.produtoEntity.limiteDados ? this.produtosList.length : null;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...',
        });
        this.loading.present();
      }

      this.produtoEntity.idSubGrupo = this.idSubGrupo;
      this.grupoService.findPrecoProdutosBySubGrupo(this.produtoEntity)
      .then((produtosSubGruposListResult: ProdutoEntity) => {
        this.produtosList = produtosSubGruposListResult;
        this.produtoEntity.limiteDados = this.produtosList.length;

        console.log(this.produtosList);

        this.refresh = true;
        this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
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

  openProdutosPorLojaListPage(idProduto) {
    this.navCtrl.push(ProdutosPorLojaListPage, {
      idProduto: idProduto
    })
  }

}
