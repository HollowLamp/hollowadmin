export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  avatarUrl?: string;
  nickname?: string;
  email?: string;
  website?: string;
  articleSlug?: string;
  noteId?: number;
  thoughtId?: number;
  clientIp?: string;
  userAgent?: string;
}

export interface CreateCommentDto {
  content: string;
  nickname?: string;
  email?: string;
  avatarUrl?: string;
  website?: string;
  articleSlug?: string;
  noteId?: number;
  thoughtId?: number;
}
