/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  //   loader: 'imgix',
  //   path: 'https://res.cloudinary.com/dd1uwz8eu/image/upload/v1653276449/'
  }
}

module.exports = nextConfig
