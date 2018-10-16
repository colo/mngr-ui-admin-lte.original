<template>
  <div id="q-app">
    <!-- <router-view :EventBus="EventBus" :class="($q.loading.active) ? 'invisible' : 'visible'"  /> -->
    <router-view />
  </div>
</template>

<script>
/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
import Vue from 'vue'
export const EventBus = new Vue()

/**
* needed for pipelines and libs (dygraph) as a way to comunicate with Vue (emit events)
**/
if(!window['EventBus'])
  window['EventBus'] = EventBus

/**
* to registerModule 'hosts'
**/
// let hostStore = {
//   namespaced: true,
//   state: function() {
//     return {
//       pipelines: [],
//       stats: {}
//     }
//   },
//   getters: {},
//   actions: {},
//   mutations: {
//     data: function(state, payload) {//generic mutation
//       if(Array.isArray(payload.value)){
//         // state.networkInterfaces = payload
//         if(!state.stats[payload.path])
//           Vue.set(state.stats, payload.path, {})
//
//         Vue.set(state.stats[payload.path], payload.key, payload.value)
//         // let len = state[payload.key].length;
//         // while (len--) {
//         //   state[payload.key].pop()
//         // }
//         // len = payload.value.length;
//         // let index = 0
//         // while (index<len) {
//         //   state[payload.key].push(payload.value[index])
//         // }
//
//
//       }
//       else {
//
//         // if(payload.key == 'loadavg'){
//         //   //////////console.log('data', state, payload)
//         // }
//         if(!state.stats[payload.path])
//           Vue.set(state.stats, payload.path, {})
//
//         if(!state.stats[payload.path][payload.key])
//           Vue.set(state.stats[payload.path], payload.key, [])
//
//         state.stats[payload.path][payload.key].push(payload.value)
//       }
//     },
//     splice: (state, payload) => {
//
//       if(state.stats[payload.path] && state.stats[payload.path][payload.key]){
//         let length = state.stats[payload.path][payload.key].length
//         state.stats[payload.path][payload.key].splice(
//           -payload.length -1,
//           length - payload.length
//         )
//       }
//     },
//
//     add: (state, pipeline) => {
//       state.pipelines.push(pipeline)
//     },
//
//     set: (state, pipelines) => {
//       Array.each(pipelines, function(pipeline){
//         if(!state.pipelines.contains(pipeline))
//           state.pipelines.push(pipeline)
//       })
//       Array.each(state.pipelines, function(pipeline){
//         if(!hosts.contains(pipeline))
//           state.pipelines.erase(pipeline)
//       })
//       // Vue.set(state, 'all', hosts)
//     },
//
//     erase: (state, pipeline) => {
//       if(state.pipelines.contains(pipeline)){
//         let tmp_array = Array.clone(state.pipelines)
//         tmp_array.erase(pipeline)
//         Vue.set(state, 'pipelines', tmp_array)
//       }
//     },
//
//
//     clear: (state) => {
//       Vue.set(state, 'pipelines', [])
//     }
//   }
// }

import hostStore from 'src/store/host'
// import statsStore from 'src/store/stats'

import Pipeline from 'js-pipeline'


/**
* search host & paths
**/
// import SearchPipeline from '@libs/pipelines/search'
// let search_pipeline = new Pipeline(SearchPipeline)


/**
* count docs x sec
**/
// import CountPipeline from '@libs/pipelines/count'
// let count_pipeline = new Pipeline(CountPipeline)

import AppPipeline from '@libs/pipelines/app'
// let app_pipeline = new Pipeline(AppPipeline)

import { mapState } from 'vuex'

// import VuexPersistence from 'vuex-persist'
// const vuexLocal = new VuexPersistence ({
//   storage: window.localStorage,
//   // reducer: state => ({app: state.app, hosts : state.hosts, stats: state.stats}), //only save app module
//   // modules: ['app', 'hosts', 'stats']
// })

