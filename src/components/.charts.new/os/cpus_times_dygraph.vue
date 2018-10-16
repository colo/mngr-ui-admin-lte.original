<template>
  <chart-tabular
    v-if="visibility"
    :type="'dygraph'"
    :id="this.host+'_os_cpus_times'"
    :EventBus="EventBus"
    :chart="chart"
    :stat="{lastupdate: lastupdate, data: data}"
  >
  </chart-tabular>
  <chart-empty-container v-else></chart-empty-container>
</template>

<script>

import chartTabular from 'components/chart.tabular'
import chartEmptyContainer from 'components/chart.empty.container'


import stat from 'components/mixins/stat'


export default {
  mixins: [stat],

  name: 'cpus-times-dygraph',

  components: {
    chartTabular,
    chartEmptyContainer
  },

  __unwatcher: undefined,
  payload: {},

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    visibility: {
      type: [Boolean],
       default: false
    },
    host:{
      type: [String],
      default: ''
    },
  },

  data () {
    return {
      // {lastupdate: 0, 'data': [] }
      chart: {},
      stat: {}
    }
  },

  created () {
    this.$options.payload = {
      name: this.host+'_os_cpus_times',
      stat: {
        host: this.host,
        path: 'cpus_times',
        key: 'os_cpus',
        length: this.seconds || 300,
        tabular: true
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      },
      pipeline: {
        name: 'input.os',
        path: 'os',
        // range: true
      }
    }
  },
  destroyed (){
    this.$off()
  },
  methods: {
    init: function(){
      this.__get_stat_for_chart(this.$options.payload)
    },

    __get_stat_for_chart: function(payload){
      let {name, stat, pipeline} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]
      let tabular = (stat.tabular) ? stat.tabular : false

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      let watch_name = (tabular == true) ? '_tabular' : ''

      payload.watcher = payload.watcher ||  {
        name: '$store.state.stats'+ watch_name +'.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep:true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value, stat.length)
        }
      },
      // //console.log('__get_stat_for_chart', payload.watcher)

      stat.range = range

      // this.add_chart_stat(name)

      this.get(stat, function(docs){

        let pipe = this.$options.pipelines[pipeline.name]
        pipe.inputs[0].options.conn[0].module.options.paths = [pipeline.path]


        if(
          docs.length != 0
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){

          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){

              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp

          }
          else{
            docs = []
          }

        }
        else{
          docs = []
        }

        let eventRange = (tabular == true) ? 'tabularRange' : pipeline.path+'Range'

        EventBus.$once(eventRange, () =>
          this.__get_stat(stat, function(docs_range){

            let all_stats = docs.append(docs_range)
            all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

            let length = all_stats.length
            all_stats.splice(
              range_length -1,
              length - range_length
            )

            this.__update_chart_stat(name, all_stats, stat.length)

            this.add_watcher(payload)

          }.bind(this))
        )

        if(pipeline.range && pipeline.range == true)
          pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })


      }.bind(this))
    },
  }
}
</script>
