import Layout from "@/components/layout"
import { getBlogPostBySlug, getRelatedPosts, incrementPostViews } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, User, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Increment view count
  await incrementPostViews(post.id)

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.category_id)

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-500">
                Anasayfa
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-orange-500">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="outline" className="mb-4">
                {post.category?.name}
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author?.name || "Arkkontrol"}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString("tr-TR")}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.reading_time} dk okuma</span>
              </div>

              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{post.views} görüntülenme</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 lg:h-96 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Etiketler:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
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
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                        )}
                        <div className="flex items-center mt-4 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(relatedPost.published_at || relatedPost.created_at).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  )
}
