const tuval = require('@tuval/core/node');
const manifest = require('./src/manifest');
const appName = manifest.application.name;
const container_name = manifest.application.docker_container_name;

var shell = require('shelljs');

if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}

if (container_name) {
    shell.echo('Getting appstore info from realm docker container');
    shell.exec(`docker cp ${container_name}:/server/portal/static/appstore.json  ../../realm/appstore.json`)
}


shell.echo('App file creating...');

if (container_name) {
    tuval.appPackager('./dist/index.js', `./dist/${appName}.app`);
} else {
    tuval.appPackager('./dist/index.js', `../../realmocean/realm-runtime/src/portal/static/applications/${manifest.application.name}.app`);
}

shell.echo('App store info updating...');
const path = require('path');
const fs = require('fs');
// const a = fs.readFileSync('./appstore.json', 'utf8');
const a = fs.readFileSync('../../realmocean/realm-runtime/src/portal/static/appstore.json', 'utf8');

const appStoreInfo = JSON.parse(a);
const result = appStoreInfo.apps.find(item => item.id === appName);

if (result) {
    const index = appStoreInfo.apps.indexOf(result);
    appStoreInfo.apps[index] = require('./src/AppStoreInfo');
} else {
    appStoreInfo.apps.push(require('./src/AppStoreInfo'));
}
const aa = JSON.stringify(appStoreInfo);

// fs.writeFileSync('.//appstore.json', aa, 'utf8');
fs.writeFileSync('../../realmocean/realm-runtime/src/portal/static/appstore.json', aa, 'utf8');
shell.echo('App info done.');

if (container_name) {
    shell.echo('Exposing appstore info to realm container');
    shell.exec(`docker cp  .//appstore.json  ${container_name}:/server/portal/static/appstore.json`)
    shell.echo(`Exposing ${appName}.app to realm container appstore`);
    shell.exec(`docker cp  ./dist/${appName}.app  ${container_name}:/server/portal/static/applications/${appName}.app`)
    shell.echo(`All done.`);
}