import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ArticleComponent} from "./article/article.component";
import {BlogComponent} from "./blog/blog.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ArticleComponent,
    BlogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ArticlesRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArticlesModule { }
