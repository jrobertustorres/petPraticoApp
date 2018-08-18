import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeusPedidosListPage } from './meus-pedidos-list';

@NgModule({
  declarations: [
    MeusPedidosListPage,
  ],
  imports: [
    IonicPageModule.forChild(MeusPedidosListPage),
  ],
})
export class MeusPedidosListPageModule {}
