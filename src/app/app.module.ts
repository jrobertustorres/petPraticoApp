import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Facebook } from '@ionic-native/facebook';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Calendar } from '@ionic-native/calendar';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//ENTITYS
import { GrupoEntity } from '../model/grupo-entity';
import { SubGrupoEntity } from '../model/sub-grupo-entity';
import { ProdutoEntity } from '../model/produto-entity';
import { UsuarioEntity } from '../model/usuario-entity';
import { UsuarioDetalheEntity } from '../model/usuario-detalhe-entity';
import { PublicidadePropagandaEntity } from '../model/publicidade-propaganda-entity';
import { ProdutoFornecedorEntity } from '../model/produto-fornecedor-entity';
import { ItemPedidoEntity } from '../model/item-pedido-entity';
import { FavoritoEntity } from '../model/favorito-entity';
import { MeusItemPedidoEntity } from '../model/meus-item-pedido-entity';
import { MeusPedidoEntity } from '../model/meus-pedido-entity';
import { PedidoEntity } from '../model/pedido-entity';
import { EstadoEntity } from './../model/estado-entity';
import { CidadeEntity } from './../model/cidade-entity';
import { TipoPagamentoFornecedorEntity } from '../model/tipo-pagamento-fornecedor-entity';
import { IndicacaoUsuarioEntity } from '../model/indicacao-usuario-entity';
import { EnderecoEntity } from '../model/endereco-entity';

//SERVICES
import { GrupoService } from '../providers/grupo-service';
import { UsuarioService } from '../providers/usuario-service';
import { LoginService } from '../providers/login-service';
import { HomeService } from '../providers/home-service';
import { ProdutoService } from '../providers/produto-service';
import { CarrinhoService } from '../providers/carrinho-service';
import { FavoritosService } from './../providers/favoritos-service';
import { PedidoService } from '../providers/pedido-service';
import { EstadosService } from './../providers/estados-service';
import { CidadesService } from '../providers/cidades-service';
import { PagamentoService } from '../providers/pagamento-service';
import { IndicacaoService } from '../providers/indicacao-service';

//PAGES
import { HomePage } from '../pages/home/home';
import { GruposListPage } from '../pages/grupos-list/grupos-list';
import { SubGruposListPage } from '../pages/sub-grupos-list/sub-grupos-list';
import { ProdutosSubGrupoListPage } from '../pages/produtos-sub-grupo-list/produtos-sub-grupo-list';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { ModalTermosPage } from '../pages/modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../pages/modal-politica-privacidade/modal-politica-privacidade'
import { MinhaSenhaPage } from '../pages/minha-senha/minha-senha';
import { LoginPage } from '../pages/login/login';
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { MeusDadosPage } from '../pages/meus-dados/meus-dados';
import { ProdutosPorLojaListPage } from '../pages/produtos-por-loja-list/produtos-por-loja-list';
import { CarrinhoPage } from './../pages/carrinho/carrinho';
import { DetalheProdutoPage } from './../pages/detalhe-produto/detalhe-produto';
import { FavoritosListPage } from './../pages/favoritos-list/favoritos-list';
import { ModalBuscaProdutosPage } from '../pages/modal-busca-produtos/modal-busca-produtos';
import { MeusPedidosListPage } from './../pages/meus-pedidos-list/meus-pedidos-list';
import { PedidoDetalhePage } from './../pages/pedido-detalhe/pedido-detalhe';
import { MeuEnderecoPage } from './../pages/meu-endereco/meu-endereco';
import { PagamentoPage } from '../pages/pagamento/pagamento';
import { ModalTipoPagamentoPage } from '../pages/modal-tipo-pagamento/modal-tipo-pagamento';
import { ModalSobrePage } from '../pages/modal-sobre/modal-sobre';
import { ModalMeusPontosPage } from '../pages/modal-meus-pontos/modal-meus-pontos';
import { ModalCidadesPage } from '../pages/modal-cidades/modal-cidades';
import { AgendaPage } from '../pages/agenda/agenda';
import { ModalIndiqueEGanhePage } from '../pages/modal-indique-e-ganhe/modal-indique-e-ganhe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GruposListPage,
    SubGruposListPage,
    ProdutosSubGrupoListPage,
    ConfiguracoesPage,
    ModalTermosPage,
    ModalPoliticaPrivacidadePage,
    MinhaSenhaPage,
    LoginPage,
    RecuperarSenhaPage,
    MeusDadosPage,
    ProdutosPorLojaListPage,
    CarrinhoPage,
    DetalheProdutoPage,
    FavoritosListPage,
    ModalBuscaProdutosPage,
    MeusPedidosListPage,
    PedidoDetalhePage,
    MeuEnderecoPage,
    PagamentoPage,
    ModalTipoPagamentoPage,
    ModalSobrePage,
    ModalMeusPontosPage,
    ModalCidadesPage,
    AgendaPage,
    ModalIndiqueEGanhePage,
    TabsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicImageViewerModule,
    // IonicModule.forRoot(MyApp)
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    },
  ),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GruposListPage,
    SubGruposListPage,
    ProdutosSubGrupoListPage,
    ConfiguracoesPage,
    ModalTermosPage,
    ModalPoliticaPrivacidadePage,
    MinhaSenhaPage,
    LoginPage,
    RecuperarSenhaPage,
    MeusDadosPage,
    ProdutosPorLojaListPage,
    CarrinhoPage,
    DetalheProdutoPage,
    FavoritosListPage,
    ModalBuscaProdutosPage,
    MeusPedidosListPage,
    PedidoDetalhePage,
    MeuEnderecoPage,
    PagamentoPage,
    ModalTipoPagamentoPage,
    ModalSobrePage,
    ModalMeusPontosPage,
    ModalCidadesPage,
    AgendaPage,
    ModalIndiqueEGanhePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    AppVersion,
    Network,
    Device,
    EmailComposer,
    SocialSharing,
    Push,
    Calendar,
    GrupoService,
    UsuarioService,
    LoginService,
    HomeService,
    ProdutoService,
    CarrinhoService,
    FavoritosService,
    PedidoService,
    EstadosService,
    CidadesService,
    PagamentoService,
    IndicacaoService,
    GrupoEntity,
    SubGrupoEntity,
    ProdutoEntity,
    UsuarioEntity,
    UsuarioDetalheEntity,
    PublicidadePropagandaEntity,
    ProdutoFornecedorEntity,
    ItemPedidoEntity,
    FavoritoEntity,
    MeusItemPedidoEntity,
    MeusPedidoEntity,
    PedidoEntity,
    EstadoEntity,
    CidadeEntity,
    TipoPagamentoFornecedorEntity,
    IndicacaoUsuarioEntity,
    EnderecoEntity,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
