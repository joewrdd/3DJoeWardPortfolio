/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', 'three-stdlib', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', '@react-three/postprocessing'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
