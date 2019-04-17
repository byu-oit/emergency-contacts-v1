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
const path = require('path')
const pkg = require('./package')
const title = require('./config').site.title

const config = {

  // the source directories
  rootDir: __dirname,
  srcDir: path.resolve(__dirname, 'client'),

  mode: 'spa',

  // page headers
  head: {
    title: title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '//cdn.byu.edu/shared-icons/latest/favicons/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cloud.typography.com/75214/6517752/css/fonts.css' },
      { rel: 'stylesheet', href: 'https://cdn.byu.edu/byu-theme-components/latest/byu-theme-components.min.css' }
    ],
    script: [
      { src: '/__wabs/script.js' },
      { src: 'https://cdn.byu.edu/byu-theme-components/latest/byu-theme-components.min.js' },
      { src: 'https://cdn.byu.edu/byu-person-lookup/latest/byu-person-lookup-bundle.min.js', type: 'module'},
      { src: 'https://cdn.byu.edu/byu-person-lookup/1.3.4/byu-personsv3-datasource-bundle.min.js', type: 'module'}
    ]
  },

  // global CSS
  css: [
    '~/assets/css/main.styl'
  ],

  // plugins to run before app initialization
  plugins: [
    { src: '~/plugins/byu', ssr: true },
    { src: '~/plugins/vuetify', ssr: true },
    { src: '~/plugins/wabs', ssr: false }
  ],

  // nuxt build configuration
  build: {

    // extend webpack configuration
    extend (config, { isDev, isClient, isServer }) {
      config.devtool = isDev ? 'eval-source-map' : 'source-map'
    },

    vendor: [
      'axios' // add axios globally
    ]
  }
}

module.exports = config
