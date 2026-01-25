/**
 * Home page route.
 * Renders the site with home page content.
 */

import { SiteRenderer } from '@/creativeshire/renderer'
import { siteConfig } from '@/site/config'
import { homePage } from '@/site/pages/home'

export default function HomePage() {
  return <SiteRenderer site={siteConfig} page={homePage} />
}
