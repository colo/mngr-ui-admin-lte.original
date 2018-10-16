<template>
  <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
    :style="chart.style"
  >
  <!-- v-observe-visibility="visibilityChanged" -->
     <div
       :ref="id"
       :id="id"
       :class="chart.class"
     >

    </div>
    <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div>
  </div>
</template>

<script>


import Dygraph from 'dygraphs'
// import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

export default {
  name: 'dygraph-wrapper',

  graph: undefined,
  freezed: false,

  __unwatcher: undefined,
  visible: true,

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    id: {
      type: [String],
      default: () => ('')
    },
    chart: {
      type: [Object],
      default: () => ({})
    },

    stat: {
      type: [Object],
      default: () => ({})
    },

    freezed: {
      type: [Boolean],
      default: () => (false)
    },
    visible: {
      type: [Boolean],
      default: () => (true)
    },
  },
  data () {
    return {
      // focus: true,
      container_class_helper: '',
      // graph: null,
      highlighted: false,
      ready: false,
      // to_suspend: false,
      // stat: {
      //   data: [[]]
      // }
    }
  },
  watch: {
    // visible: function (val) {
    //   this.container_class_helper = (val == false) ? 'invisible' : ''
    //   // ////////console.log('class visible', val, this.container_class_helper)
    // }
  },

  created () {
    ////////console.log('created', this.id, this.stat.data)
    // this.$set(stat, 'data', [[]])

    if(EventBus && typeof(EventBus.$on) == 'function'){
      EventBus.$on('highlightCallback', params => {
        this.highlighted = true
        // ////////////console.log('event highlightCallback', params)
  		})
      EventBus.$on('unhighlightCallback', event => {
        this.highlighted = false
        // ////////////console.log('event unhighlightCallback', event)
  		})
    }

    // window.addEventListener('blur', function() {
    //    this.focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function() {
    //    this.focus = true
    // }.bind(this), false)

    // this.create()


  },
  mounted () {

    // if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){
    //
    //   this.__create_dygraph()
    //
    // }
    // this.__watcher()

    this.create()
  },
  updated () {
  //
  //   // if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){
  //   //
  //   //   this.__create_dygraph()
  //   //
  //   // }
  //   // this.__watcher()
  //
    this.create()
  },
  destroyed (){
    this.destroy()
    if(this.$options.graph && typeof this.$options.graph.destroy == 'function'){
      // ////////console.log('destroying ...', this.id)
      this.$options.graph.destroy()

    }

    this.$options.graph = undefined
    this.$off()
  },
  methods: {

    /**
    * UI related
    **/
    // visibilityChanged (isVisible, entry) {
    //   this.$options.visible = isVisible
    //   // if(isVisible == true && !this.$options.graph)
    //   // if(isVisible == false)
    //   //   this.reset()
    // },
    reset: function(){
      //console.log('dygraph reset')
      this.destroy()
      this.create()
    },
    destroy: function(){
      //////console.log('dygraph destroy', this.id)

      if(this.$options.graph && typeof this.$options.graph.destroy == 'function'){
        // ////////console.log('destroying ...', this.id)
        this.$options.graph.destroy()

      }

      this.$options.graph = undefined
      this.ready = false

      if(this.$options.__unwatcher){
        this.$options.__unwatcher()
        this.$options.__unwatcher = undefined
      }

    },
    create (){
      this.__create_dygraph()
      // this.$options.__unwatcher = this.$watch('stat.data', function (val, oldVal) {
      //
      //
      //   ////console.log('updated data dygraph', this.id, this.stat.data)
      //
      //   // if(val.length > 1 && this.chart == null){
      //   if(val.length > 1){
      //
      //     if(!this.$options.graph){
      //
      //       this.__create_dygraph()
      //       // __unwatcher()
      //       this.$options.__unwatcher()
      //     }{
      //       // this.__create_dygraph()
      //       //
      //
      //       // this.update()
      //
      //     }
      //   }
      //
      // })
    },
    __create_dygraph (){


      let options = Object.clone(this.chart.options)
      if(options.labels && document.getElementById(this.id)){
        if(options.labelsDiv)
          options.labelsDiv = this.id+'-'+options.labelsDiv

        let data = []
        if(this.stat.data[0].length == 0){

          let row = []
          Array.each(options.labels, function(label){
            row.push(0)
          })
          data.push(row)
        }
        else{
          data = this._get_data()
          // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // data = []
        }

        // Array.each(this.stat.data, function(row){
        //   row[0] = new Date(row[0])
        //   data.push(row)
        // })

        //////console.log('__create_dygraph', data, options.labels)

        this.$options.graph = new Dygraph(
          document.getElementById(this.id),  // containing div
          data,
          options
        )

        this.$options.graph.ready(function(){
          // ////////////console.log('chart '+this.id+' ready')
          this.ready = true
          // this.update()
        }.bind(this))

        if(this.chart.init)
          this.chart.init(this, this.$options.graph, 'dygraph')

        // this.update()
      }
    },
    _get_data: function(data){
      data = data || Array.clone(this.stat.data)

      data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

      Array.each(data, function(row){
        row[0] = new Date(row[0])
        // data.push(row)
      })

      return data
    },
    update (data){
      // //console.log('dygraph update', this.id, data, this.$options.graph.numRows())
      data = this._get_data(data)
      // let options = (this.$options.graph.numRows() > 1) ? { 'dateWindow': this.$options.graph.xAxisExtremes() } : {}
      // if(this.$options.visible == true && this.ready == true){
      if(this.ready == true){

        this.updateOptions(
          data,
          // {},
          { 'dateWindow': this.$options.graph.xAxisExtremes() },
          false
        )


        // else{
        //   //////console.log('no focus, forcing...', new Date())
        //   this.updateOptions(
        //     data,
        //     // {},
        //     { 'dateWindow': this.$options.graph.xAxisExtremes() },
        //     false
        //   )
        //   // setTimeout(this.updateOptions(
        //   //   { 'dateWindow': this.$options.graph.xAxisExtremes() },
        //   //   false
        //   // ), 50)
        // }
      }
    },
    updateOptions (data, options, block_redraw){

      // let self = this

      if(
        this.highlighted == false
        && this.ready == true
        // && this.stat.data.length > 1
        // && this.stat.data[0].length > 1
        // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
        // && this.freezed == false
      ){

        // if(self.stat.data[0][0] == undefined && self.chart.options && self.chart.options.labels)//dygraph code, should be would
        //   Array.each(self.chart.options.labels, function(label, index){
        //     if(index == 0){
        //       self.stat.data[0].push(Date.now())
        //     }
        //     else{
        //       // data[0].push(0)
        //       self.stat.data[0].push(null)
        //     }
        //
        //   })
          data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )


          // let data = []
          //console.log('updateOptions', data, options)

          this.$options.graph.updateOptions(
            Object.merge(
              {
                'file': data
              },
              options
            ),
            block_redraw
          );

          // this.$options.graph.updateOptions(
          //   { 'dateWindow': this.$options.graph.xAxisExtremes() },
          //   block_redraw
          // );


          this.$options.graph.setSelection(this.$options.graph.numRows() - 1, {}, false)


      }

    }
  }
}
</script>
