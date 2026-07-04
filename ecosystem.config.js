module.exports = {
  apps : [{
    name: "heoniverse",
    script: 'apps/server/dist/index.js',
    time: true,
    watch: false,
    // Colyseus는 in-memory presence/driver를 사용하므로 단일 인스턴스로 실행한다.
    // 다중 인스턴스는 @colyseus/redis-presence + redis-driver 도입 후에만 가능.
    instances: 1,
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
      // VPS 이전 시마다 IP를 수정해야 함 — DNS 이름 사용을 권장
      "host" : ["158.247.220.204"],
      "ref"  : "origin/master",
      "repo" : "https://github.com/Heonys/heoniverse.git",
      "path" : "/home/deploy",
      "post-deploy" : "pnpm install && pnpm build:server && pm2 startOrReload ecosystem.config.js --env production"
    }
  }
};
