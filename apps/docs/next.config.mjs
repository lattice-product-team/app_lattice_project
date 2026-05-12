import nextra from 'nextra'

const withNextra = nextra({
  // Nextra options
})

export default withNextra({
  output: 'export',
  basePath: '/app_lattice_project',
  images: {
    unoptimized: true
  }
})
