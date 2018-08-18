import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutosPorLojaListPage } from './produtos-por-loja-list';

@NgModule({
  declarations: [
    ProdutosPorLojaListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutosPorLojaListPage),
  ],
})
export class ProdutosPorLojaListPageModule {}
