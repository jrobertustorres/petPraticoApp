import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
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

//PAGES
import { HomePage } from '../pages/home/home';
import { GruposListPage } from '../pages/grupos-list/grupos-list';
import { SubGruposListPage } from '../pages/sub-grupos-list/sub-grupos-list';
import { ProdutosSubGrupoListPage } from '../pages/produtos-sub-grupo-list/produtos-sub-grupo-list';
import { LocationPage } from '../pages/location/location';
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

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    GruposListPage,
    SubGruposListPage,
    ProdutosSubGrupoListPage,
    LocationPage,
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
    AboutPage,
    ContactPage,
    HomePage,
    GruposListPage,
    SubGruposListPage,
    ProdutosSubGrupoListPage,
    LocationPage,
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
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
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
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
