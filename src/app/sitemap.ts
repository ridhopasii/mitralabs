import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mitralabs.id'

  // Fetch dynamic data from relational tables
  const { data: posts } = await supabase.from('BlogPost').select('slug, updated_at');
  const { data: projects } = await supabase.from('Project').select('slug, created_at');

  const blogUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const portfolioUrls = (projects || []).map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.created_at || new Date()),
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
