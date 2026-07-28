module.exports = {
  apps: [
    {
      name: "tourpickkars",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
