import { z } from "zod"

// Genel ID şeması
export const IdSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "ID bir sayı olmalıdır" })
    .transform(Number),
})

// Pagination şeması
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
})

// Blog Kategorisi Şemaları
export const BlogCategoryBaseSchema = z.object({
  name: z.string().min(1, "Kategori adı gereklidir."),
  slug: z
    .string()
    .min(1, "Slug gereklidir.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug geçerli değil."),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Renk geçerli bir hex kodu olmalıdır (#RRGGBB).")
    .optional()
    .default("#6B7280"),
})

export const CreateBlogCategorySchema = BlogCategoryBaseSchema
export const UpdateBlogCategorySchema = BlogCategoryBaseSchema.partial().extend({ id: z.number().int().positive() })

// Blog Yazısı Şemaları
export const BlogPostBaseSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir."),
  slug: z
    .string()
    .min(1, "Slug gereklidir.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug geçerli değil."),
  excerpt: z.string().optional(),
  content: z.string().min(1, "İçerik gereklidir."),
  featured_image: z.string().url("Geçerli bir URL olmalıdır.").optional().nullable(),
  category_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional().default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  // author_id ve reading_time sunucu tarafında atanacak
})

export const CreateBlogPostSchema = BlogPostBaseSchema
export const UpdateBlogPostSchema = BlogPostBaseSchema.partial().extend({ id: z.number().int().positive() })

// Sayfa (Page) Şemaları
export const PageBaseSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir."),
  slug: z
    .string()
    .min(1, "Slug gereklidir.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug geçerli değil."),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  template: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image: z.string().url("Geçerli bir URL olmalıdır.").optional().nullable(),
  // author_id sunucu tarafında atanacak
})
export const CreatePageSchema = PageBaseSchema
export const UpdatePageSchema = PageBaseSchema.partial().extend({ id: z.number().int().positive() })

// Kullanıcı (AdminUser) Şemaları
export const AdminUserBaseSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
  is_active: z.boolean().default(true),
})

export const CreateAdminUserSchema = AdminUserBaseSchema.extend({
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
})
export const UpdateAdminUserSchema = AdminUserBaseSchema.partial().extend({ id: z.number().int().positive() })

// SEO Ayarları Şeması
export const SEOSettingsSchema = z.object({
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  defaultOgImage: z.string().url().optional().nullable(),
  defaultTwitterImage: z.string().url().optional().nullable(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  // ... diğer SEO ayarları
  enableBreadcrumbs: z.boolean().optional(),
  enableSchemaMarkup: z.boolean().optional(),
})

// Diğer şemalar buraya eklenebilir (Menüler, Formlar, vb.)
// Örnek Form Şeması
export const FormBaseSchema = z.object({
  name: z.string().min(1, "Form adı gereklidir."),
  title: z.string().min(1, "Form başlığı gereklidir."),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  fields: z
    .array(
      z.object({
        name: z.string().min(1),
        label: z.string().min(1),
        type: z.enum(["text", "email", "textarea", "select", "checkbox", "radio"]),
        options: z.array(z.string()).optional(), // select, radio için
        required: z.boolean().optional().default(false),
      }),
    )
    .optional()
    .default([]),
  // slug sunucu tarafında oluşturulabilir veya client'tan alınabilir
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug geçerli değil.")
    .optional(),
  submit_button_text: z.string().optional().default("Gönder"),
  success_message: z.string().optional().default("Form başarıyla gönderildi."),
  redirect_url: z.string().url().optional().nullable(),
  send_email_notifications: z.boolean().optional().default(false),
  notification_email_addresses: z.array(z.string().email()).optional().default([]),
})

export const CreateFormSchema = FormBaseSchema
export const UpdateFormSchema = FormBaseSchema.partial().extend({ id: z.number().int().positive() })

// Menü Öğesi Şeması
export const MenuItemSchema = z.object({
  id: z.number().optional(), // DB'den geliyorsa
  title: z.string().min(1, "Başlık gerekli"),
  url: z.string().min(1, "URL gerekli"),
  target: z.enum(["_self", "_blank"]).optional().default("_self"),
  order: z.number().int().optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  page_id: z.number().int().positive().nullable().optional(),
  custom_url: z.string().optional(),
  icon: z.string().optional(),
  css_class: z.string().optional(),
})

// Menü Şeması
export const MenuBaseSchema = z.object({
  name: z.string().min(1, "Menü adı gerekli"),
  location: z.string().min(1, "Konum gerekli"), // Örn: 'main_navigation', 'footer_navigation'
  description: z.string().optional(),
  items: z.array(MenuItemSchema).optional().default([]),
})
export const CreateMenuSchema = MenuBaseSchema
export const UpdateMenuSchema = MenuBaseSchema.partial().extend({ id: z.number().int().positive() })

// Genel Ayarlar Şeması
export const GeneralSettingsSchema = z.object({
  site_title: z.string().min(1, "Site başlığı gereklidir."),
  tagline: z.string().optional(),
  site_url: z.string().url("Geçerli bir site URL'si girin."),
  admin_email: z.string().email("Geçerli bir yönetici e-postası girin."),
  language: z.string().optional().default("tr"),
  timezone: z.string().optional().default("Europe/Istanbul"),
  date_format: z.string().optional().default("DD/MM/YYYY"),
  time_format: z.string().optional().default("HH:mm"),
  maintenance_mode: z.boolean().optional().default(false),
  maintenance_message: z.string().optional(),
})
