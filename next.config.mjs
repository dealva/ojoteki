/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://d2n7cdqdrlte95.cloudfront.net https://d2f3dnusg0rbp7.cloudfront.net https://api.sandbox.midtrans.com https://pay.google.com https://js-agent.newrelic.com https://bam.nr-data.net https://app.sandbox.midtrans.com https://www.google.com https://www.gstatic.com;
  script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://d2n7cdqdrlte95.cloudfront.net https://d2f3dnusg0rbp7.cloudfront.net https://api.sandbox.midtrans.com https://pay.google.com https://js-agent.newrelic.com https://bam.nr-data.net https://app.sandbox.midtrans.com https://www.google.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://res.cloudinary.com;
  connect-src 'self' https://api.sandbox.midtrans.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://app.sandbox.midtrans.com https://www.google.com;
`.replace(/\n/g, ' ').trim();

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
