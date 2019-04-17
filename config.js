/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict'
const pkg = require('./package')

const config = {

  // the server host
  host: process.env.HOST || '0.0.0.0',

  // the port to run the server on
  port: process.env.PORT || 8460,

  // whether in production mode or not
  production: process.env.NODE_ENV === 'production',

  // site default settings
  site: {

    // default site navigation links
    navigationLinks: [
        {href: '/', title: 'Emergency-Contacts'},
        {href: '/logs', title: 'Logs'}
    ],

    // default site title (in title bar)
    pageTitle: { pre: '', main: 'Emergency Contacts', post: '' },

    // how many milliseconds to wait before performing an automatic search - set to zero (0) to disable
    searchDebounce: 350,

    // default search functionality - set to null to disable
    searchHandler: function (value, isAutoSearch) {
      console.log('Searched for "' + value + '"' + (isAutoSearch ? ' using auto search' : ''))
    },

    // default browser page title (modification requires rebuild)
    title: 'BYU | Emergency Contacts'
  },

  // the WABS configuration: https://www.npmjs.com/package/byu-wabs#create-a-wabs-configuration
  wabs: {
    appName: pkg.name,
    configFile: '~/wabs-config/default.config.json'
  }
}

module.exports = config
