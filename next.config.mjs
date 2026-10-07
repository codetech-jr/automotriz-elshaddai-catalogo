/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/auxilio-vial-tuy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/delivery-charallave',
        destination: '/',
        permanent: true,
      },
      {
        source: '/googlec38f216598ebaa1b.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/chevrolet/estopera-cigue%C3%B1al-aveo',
        destination: '/chevrolet/estopera-cigue%C3%B1al-optra',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
