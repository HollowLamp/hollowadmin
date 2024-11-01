export interface Category {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
}
