import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicosAdicionaisListPage } from './servicos-adicionais-list';

@NgModule({
  declarations: [
    ServicosAdicionaisListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicosAdicionaisListPage),
  ],
})
export class ServicosAdicionaisListPageModule {}
