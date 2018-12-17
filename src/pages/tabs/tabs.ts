import { Component, ViewChild } from '@angular/core';
import { Constants } from '../../app/constants';
import { Events, Tabs } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';

//PAGES
import { HomePage } from '../home/home';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FavoritosListPage } from '../favoritos-list/favoritos-list';
import { AgendaListPage } from '../agenda-list/agenda-list';

//SERVICES
import { CarrinhoService } from '../../providers/carrinho-service';
import { LoginService } from '../../providers/login-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = CarrinhoPage;
  tab3Root = ConfiguracoesPage;
  tab4Root = FavoritosListPage;
  tab5Root = AgendaListPage;
  public qtdItensCarrinho: string;

  constructor(private carrinhoService: CarrinhoService,
              public events: Events,
              private navCtrl: NavController,
              private loginService: LoginService) {

    this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
  }

  ngOnInit() {

    this.events.subscribe('atualizaBadgeCarrinhoLogoutEvent:change', (qtdItensCarrinhoChangeEvent) => {
      this.qtdItensCarrinho = qtdItensCarrinhoChangeEvent;
    });

    this.loginService.carrinhoChangeEvent.subscribe(qtdItensCarrinhoChangeEvent => {
      this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
    });

    this.carrinhoService.qtdItensCarrinhoChangeEvent.subscribe(qtdItensCarrinhoChangeEvent => {
      localStorage.setItem(Constants.QTD_ITENS_CARRINHO, qtdItensCarrinhoChangeEvent);
      this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
    });
  }

}
