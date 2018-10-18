import { Component } from '@angular/core';
import { Constants } from '../../app/constants';

//PAGES
import { HomePage } from '../home/home';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FavoritosListPage } from '../favoritos-list/favoritos-list';

//SERVICES
import { CarrinhoService } from '../../providers/carrinho-service';

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

  constructor(private carrinhoService: CarrinhoService) {
    this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
  }

  ngOnInit() {
    this.carrinhoService.qtdItensCarrinhoChangeEvent.subscribe(qtdItensCarrinhoChangeEvent => {
      localStorage.setItem(Constants.QTD_ITENS_CARRINHO, qtdItensCarrinhoChangeEvent);
      this.qtdItensCarrinho = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
    });
  }

}
