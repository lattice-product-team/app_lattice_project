import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html lang="es" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
