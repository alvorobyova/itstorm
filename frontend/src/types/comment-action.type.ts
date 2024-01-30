export type CommentActionType = {
  comment: string,
  action: Actions
}

export enum Actions {
  like = 'like',
  dislike = 'dislike',
  violate = 'violate'
}
