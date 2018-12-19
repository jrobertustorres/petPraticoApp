import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITIES
import { GrupoEntity } from '../../model/grupo-entity';
import { ProdutoEntity } from '../../model/produto-entity';

//SERVICES
import { ServicoService } from '../../providers/servico-service';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

@IonicPage()
@Component({
  selector: 'page-preco-servicos-list',
  templateUrl: 'preco-servicos-list.html',
})
export class PrecoServicosListPage {
  private loading = null;
  private idCategoria: number;
  private tipoServico: number;
  private grupoEntity: GrupoEntity;
  private produtoEntity: ProdutoEntity;
  private servicosPrecoList;
  private idUsuarioLogado: any;
  private isCadastroCompleto: any;
  private isCadastroEnderecoCompleto: any;
  private messageDadosCadastrais: string;
  private canLoadMore: boolean = true;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private servicoService: ServicoService,
              public platform: Platform,
              public navParams: NavParams) {
    this.idCategoria = navParams.get("idCategoria"); 
    this.tipoServico = navParams.get("tipoServico"); 
    this.grupoEntity = new GrupoEntity();
    this.produtoEntity = new ProdutoEntity();
    this.isCadastroCompleto = localStorage.getItem(Constants.IS_CADASTRO_COMPLETO);
    this.isCadastroEnderecoCompleto = localStorage.getItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO);
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
     
  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.findPrecosServicosList(null);
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  loadMore(infiniteScroll) {
    setTimeout(() => {
      this.findPrecosServicosList(infiniteScroll);
    }, 500);
  }

  findPrecosServicosList(infiniteScroll) {
    try {
      this.grupoEntity.idCategoria = this.idCategoria;
      this.grupoEntity.limiteDados = this.grupoEntity.limiteDados ? this.servicosPrecoList.length : null;

      if(this.grupoEntity.limiteDados == null) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...',
        });
        this.loading.present();
      }

      if(this.tipoServico == 1) {
        this.retornaBanhoTosa(infiniteScroll);
      }
      if(this.tipoServico == 2) {
        this.retornaConsulta(infiniteScroll);
      }
      if(this.tipoServico == 3) {
        this.retornaOutrosServicos(infiniteScroll);
      }

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  retornaBanhoTosa(infiniteScroll) {
    this.servicoService.findPrecoProdutosByBanhoETosa(this.grupoEntity)
      .then((produtosSubGruposListResult: ProdutoEntity) => {
        this.servicosPrecoList = produtosSubGruposListResult;
        if(this.grupoEntity.limiteDados == this.servicosPrecoList.length) {
          this.canLoadMore = false;
        }
        this.grupoEntity.limiteDados = this.servicosPrecoList.length;
        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        if(this.loading) {
          this.loading.dismiss();
        }
        
      }, (err) => {
        this.loading.dismiss();
        err.message = err.message ? err.message : 'Falha ao conectar ao servidor';
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

  }

  retornaConsulta(infiniteScroll) {
    this.servicoService.findPrecoProdutosByConsultasMedicacoes(this.grupoEntity)
      .then((produtosSubGruposListResult: ProdutoEntity) => {
        this.servicosPrecoList = produtosSubGruposListResult;
        if(this.grupoEntity.limiteDados == this.servicosPrecoList.length) {
          this.canLoadMore = false;
        }
        this.grupoEntity.limiteDados = this.servicosPrecoList.length;
        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        if(this.loading) {
          this.loading.dismiss();
        }
        
      }, (err) => {
        this.loading.dismiss();
        err.message = err.message ? err.message : 'Falha ao conectar ao servidor';
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  retornaOutrosServicos(infiniteScroll) {
    this.servicoService.findPrecoProdutosByOutrosServicos(this.grupoEntity)
      .then((produtosSubGruposListResult: ProdutoEntity) => {
        this.servicosPrecoList = produtosSubGruposListResult;
        if(this.grupoEntity.limiteDados == this.servicosPrecoList.length) {
          this.canLoadMore = false;
        }
        this.grupoEntity.limiteDados = this.servicosPrecoList.length;
        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        if(this.loading) {
          this.loading.dismiss();
        }
        
      }, (err) => {
        this.loading.dismiss();
        err.message = err.message ? err.message : 'Falha ao conectar ao servidor';
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  validaCadastroUsuario(idProduto) {
    if(this.idUsuarioLogado) {

      this.messageDadosCadastrais = (!this.isCadastroCompleto && !this.isCadastroEnderecoCompleto) ? 'Finalize seu cadastro de dados pessoais e endereço para ver os preços na sua cidade' : null;
      this.messageDadosCadastrais = !this.isCadastroCompleto ? 'Para continuar, complete seus dados pessoais.' : null;
      this.messageDadosCadastrais = !this.isCadastroEnderecoCompleto ? 'Complete seu endereço para ver os preços na sua cidade' : null;

      if(this.messageDadosCadastrais != null) {
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
