module.exports = {
  apps: [
    {
      name: "arkkontrol-website",
      script: "npm",
      args: "start",
      cwd: "/var/www/arkkontrol",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Neon Database Configuration
        DATABASE_URL:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
        DATABASE_URL_UNPOOLED:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech/neondb?sslmode=require",
        POSTGRES_URL:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
        POSTGRES_URL_NON_POOLING:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech/neondb?sslmode=require",
        POSTGRES_PRISMA_URL:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
        // Database Parameters
        PGHOST: "ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech",
        PGHOST_UNPOOLED: "ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech",
        PGUSER: "neondb_owner",
        PGDATABASE: "neondb",
        PGPASSWORD: "npg_htj6CH2SYioa",
        // Stack Auth
        NEXT_PUBLIC_STACK_PROJECT_ID: "14f06dcf-cb13-41d2-ad54-2065ae1a00ce",
        NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: "pck_e9hahemepscmxst4dka109nj0t7hegmcgbbxbs1mr6va8",
        STACK_SECRET_SERVER_KEY: "ssk_vbabvvhdjx490z04m0pqhc6zf5pn415qygvbr2br5hewr",
        // Site Configuration
        NEXT_PUBLIC_SITE_URL: "https://yourdomain.com",
        ADMIN_SECRET_KEY: "your-super-secret-admin-key-here",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Same database config for production
        DATABASE_URL:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
        DATABASE_URL_UNPOOLED:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech/neondb?sslmode=require",
        POSTGRES_URL:
          "postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
      },
      error_file: "/var/log/pm2/arkkontrol-error.log",
      out_file: "/var/log/pm2/arkkontrol-out.log",
      log_file: "/var/log/pm2/arkkontrol-combined.log",
      time: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "1G",
      node_args: "--max_old_space_size=2048",
      watch: false,
      ignore_watch: ["node_modules", ".next", "logs", "*.log"],
      merge_logs: true,
      autorestart: true,
      restart_delay: 4000,
    },
  ],
}
