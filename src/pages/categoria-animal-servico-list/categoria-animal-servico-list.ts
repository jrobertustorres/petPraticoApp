import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import {  PrecoServicosListPage} from '../preco-servicos-list/preco-servicos-list';

@IonicPage()
@Component({
  selector: 'page-categoria-animal-servico-list',
  templateUrl: 'categoria-animal-servico-list.html',
})
export class CategoriaAnimalServicoListPage {
  private tipoServico: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.tipoServico = navParams.get("tipoServico"); 
  }

  openServicoList(idCategoria) {
    this.navCtrl.push(PrecoServicosListPage, {
      idCategoria: idCategoria,
      tipoServico: this.tipoServico
    })
  }

}
