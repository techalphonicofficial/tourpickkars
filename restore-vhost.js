const { Client } = require('ssh2');

const config = {
  host: '76.13.242.12',
  port: 22,
  username: 'root',
  password: 'Tourpickkars@2026'
};

const vhostPath = '/usr/local/lsws/conf/vhosts/tourpickkars.in/vhost.conf';

const restoredConfig = `docRoot                   $VH_ROOT/public_html
vhDomain                  $VH_NAME
vhAliases                 www.$VH_NAME
adminEmails               developmenttechalphonic@gmail.com
enableGzip                1
enableIpGeo               1

index  {
  useServer               0
  indexFiles              index.php, index.html
}

errorlog $VH_ROOT/logs/$VH_NAME.error_log {
  useServer               0
  logLevel                WARN
  rollingSize             10M
}

accesslog $VH_ROOT/logs/$VH_NAME.access_log {
  useServer               0
  logFormat               "%h %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" \\"%{User-Agent}i\\""
  logHeaders              5
  rollingSize             10M
  keepDays                10  
  compressArchive         1
}

scripthandler  {
  add                     lsapi:tourp2790 php
}

extprocessor tourp2790 {
  type                    lsapi
  address                 UDS://tmp/lshttpd/tourp2790.sock
  maxConns                10
  env                     LSAPI_CHILDREN=10
  initTimeout             600
  retryTimeout            0
  persistConn             1
  pcKeepAliveTimeout      1
  respBuffer              0
  autoStart               1
  path                    /usr/local/lsws/lsphp84/bin/lsphp
  extUser                 tourp2790
  extGroup                tourp2790
  memSoftLimit            1024M
  memHardLimit            1024M
  procSoftLimit           400
  procHardLimit           500
}

phpIniOverride  {

}

module cache {
 storagePath /usr/local/lsws/cachedata/$VH_NAME
}

rewrite  {
 enable                  1
  autoLoadHtaccess        1
}

context /.well-known/acme-challenge {
  location                /usr/local/lsws/Example/html/.well-known/acme-challenge
  allowBrowse             1

  rewrite  {
     enable                  0
  }
  addDefaultCharset       off

  phpIniOverride  {

  }
}


vhssl  {
  keyFile                 /etc/letsencrypt/live/tourpickkars.in/privkey.pem
  certFile                /etc/letsencrypt/live/tourpickkars.in/fullchain.pem
  certChain               1
  sslProtocol             24
  enableECDHE             1
  renegProtection         1
  sslSessionCache         1
  enableSpdy              15
  enableStapling          1
  ocspRespMaxAge          86400
}

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
  // console.log('Restoring and fixing vhost config via SFTP...\n');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.writeFile(vhostPath, restoredConfig, (err) => {
      if (err) throw err;
      // console.log('Vhost restored successfully.');
      conn.end();
    });
  });
}).connect(config);
