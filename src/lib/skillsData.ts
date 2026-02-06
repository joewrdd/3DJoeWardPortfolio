import { SkillData } from '@/types';

export const SKILLS: SkillData[] = [
  // Frontend
  { name: 'React', icon: '/assets/skills/react.png', category: 'frontend', level: 0.9 },
  { name: 'Next.js', icon: '/assets/skills/next.png', category: 'frontend', level: 0.85 },
  { name: 'TypeScript', icon: '/assets/skills/ts.png', category: 'frontend', level: 0.9 },
  { name: 'JavaScript', icon: '/assets/skills/js.png', category: 'frontend', level: 0.95 },
  { name: 'HTML', icon: '/assets/skills/html.png', category: 'frontend', level: 0.95 },
  { name: 'CSS', icon: '/assets/skills/css.png', category: 'frontend', level: 0.9 },
  { name: 'Tailwind', icon: '/assets/skills/tailwind.png', category: 'frontend', level: 0.9 },
  { name: 'MUI', icon: '/assets/skills/mui.png', category: 'frontend', level: 0.75 },
  { name: 'Redux', icon: '/assets/skills/redux.png', category: 'frontend', level: 0.8 },
  { name: 'React Query', icon: '/assets/skills/reactquery.png', category: 'frontend', level: 0.8 },
  { name: 'Framer', icon: '/assets/skills/framer.png', category: 'frontend', level: 0.7 },

  // Mobile
  { name: 'Flutter', icon: '/assets/skills/flutter.png', category: 'mobile', level: 0.95 },
  { name: 'Dart', icon: '/assets/skills/dart.png', category: 'mobile', level: 0.95 },
  { name: 'GetX', icon: '/assets/skills/getx.png', category: 'mobile', level: 0.9 },
  { name: 'Flutter Flame', icon: '/assets/skills/flutterflame.png', category: 'mobile', level: 0.7 },
  { name: 'Android', icon: '/assets/skills/android.png', category: 'mobile', level: 0.7 },
  { name: 'iOS', icon: '/assets/skills/apple.png', category: 'mobile', level: 0.65 },
  { name: 'Hive', icon: '/assets/skills/hive.png', category: 'mobile', level: 0.85 },

  // Backend
  { name: 'Node.js', icon: '/assets/skills/nodejs.png', category: 'backend', level: 0.85 },
  { name: 'Express', icon: '/assets/skills/express.png', category: 'backend', level: 0.8 },
  { name: 'NestJS', icon: '/assets/skills/nestjs.png', category: 'backend', level: 0.75 },
  { name: 'Python', icon: '/assets/skills/python.png', category: 'backend', level: 0.8 },
  { name: 'FastAPI', icon: '/assets/skills/fastapi.png', category: 'backend', level: 0.75 },
  { name: 'Django', icon: '/assets/skills/django.png', category: 'backend', level: 0.65 },
  { name: 'Java', icon: '/assets/skills/java.png', category: 'backend', level: 0.6 },
  { name: 'C++', icon: '/assets/skills/cpp.png', category: 'backend', level: 0.5 },
  { name: 'GraphQL', icon: '/assets/skills/graphql.png', category: 'backend', level: 0.7 },
  { name: 'Prisma', icon: '/assets/skills/prisma.webp', category: 'backend', level: 0.75 },

  // Database
  { name: 'Firebase', icon: '/assets/skills/firebase.png', category: 'database', level: 0.9 },
  { name: 'Supabase', icon: '/assets/skills/supabase.png', category: 'database', level: 0.8 },
  { name: 'MongoDB', icon: '/assets/skills/mongodb.png', category: 'database', level: 0.8 },
  { name: 'PostgreSQL', icon: '/assets/skills/postger.png', category: 'database', level: 0.75 },
  { name: 'MySQL', icon: '/assets/skills/mysql.png', category: 'database', level: 0.7 },
  { name: 'Redis', icon: '/assets/skills/redis.png', category: 'database', level: 0.6 },

  // DevOps & Tools
  { name: 'Docker', icon: '/assets/skills/docker.webp', category: 'devops', level: 0.7 },
  { name: 'GitHub', icon: '/assets/skills/github.png', category: 'devops', level: 0.9 },
  { name: 'Vercel', icon: '/assets/skills/vercel.png', category: 'devops', level: 0.85 },
  { name: 'Figma', icon: '/assets/skills/figma.png', category: 'devops', level: 0.75 },
  { name: 'Canva', icon: '/assets/skills/canva.png', category: 'devops', level: 0.8 },
  { name: 'Google Cloud', icon: '/assets/skills/google.png', category: 'devops', level: 0.65 },
  { name: 'Dodo Payments', icon: '/assets/skills/dodopayments.png', category: 'devops', level: 0.6 },
  { name: 'CoinGecko', icon: '/assets/skills/coingecko.png', category: 'devops', level: 0.6 },

  // AI & ML
  { name: 'Gemini', icon: '/assets/skills/gemini.png', category: 'ai', level: 0.85 },
  { name: 'Gemma', icon: '/assets/skills/gemma.png', category: 'ai', level: 0.7 },
  { name: 'DeepSeek', icon: '/assets/skills/deepseek.png', category: 'ai', level: 0.65 },
  { name: 'PyTorch', icon: '/assets/skills/pytorch.png', category: 'ai', level: 0.55 },
];

export const SKILL_CATEGORIES = {
  frontend: { label: 'Frontend', color: '#00d4ff' },
  mobile: { label: 'Mobile', color: '#ff6f61' },
  backend: { label: 'Backend', color: '#e01e5a' },
  database: { label: 'Database', color: '#ffd1a9' },
  devops: { label: 'DevOps & Tools', color: '#7a1044' },
  ai: { label: 'AI & ML', color: '#ff1493' },
} as const;
