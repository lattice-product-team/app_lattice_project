import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import themeConfig from '../../theme.config'

export const metadata = {
  title: {
    template: '%s – App Lattice',
    default: 'App Lattice Documentation'
  }
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  return (
    <html lang="es" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={<Navbar logo={themeConfig.logo} />}
          footer={<Footer>{themeConfig.footer.text}</Footer>}
          pageMap={pageMap}
          themeConfig={themeConfig}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
