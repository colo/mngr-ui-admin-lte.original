import Vue from 'vue'
import Vuex from 'vuex'

import hosts from './hosts'
import app from './app'
import stats from './stats'
// import stats_tabular from './stats_tabular'

Vue.use(Vuex)
//
// import localforage from 'localforage'
import VuexPersistence from 'vuex-persist'
//
// localforage.config({
//     // driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
//     name        : 'myApp',
//     version     : 1.0,
//     // size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
//     storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
//     description : 'some description'
// })

// const vuexSession = new VuexPersistence ({
//   storage: window.sessionStorage,
//   reducer: state => ({hosts: state.hosts}), //only save app module
// })

const vuexLocal = new VuexPersistence ({
  storage: window.localStorage,
  // reducer: state => ({app: state.app, hosts : state.hosts, stats: state.stats}), //only save app module
  // modules: ['app', 'hosts', 'stats']
  modules: ['app', 'hosts']
})

const store = new Vuex.Store({
  // plugins: [(new VuexPersistence({
  //   // strictMode: false,
  //   // asyncStorage: true,
  //   storage: window.localStorage,
  // })).plugin],
  // strict: false,
  // strict: process.env.NODE_ENV !== 'production'
  plugins: [vuexLocal.plugin],
  modules: {
    hosts,
    app,
    stats,
    // stats_tabular
    // stats: {
    //   namespaced: true,
    //   state: function() {
    //     return {}
    //   },
    //   getters: {},
    //   actions: {},
    //   mutations: {}
    // }
  }
})

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./hosts'], () => {
    const newHosts = require('./hosts').default
    store.hotUpdate({ modules: { hosts: newHosts } })
  })
  module.hot.accept(['./app'], () => {
    const newApp = require('./app').default
    store.hotUpdate({ modules: { app: newApp } })
  })
}

export default store
