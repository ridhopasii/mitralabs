import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mitralabs.id'

  // Fetch dynamic data for sitemap
  let posts: any[] = []
  let projects: any[] = []

  try {
    const { data: sbData } = await supabase
      .from('site_data')
      .select('json_content')
      .eq('id', 1)
      .single()

    if (sbData?.json_content) {
      posts = sbData.json_content.blog?.posts || []
      projects = sbData.json_content.portfolio?.projects || []
    }
  } catch (e) {
    console.error("Sitemap fetch failed", e)
  }

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const portfolioUrls = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    '',
    '/layanan',
    '/portfolio',
    '/blog',
    '/tentang',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  return [...staticUrls, ...blogUrls, ...portfolioUrls]
}
