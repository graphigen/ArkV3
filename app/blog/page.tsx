import Layout from "@/components/layout"
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Search } from "lucide-react"
import Link from "next/link"

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const category = searchParams.category
  const search = searchParams.search

  const { posts, total, totalPages } = await getAllBlogPosts({
    page,
    limit: 9,
    category,
    search,
    status: "published",
  })

  const categories = await getAllBlogCategories()

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Arkkontrol Blog</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Endüstriyel otomasyon, robotik kaynak ve lazer kesim teknolojileri hakkında uzman görüşleri ve güncel
                gelişmeler
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Blog yazılarında ara..." defaultValue={search} className="pl-10" />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge variant={!category ? "default" : "outline"}>Tümü</Badge>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/blog?category=${cat.id}`}>
                    <Badge variant={category === cat.id.toString() ? "default" : "outline"}>{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">
                      {post.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="mb-3">
                            <Badge variant="outline" className="text-xs">
                              {post.category?.name}
                            </Badge>
                          </div>

                          <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          {post.excerpt && <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(post.published_at || post.created_at).toLocaleDateString("tr-TR")}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{post.reading_time} dk</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                    >
                      <Button variant="outline">Önceki</Button>
                    </Link>
                  )}

                  <span className="px-4 py-2 text-sm text-gray-600">
                    Sayfa {page} / {totalPages}
                  </span>

                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                    >
                      <Button variant="outline">Sonraki</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Blog yazısı bulunamadı</h3>
                <p className="text-sm">Arama kriterlerinizi değiştirmeyi deneyin</p>
              </div>
              <Link href="/blog">
                <Button variant="outline">Tüm Yazıları Görüntüle</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
