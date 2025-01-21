/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'static.toiimg.com',
            'i.imgur.com',
            'images.pexels.com',
            'images.unsplash.com',
            'img.freepik.com',
            'photos.google.com',
            'cloudinary.com',
            'res.cloudinary.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

module.exports = nextConfig