export default {
  name: 'App',

  intervals: [],
  pipeline: undefined,

  data () {
    return {
      // EventBus : EventBus
    }
  },

  watch: {
    '$store.state.app.docs.hosts': {
      handler: function(newVal, oldVal){
        // console.log('recived doc via Event hosts', newVal)
        this.process_hosts_doc(newVal)
      },
      deep: true
    },
    '$store.state.app.docs.paths': {
      handler: function(newVal, oldVal){
        //console.log('recived doc via Event paths', newVal)
        this.process_paths_doc(newVal)
      },
      deep: true
    }
  },
  mounted: function(){
    this.process_paths_doc(this.$store.state.app.docs.paths)
    this.process_hosts_doc(this.$store.state.app.docs.hosts)
  },
  methods: {
    process_paths_doc: function(doc){
      console.log('process_paths_doc', doc)
      if(doc != null){
        let currentPaths = this.$store.state.app.paths
        if (currentPaths.equals(doc) !== true){

          this.$store.commit('app/paths', doc)

        }
        // else {
        //   this.$store.commit('hosts/set', doc.hosts)
        // }


      }
    },
    process_hosts_doc: function(doc){
      console.log('process_hosts_doc', doc)

      if(doc != null){

        this.$store.commit('hosts/clear')
        this.$store.commit('hosts/set', doc)

        /**
        let currentRange = Object.clone(this.$store.state.app.range)
        //////console.log('update range', currentRange)
        //just a small modification to notify of update
        this.$store.commit('app/range', {start: currentRange[0] + 1, end: currentRange[1]})
        **/

        this.$store.commit('app/reset', false)
        this.$store.commit('app/reset', true)

        Array.each(doc, function(host){
          if(!this.$store.state['host_'+host]){
            console.log('registerModule HOSTS', host)
            this.$store.registerModule('host_'+host, Object.clone(hostStore))
          }
          // if(!this.$store.state.stats[host]){
          //   ////console.log('registerModule HOSTS', host)
          //   this.$store.registerModule(['stats',host], Object.clone(statsStore), { preserveState: true })
          // }
        }.bind(this))

        /**
        * should unregister modules for unset hosts?
        */
        Array.each(this.$store.state, function(host){
          if(!doc.contains(host.replace('host_'))){
            console.log('UNregisterModule HOSTS', host)
            this.$store.unregisterModule('host_'+host)
          }
        }.bind(this))

        // Array.each(this.$store.state.stats, function(host){
        //   if(!doc.hosts.contains(host)){
        //     //console.log('UNregisterModule Stats', host)
        //     this.$store.unregisterModule(['stats',host])
        //   }
        // }.bind(this))

      }
    }
  },
  beforeDestroy: function(){
    let pipe = this.$options.pipeline
    pipe.fireEvent('onSuspend')
    pipe.fireEvent('onExit')
    pipe.removeEvents()
    this.$options.pipeline = undefined

  },
  created: function(){
    let self = this

    if(this.$options.pipeline == undefined){
      this.$options.pipeline = new Pipeline(AppPipeline)
    }
    else{
      this.$options.pipeline.fireEvent('onResume')
    }

    // this.$options.intervals.push(
    //   setInterval(function(){
    //     //console.log('flushing...')
    //     self.$store.dispatch('stats/flush')
    //   }, 5000)
    // )
    // EventBus.$on('count', doc => {
    //   // //console.log('recived doc via Event count', doc)
    //
    //   this.$store.commit('app/docs_per_sec', doc.data)
    // })

    // EventBus.$on('search', doc => {
		// 	// //console.log('recived doc via Event search', doc)
    //
    //
    //   let currentPaths = this.$store.state.app.paths
    //   if (currentPaths.equals(doc.paths) !== true){
    //
    //     this.$store.commit('app/paths', doc.paths)
    //
    //     this.$store.commit('hosts/clear')
    //     this.$store.commit('hosts/set', doc.hosts)
    //
    //
    //     let currentRange = Object.clone(this.$store.state.app.range)
    //     //////console.log('update range', currentRange)
    //     //just a small modification to notify of update
    //     this.$store.commit('app/range', {start: currentRange[0] + 1, end: currentRange[1]})
    //
    //     this.$store.commit('app/reset', false)
    //     this.$store.commit('app/reset', true)
    //
    //   }
    //   else {
    //     this.$store.commit('hosts/set', doc.hosts)
    //   }
    //
    //
    //
    //   Array.each(doc.hosts, function(host){
    //     if(!this.$store.state.hosts[host]){
    //       ////console.log('registerModule HOSTS', host)
    //       this.$store.registerModule(['hosts', host], Object.clone(hostStore))
    //     }
    //   }.bind(this))
    //
    //   /**
    //   * should unregister modules for unset hosts?
    //   */
    //   Array.each(this.$store.state.hosts, function(host){
    //     if(!doc.hosts.contains(host)){
    //       //console.log('UNregisterModule HOSTS', host)
    //       this.$store.unregisterModule(['hosts', host])
    //     }
    //   }.bind(this))
    //
    //
    //
		// })
  },
}


/**
* https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
**/
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

</script>

<style>
</style>
