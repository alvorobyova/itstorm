import {inject, Injectable} from '@angular/core';
import {AllArticlesType, ArticleType} from "../../../types/article.type";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})

export class ArticlesService {

  constructor() { }

  private http = inject(HttpClient);

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getAllArticles(params: ActiveParamsType): Observable<AllArticlesType> {
    return this.http.get<AllArticlesType>(environment.api + 'articles', {params: params});
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

  /*getArticlesWithFilter(params): Observable<AllArticlesType> {
    return this.http.get<AllArticlesType>(environment.api + 'articles/' + params);
  }*/

}
