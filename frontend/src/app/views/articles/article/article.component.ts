import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment.development";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, Validators} from "@angular/forms";
import {CommentsService} from "../../../shared/services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HotToastService} from "@ngneat/hot-toast";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentsResponseType, CommentType} from "../../../../types/comments-response.type";
import {Actions, CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})

export class ArticleComponent implements OnInit {
  article: ArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged: boolean = false;
  existComments: boolean = false;
  articleComments: CommentsResponseType;

  allCount: number = 0;
  offset: number = 0;
  loading: boolean = false;
  shouldShowLoadMoreComments: boolean = false;

  actions = Actions;
  // votedCommentId: string | null = null;
  // voted: boolean = false;


  private activatedRoute = inject(ActivatedRoute);
  private articlesService = inject(ArticlesService);
  private authService = inject(AuthService);
  private commentsService = inject(CommentsService);
  private hotToastService = inject(HotToastService);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);

  serverStaticPath = environment.serverStaticPath;

  commentForm = this.fb.group({
    comment: ['', [Validators.required]],
  });

  constructor() {
    this.isLogged = this.authService.getIsLoggedIn();

    this.articleComments = {
      allCount: 0,
      comments: []
    };

    this.article = {
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: '',
      comments: [],
      commentsCount: 0,
      text: ''
    }
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((data: boolean) => {
      this.isLogged = data;
    });

    this.activatedRoute.params.subscribe(params => {

      this.articlesService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.loadInitialComments();
        })

      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((relatedData: ArticleType[]) => {
          this.relatedArticles = relatedData;
        })
    })

  }

  get formattedText() {
    return this.sanitizer.bypassSecurityTrustHtml(this.article.text);
  }

  dateToString(param: string): string {
    const paramDate: Date = new Date(Date.parse(param));
    return paramDate.toLocaleDateString() + ' ' + paramDate.toLocaleTimeString().slice(0, -3);
  }

  loadInitialComments(): void {
    if (this.article && this.article.id) {
      this.commentsService.getComments(this.offset, this.article.id).subscribe((data: CommentsResponseType) => {
        this.allCount = data.allCount;
        this.articleComments = data;
        this.getUserReactions(data);

        if (this.articleComments && this.articleComments.comments) {
          this.existComments = (this.articleComments && this.articleComments.allCount >= 1);
          this.articleComments.comments = this.articleComments.comments.slice(0, 3);
          this.shouldShowLoadMoreComments = this.articleComments.comments.length < this.allCount;
        }
      });
    }
  }

  refreshComments(): void {
    if (this.article && this.article.id) {
      this.commentsService.getComments(0, this.article.id).subscribe((data: CommentsResponseType) => {
        this.articleComments = data;

        if (!this.shouldShowLoadMoreComments) {
          this.articleComments.comments = this.articleComments.comments.slice(0, this.articleComments.allCount);
        } else {
          this.articleComments.comments = this.articleComments.comments.slice(0, 3); ////показываем первые 3 коммента
        }

        this.getUserReactions(data);

      });
    }
  }

  getUserReactions(data: CommentsResponseType): void {
    if (this.article.id) {
      if(this.isLogged) {
        this.commentsService.getArticleCommentAction(this.article.id).subscribe(
          (commentActions: DefaultResponseType | CommentActionType[]) => {
            if ((commentActions as DefaultResponseType).error) {
              this.hotToastService.error((commentActions as DefaultResponseType).message);
              throw new Error((commentActions as DefaultResponseType).message);
            }
            if ((commentActions as CommentActionType[]) && (commentActions as CommentActionType[]).length > 0) {
              data.comments.forEach((comment: CommentType) => {
                (commentActions as CommentActionType[]).forEach((commentAction: CommentActionType) => {

                  if ((comment.id === commentAction.comment) && commentAction.action) {
                    if (commentAction.action === 'like') {
                      comment.action = commentAction.action;
                    } else if (commentAction.action === 'dislike') {
                      comment.action = this.actions.dislike;
                    }
                  }
                });
              });
              this.articleComments.comments = data.comments;
            }
          }
        );
      }


    }
  }

  loadMoreComments(): void {
    if (this.article && this.article.id) {
      this.loading = true;

      if (this.articleComments) {
        const newOffset = this.articleComments.comments.length; // Новое значение offset

        this.commentsService.getComments(newOffset, this.article.id)
          .subscribe((data: CommentsResponseType) => {
            this.getUserReactions(data);

            if (this.articleComments) {
              this.articleComments.comments = [...this.articleComments.comments, ...data.comments];
              this.loading = false;
              this.shouldShowLoadMoreComments = newOffset > 0 && this.articleComments.comments.length < this.allCount;
            }
          });
      }

    }
  }

  addComment(): void {
    if (this.commentForm.valid && this.commentForm.value.comment) {
      this.commentsService.addComment(this.commentForm.value.comment, this.article.id)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this.hotToastService.error(data.message);
              throw new Error(data.message);
            }
            this.hotToastService.success('Ваш комментарий успешно отправлен!');
            this.commentForm.reset();

            this.loadInitialComments();

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.hotToastService.error(errorResponse.error.message);
            } else {
              this.hotToastService.error('При отправке комментария возникла ошибка. Пожалуйста, попробуйте снова.');
            }
          }
        });
    }
  }

  toggleReaction(commentId: string, action: Actions): void {
    if (this.isLogged) {
      const comment = this.articleComments?.comments.find(comment => comment.id === commentId) as CommentType;
      this.commentsService.applyAction(commentId, action)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error !== undefined) {
              if (data.error) {
                if (action === this.actions.violate) {
                  this.hotToastService.error('Жалоба уже отправлена');
                  return;
                }
                throw new Error(data.message);
              }
            }
            if (action === this.actions.violate) {
              this.hotToastService.info('Жалоба отправлена');
            } else if (action === this.actions.like) {
              this.commentsService.getUserActionsforComment(comment.id).subscribe(
                (data: DefaultResponseType | CommentActionType[]) => {
                  if ((data as DefaultResponseType).error) {
                    this.hotToastService.error((data as DefaultResponseType).message);
                    throw new Error((data as DefaultResponseType).message);
                  }
                  if ((data as CommentActionType[]) && (data as CommentActionType[]).length > 0
                    && (data as CommentActionType[])[0].action === 'like') {
                    comment.action = this.actions.like;
                    this.hotToastService.success('Ваш голос учтён');
                  } else {
                  }
                });
              this.refreshComments();

            } else if (action === this.actions.dislike) {
              this.commentsService.getUserActionsforComment(comment.id).subscribe(
                (data: DefaultResponseType | CommentActionType[]) => {
                  if ((data as DefaultResponseType).error) {
                    this.hotToastService.error((data as DefaultResponseType).message);
                    throw new Error((data as DefaultResponseType).message);
                  }
                  if ((data as CommentActionType[]) && (data as CommentActionType[]).length > 0
                    && (data as CommentActionType[])[0].action === 'dislike') {
                    comment.action = this.actions.dislike;
                    this.hotToastService.success('Ваш голос учтён');
                  }
                });
              // this.loadInitialComments();
              this.refreshComments();

            } else {
              this.hotToastService.error(data.message);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.hotToastService.error(errorResponse.error.message);
            } else {
              this.hotToastService.error('Ошибка при запросе на сервер');
            }
          }
        });
    } else {
      this.hotToastService.error('Чтобы оценить комментарий, войдите в свой аккаунт.');
    }
  }
}
