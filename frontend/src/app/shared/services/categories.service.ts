import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {CategoriesType} from "../../../types/categories.type";
// import {AllArticlesType, CategoryWithArticlesType} from "../../../types/article.type";
import {ArticlesService} from "./articles.service";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }

  private http = inject(HttpClient);
  // private articleService = inject(ArticlesService);

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories')
  }

  /*getCategoryWithArticles(): Observable<CategoryWithArticlesType[]> {
    return forkJoin([
      this.getCategories(),
      // this.articleService.getAllArticles()
    ]).pipe(
      map(([categories, allArticles]: [CategoriesType[], AllArticlesType]) => {
        const grouped: CategoryWithArticlesType[] = [];

        categories.forEach(category => {
          const categoryArticles = allArticles.items.filter(article => article.category === category.name);
          grouped.push({
            id: category.id,
            name: category.name,
            url: category.url,
            articles: categoryArticles
          });
        });

        return grouped;
      })
    );
  }*/

  /*getCategoryWithArticles(): Observable<{ [key: string]: ArticleType[] }> {
   return this.http.get<AllArticlesType>(environment.api + 'articles')
     .pipe(
       map((result: AllArticlesType) => {
         const allArticles = result.items;

         const grouped: { [key: string]: ArticleType[] } = {};

         allArticles.forEach(article => {
           if (grouped[article.category]) {
             grouped[article.category].push(article);
           } else {
             grouped[article.category] = [article];
           }
         });

         return grouped;
       })
     )
 }*/
}

/*
.pipe(
  map(categories => categories.map(category => category.name))
);*/
