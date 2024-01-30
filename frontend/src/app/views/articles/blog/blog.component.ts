import {Component, inject, OnInit} from '@angular/core';
import {AllArticlesType} from "../../../../types/article.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoriesType} from "../../../../types/categories.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  articles: AllArticlesType = {count: 0, pages: 0, items: []};
  categories: CategoriesType[] = [];
  categoryFiltered: CategoriesType[] = []; // категории для фильтра
  pages: number[] = [];
  filtersOpen = false;

  appliedFilters: AppliedFilterType[] = [];
  activeParams: ActiveParamsType = {categories: []};

  private articlesService = inject(ArticlesService);
  private categoriesService = inject(CategoriesService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit():void {
    this.categoriesService.getCategories()
      .subscribe((data: CategoriesType[]) => {
        if (data) {
          this.categories = data;
        }
      })

    this.getArticles();

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.categoryFiltered = [];

        if(this.activeParams && this.activeParams.categories && this.activeParams.categories.length > 0
        && this.categories && this.categories.length > 0) {
          this.activeParams.categories.forEach((categoryUrl: string): void => {
            this.categories.forEach((category: CategoriesType): void => {
              if(categoryUrl === category.url) {
                category.isOpened = true;
                this.categoryFiltered.push(category);
              }
            });
          });
        }

        this.appliedFilters = [];

        if(this.activeParams.url) {
          this.addFilter('url', this.activeParams.url);
        }
        if(this.activeParams.page) {
          this.addFilter('page', '' + this.activeParams.page);
        }
        this.activeParams.categories?.forEach((category: string) => {
          this.categoryFiltered.forEach(filterCategory => {
            if(category === filterCategory.name) {
              this.addFilter('categories[]', category);
            }
          });
        });
        this.getArticles();


        if(this.articles && this.articles.pages && this.articles.pages > 0 && !this.activeParams.page) {
          // console.log(this.articles)
          this.openPage(1);
        }
        this.processPage();
    })
  }

  getArticles(): void {
    this.articlesService.getAllArticles(this.activeParams)
      .subscribe((data: AllArticlesType) => {
        if (data) {
          this.articles = data;

          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
        }
        return this.articles;
      })
  }

  addFilter(filterName: string, filterUrlParam: string):void {
    this.appliedFilters.push({
      name: filterName,
      urlParam: filterUrlParam
    });
  }

  toggleFilter(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  filter(): void {
    let a: string[] = [];
    this.categoryFiltered.forEach(category => {
      a.push(category.url);
    });
    this.activeParams.categories = a;
    this.activeParams.page = 1;
    this.processPage();
  }

  applyFilter(param: CategoriesType, noLink: boolean = true): void {
    param.isOpened = !param.isOpened;
    this.categoryFiltered = [];
    this.categories.forEach((category: CategoriesType) => {
      if (category.isOpened) {
        this.categoryFiltered.push(category);
      }
    });
    if(noLink) {
      this.toggleFilter();
    }

    this.filter();
  }

  openPage(page: number) {
    if(this.activeParams.page !==page)
    this.activeParams.page = page;
    this.processPage();
  }

  processPage(): void {
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.processPage();
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.articles.pages) {
      this.activeParams.page++;
      this.processPage();
    }
  }

}
