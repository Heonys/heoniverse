const os = require('os');

module.exports = {
  apps : [{
    name: "heoniverse",
    script: 'dist/apps/server/src/index.js',
    cwd: 'apps/server',
    time: true,
    watch: false,
    instances: os.cpus().length,
    exec_mode: 'fork',
    wait_ready: true,
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      "user" : "root",
      "host" : ["141.164.36.123"],
      "ref"  : "origin/master",
      "repo" : "https://github.com/Heonys/heoniverse.git",
      "path" : "/home/deploy",
      "post-deploy" : "pnpm install && pnpm build && pnpm exec start"
    }
  }
};