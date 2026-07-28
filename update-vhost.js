const { Client } = require('ssh2');

const config = {
  host: '76.13.242.12',
  port: 22,
  username: 'root',
  password: 'Tourpickkars@2026'
};

const vhostPath = '/usr/local/lsws/conf/vhosts/tourpickkars.in/vhost.conf';

const proxyConfig = `
extprocessor nextjs_backend {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 nextjs_backend
  addDefaultCharset       off
}
`;

const conn = new Client();

conn.on('ready', () => {
  // console.log('Modifying vhost config...\n');
  conn.exec(`cat ${vhostPath}`, (err, stream) => {
    if (err) throw err;
    let original = '';
    stream.on('data', (data) => original += data).on('close', () => {
      // Append proxy config if not already there
      if (!original.includes('nextjs_backend')) {
        const updated = original + proxyConfig;
        conn.exec(`echo "${updated.replace(/"/g, '\\"')}" > ${vhostPath}`, (err, stream) => {
          if (err) throw err;
          stream.on('close', () => {
            // console.log('Vhost config updated.');
            conn.end();
          });
        });
      } else {
        // console.log('Proxy already configured.');
        conn.end();
      }
    });
  });
}).connect(config);
