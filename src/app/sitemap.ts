import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const revalidate = 60; // Regenerate sitemap every 60 seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mitralabs.web.id'

  try {
    // Fetch dynamic data from relational tables
    const { data: posts } = await supabase.from('BlogPost').select('slug, updated_at');
    const { data: projects } = await supabase.from('Project').select('slug, created_at');
    const { data: clientProjects } = await supabase.from('ClientProject').select('project_name, created_at').eq('is_public', true);

    const blogUrls = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const manualPortfolioUrls = (projects || []).map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date(project.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    const clientPortfolioUrls = (clientProjects || []).map((project) => {
      const slug = project.project_name.toLowerCase().replace(/\s+/g, '-');
      return {
        url: `${baseUrl}/portfolio/${slug}`,
        lastModified: new Date(project.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }
    })

    const portfolioUrls = [...manualPortfolioUrls, ...clientPortfolioUrls]

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
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
