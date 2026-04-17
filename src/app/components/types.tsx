export interface Store {
  id: number;
  seller_id: number;
  store_name: string;
  story_title: string;
  story_content: string;
  cover_image: string;
  gallery_images: string[];
  created_at: string; // puedes cambiar a Date si lo parseas
  updated_at: string; // puedes cambiar a Date si lo parseas
}
