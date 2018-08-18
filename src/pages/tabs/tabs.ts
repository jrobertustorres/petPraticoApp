import { Component } from '@angular/core';
import { Constants } from '../../app/constants';

//PAGES
import { HomePage } from '../home/home';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FavoritosListPage } from '../favoritos-list/favoritos-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = CarrinhoPage;
  tab3Root = ConfiguracoesPage;
  tab4Root = FavoritosListPage;
  public qtdItensCarrinho: string;

  constructor() {
    this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
    console.log('bbbbbbbbbbbbbbbbbbbbbbb '+this.qtdItensCarrinho);
  }

  // ionViewDidEnter() {
  //   let tab:Tab = this.tabRef.getSelected();//Returns the currently selected tab
  //  }
}
