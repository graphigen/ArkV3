export interface Page {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  status: "published" | "draft" | "scheduled"
  language: string
  seo_title?: string
  seo_description?: string
  template?: string
  views: number
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  status: "draft" | "published" | "archived"
  category_id?: number
  author_id: number
  views?: number
  created_at: string
  updated_at: string
  tags?: string[]
  category_name?: string
  category_slug?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  post_count?: number
}

export interface FormData {
  id: number
  name: string
  title: string
  description?: string
  slug: string
  status: "active" | "inactive"
  submit_message: string
  email_notifications: boolean
  notification_emails: string[]
  store_submissions: boolean
  created_at: string
  updated_at: string
  fields?: FormField[]
}

export interface FormField {
  id: number
  name: string
  label: string
  type: string
  required: boolean
  options?: string[]
}
