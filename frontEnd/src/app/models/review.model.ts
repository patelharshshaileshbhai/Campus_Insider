export interface Review {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  media?: string;
  isDeleted: boolean;
  numbersOfLikes: number;
  comments?: Comment[];
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  reviewId: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface AddReviewRequest {
  title: string;
  content: string;
  media?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
