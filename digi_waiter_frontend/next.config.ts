import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*", // frontend calls /api/...
//         destination: "http://localhost:6001/api/:path*", // backend target
//       },
//     ];
//   },
// };

// export default nextConfig;
