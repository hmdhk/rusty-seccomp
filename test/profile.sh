# TODO: use docker syslog driver instead
service rsyslog start
# npm run build

node ./test/index.js
node ./test/index.js

tail -n 30 /var/log/syslog > ./tmp/index.log

service rsyslog stop

node ./test/parse-syslog.js ./tmp/index.log > tmp/index.yml