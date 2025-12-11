module.exports = {
  apps: [
    {
      name: 'condominio-api',
      script: 'server.js',
      cwd: '/opt/condominio_facil/condominio_facil_site',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: '/opt/condominio_facil/condominio_facil_site/logs/error.log',
      out_file: '/opt/condominio_facil/condominio_facil_site/logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
