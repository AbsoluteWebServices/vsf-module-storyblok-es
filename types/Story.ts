export default interface Story {
  uuid: string,
  name: string,
  slug: string,
  full_slug: string,
  content: any,
  is_startpage?: boolean,
  lang?: string,
  created_at?: Date,
  parent_id?: number,
  path?: string,
  position?: number,
  published_at?: Date,
  release_id?: any,
  default_full_slug?: string,
  group_id?: string,
  sort_by_date?: any,
  meta_data?: any,
  first_published_at?: Date,
  tag_list?: string[],
  translated_slugs?: any[],
  alternates?: any[]
}