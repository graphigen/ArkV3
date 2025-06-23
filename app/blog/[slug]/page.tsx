"use client"

import Layout from "@/components/layout"
import { neon } from "@neondatabase/serverless"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, User, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

const sql = neon(process.env.DATABASE_URL!)

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.featured_image, bp.status, bp.published_at, 
        bp.views, bp.reading_time, bp.tags,
        bp.created_at, bp.updated_at, bp.meta_title, bp.meta_description,
        bp.author_id, bp.category_id,
        bc.name as category_name, bc.slug as category_slug,
        au.username as author_name, au.first_name, au.last_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN admin_users au ON bp.author_id = au.id
      WHERE bp.slug = ${slug} AND bp.status = 'published'
    `

    if (result[0]) {
      // Increment view count
      await sql`
        UPDATE blog_posts 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${result[0].id}
      `
    }

    return result[0] || null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

async function getRelatedPosts(postId: number, categoryId?: number) {
  try {
    if (!categoryId) return []

    const result = await sql`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
        bp.published_at, bp.created_at, bp.reading_time
      FROM blog_posts bp
      WHERE bp.category_id = ${categoryId} 
        AND bp.id != ${postId} 
        AND bp.status = 'published'
      ORDER BY bp.published_at DESC
      LIMIT 3
    `

    return result
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.category_id)

  // Format author name
  const authorName =
    post.first_name && post.last_name ? `${post.first_name} ${post.last_name}` : post.author_name || "Arkkontrol"

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-orange-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Blog'a Dön
            </Link>

            {post.category_name && (
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                {post.category_name}
              </Badge>
            )}

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-orange-100 mb-6 leading-relaxed max-w-3xl">{post.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-6 text-sm text-orange-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{authorName}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.reading_time || 5} dk okuma</span>
              </div>

              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{post.views || 0} görüntülenme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content" />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Etiketler:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{authorName}</h3>
                  <p className="text-gray-600 text-sm">Arkkontrol Ekibi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: any) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      {relatedPost.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.featured_image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(relatedPost.published_at || relatedPost.created_at).toLocaleDateString("tr-TR")}
                          </span>
                          {relatedPost.reading_time && (
                            <>
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{relatedPost.reading_time} dk</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Endüstriyel Otomasyon Çözümleriniz için</h3>
            <p className="text-orange-100 mb-6">
              Robotik kaynak, lazer kesim ve otomasyon sistemleri hakkında daha fazla bilgi almak için bizimle iletişime
              geçin.
            </p>
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/iletisim">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
          border-bottom: 2px solid #f97316;
          padding-bottom: 0.5rem;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }
        
        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #4b5563;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .blog-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .blog-content em {
          font-style: italic;
        }
        
        .blog-content a {
          color: #f97316;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #ea580c;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blog-content blockquote {
          border-left: 4px solid #f97316;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #fef7f0;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </Layout>
  )
}
