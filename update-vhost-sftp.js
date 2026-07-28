const { Client } = require('ssh2');
const fs = require('fs');

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
  // console.log('SFTP connecting...\n');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    // console.log('Reading original vhost.conf...');
    sftp.readFile(vhostPath, (err, buf) => {
      if (err) throw err;
      const original = buf.toString();

      if (!original.includes('nextjs_backend')) {
        const updated = original + proxyConfig;
        // console.log('Writing updated vhost.conf...');
        sftp.writeFile(vhostPath, updated, (err) => {
          if (err) throw err;
          // console.log('Done.');
          conn.end();
        });
      } else {
        // console.log('Already configured.');
        conn.end();
      }
    });
  });
}).connect(config);
