import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutosSubGrupoListPage } from './produtos-sub-grupo-list';

@NgModule({
  declarations: [
    ProdutosSubGrupoListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutosSubGrupoListPage),
  ],
})
export class ProdutosSubGrupoListPageModule {}
