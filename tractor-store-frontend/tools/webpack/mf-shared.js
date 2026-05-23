/**
 * Shared Module Federation config — misma versión explícita en shell y remotes.
 */
const ngVersion = require('@angular/core/package.json').version;
const rxjsVersion = require('rxjs/package.json').version;

function share(pkg, version, eager = false) {
  return {
    singleton: true,
    strictVersion: false,
    requiredVersion: version,
    ...(eager ? { eager: true } : {}),
  };
}

/** Host (shell) */
function mfSharedHost() {
  return {
    '@angular/core': share('@angular/core', ngVersion, true),
    '@angular/common': share('@angular/common', ngVersion, true),
    '@angular/common/http': share('@angular/common/http', ngVersion, true),
    '@angular/router': share('@angular/router', ngVersion, true),
    rxjs: share('rxjs', rxjsVersion, true),
  };
}

/** Remotes */
function mfSharedRemote() {
  return {
    '@angular/core': share('@angular/core', ngVersion),
    '@angular/common': share('@angular/common', ngVersion),
    '@angular/common/http': share('@angular/common/http', ngVersion),
    '@angular/router': share('@angular/router', ngVersion),
    rxjs: share('rxjs', rxjsVersion),
  };
}

module.exports = { mfSharedHost, mfSharedRemote, ngVersion, rxjsVersion };
