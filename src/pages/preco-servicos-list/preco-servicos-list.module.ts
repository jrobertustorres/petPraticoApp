import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrecoServicosListPage } from './preco-servicos-list';

@NgModule({
  declarations: [
    PrecoServicosListPage,
  ],
  imports: [
    IonicPageModule.forChild(PrecoServicosListPage),
  ],
})
export class PrecoServicosListPageModule {}
