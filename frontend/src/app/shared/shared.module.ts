import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {ReactiveFormsModule} from "@angular/forms";
import {InputMaskModule} from "@ngneat/input-mask";
import {ModalComponent} from './components/modal/modal.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputMaskModule,
    RouterModule
  ],
  exports: [
    ArticleCardComponent,
    ModalComponent
  ]
})
export class SharedModule {
}
