const os = require('os');

module.exports = {
  apps : [{
    name: "heoniverse",
    script: 'apps/server/dist/apps/server/src/index.js',
    time: true,
    watch: false,
    instances: os.cpus().length,
    exec_mode: 'fork',
    wait_ready: true,
    env_production: {
      NODE_ENV: 'production',
      GAME_SERVER_PORT: 2567, 
    }
  }],
  deploy : {
    production : {
      "user" : "root",
      "host" : ["158.247.220.204"],
      "ref"  : "origin/master",
      "repo" : "https://github.com/Heonys/heoniverse.git",
      "path" : "/home/deploy",
      "post-deploy" : "pnpm install && pnpm build:server && pnpm start:server"
    }
  }
};