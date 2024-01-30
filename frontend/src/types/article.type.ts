export type AllArticlesType = {
  count: number,
  pages: number,
  items: Array<ArticleType>;
}

export type ArticleType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
  comments: Array<ArticleCommentType>,
  commentsCount: number,
  text: string
}

export type ArticleCommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: ArticleUserType
}

type ArticleUserType = {
  id: string,
  name: string
}

/*export type CategoryWithArticlesType = {
  id: string,
  name: string,
  url: string,
  articles: ArticleType[];
}

export type ArticlesWithFilterType = {
  id: string,
  name: string,
  url: string,
  pages: number,
  articles: ArticleType[];
  categoriesUrl?: string[]
}*/
