import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../app/constants';

//ENTITYS
import { ProdutoEntity } from '../../model/produto-entity';

//SERVICES
import { GrupoService } from '../../providers/grupo-service';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

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
  private idUsuarioLogado: any;
  private isCadastroCompleto: any;
  private isCadastroEnderecoCompleto: any;
  private messageDadosCadastrais: string;
  private canLoadMore: boolean = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private grupoService: GrupoService,
              private sanitizer: DomSanitizer,
              public platform: Platform,
              public loadingCtrl: LoadingController) {
    this.produtoEntity = new ProdutoEntity();
    this.idSubGrupo = navParams.get("idSubGrupo");
    this.nomeSubGrupo = navParams.get("nomeSubGrupo");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isCadastroCompleto = localStorage.getItem(Constants.IS_CADASTRO_COMPLETO);
    this.isCadastroEnderecoCompleto = localStorage.getItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO);
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    // this.isCadastroCompleto = localStorage.getItem(Constants.IS_CADASTRO_COMPLETO);
    // this.isCadastroEnderecoCompleto = localStorage.getItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO);
    this.findProdutosSubGruposList(null);
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
      this.findProdutosSubGruposList(infiniteScroll);
      // infiniteScroll.complete();
    }, 500);
  }
  
  findProdutosSubGruposList(infiniteScroll) {
    try {
      this.produtoEntity.limiteDados = this.produtoEntity.limiteDados ? this.produtosList.length : null;

      if(this.produtoEntity.limiteDados == null) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...',
        });
        this.loading.present();
      }

      this.produtoEntity.idSubGrupo = this.idSubGrupo;
      this.grupoService.findPrecoProdutosBySubGrupo(this.produtoEntity)
      .then((produtosSubGruposListResult: ProdutoEntity) => {
        this.produtosList = produtosSubGruposListResult;
        if(this.produtoEntity.limiteDados == this.produtosList.length) {
          this.canLoadMore = false;
        }
        this.produtoEntity.limiteDados = this.produtosList.length;

        if(infiniteScroll) {
          infiniteScroll.complete();
        }

        // this.refresh = true;
        // this.loading ? this.loading.dismiss() : '';
        // this.loading.dismiss();
        if(this.loading) {
          this.loading.dismiss();
        }
      }, (err) => {
        this.loading.dismiss();
        // this.loading ? this.loading.dismiss() : '';
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

  validaCadastroUsuario(idProduto) {
    // let tipoCadastro = null;
    if(this.idUsuarioLogado) {

      this.messageDadosCadastrais = (!this.isCadastroCompleto && !this.isCadastroEnderecoCompleto) ? 'Finalize seu cadastro de dados pessoais e endereço para ver os preços na sua cidade' : null;
      this.messageDadosCadastrais = !this.isCadastroCompleto ? 'Para continuar, complete seus dados pessoais.' : null;
      this.messageDadosCadastrais = !this.isCadastroEnderecoCompleto ? 'Complete seu endereço para ver os preços na sua cidade' : null;
      // if(!this.isCadastroCompleto && !this.isCadastroEnderecoCompleto) {
      //   this.messageDadosCadastrais = 'Finalize seu cadastro de dados pessoais e endereço para ver os preços na sua cidade';
      //   this.showConfirmCadastro();
      // }

      if(this.messageDadosCadastrais != null) {
      // if(!this.isCadastroCompleto) {
      //   this.messageDadosCadastrais = 'Para continuar, complete seus dados pessoais.';
      //   this.showConfirmCadastro();
      // } else if(!this.isCadastroEnderecoCompleto) {
      //   this.messageDadosCadastrais = 'Complete seu endereço para ver os preços na sua cidade';
        this.showConfirmCadastro();
      } else {
        this.openProdutosPorLojaListPage(idProduto);
      }
    }

  }

  showConfirmCadastro() {
    const confirm = this.alertCtrl.create({
      title: 'Seu cadastro está incompleto!',
      message: this.messageDadosCadastrais,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Completar',
          handler: () => {
            console.log('Agree clicked');
            this.navCtrl.setRoot(ConfiguracoesPage);
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

}
