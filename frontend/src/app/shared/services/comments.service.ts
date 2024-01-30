import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {CommentsResponseType} from "../../../types/comments-response.type";
import {Actions, CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', { text, article });
  }

  getComments(offset: number, article: string): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments/', { params: { offset, article } });
  }

  applyAction(commentId: string, action: Actions): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/${commentId}/apply-action`, { action });
  }


  // Метод для получения действий пользователя над определенным комментарием
  getUserActionsforComment(commentId: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(`${environment.api}comments/${commentId}/actions`);
  }

  getArticleCommentAction(articleId: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(
      environment.api + 'comments/article-comment-actions', {
        params: {articleId: articleId}});
  }
}
