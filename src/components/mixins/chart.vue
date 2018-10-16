<template>

  <component
    :is="type+'-wrapper'"
    :id="id"
    :ref="id"
    :EventBus="EventBus"
    :chart="chart"
    :stat="tabular"
    v-bind="wrapper_props"
  />
  </component>

  <!-- v-observe-visibility="visibilityChanged" -->

</template>

<script>

import { frameDebounce } from 'quasar'

import dygraphWrapper from 'components/wrappers/dygraph'
import vueEasyPieChartWrapper from 'components/wrappers/vueEasyPieChart'
import jqueryKnobWrapper from 'components/wrappers/jqueryKnob'
import highchartsVueWrapper from 'components/wrappers/highchartsVue'

export default {

  components: {
    dygraphWrapper,
    vueEasyPieChartWrapper,
    jqueryKnobWrapper,
    highchartsVueWrapper
  },

  tabular: {
    lastupdate: 0,
    data: []
  },

  focus: true,

  __unwatcher: undefined,
  __chart_init: false,
  visible: true,
  data: [],

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    chart: {
      type: [Object],
      default: () => ({})
    },
    stat: {
      type: [Object],
      default: () => ({})
    },
    type:{
      type: [String],
      default: 'dygraph'
    },
    id:{
      type: [String],
      default: ''
    },
    wrapper_props: {
      type: [Object],
      default: () => ({})
    },
    merged: {
      type: [Boolean],
      default: false
    }
  },

  data () {
    return {
      tabular: {lastupdate: 0, 'data': [[]] },
    }
  },

  created () {
    window.addEventListener('blur', function() {
       this.$options.focus = false
    }.bind(this), false)

    window.addEventListener('focus', function() {
       this.$options.focus = true
    }.bind(this), false)

    this.create()
  },
  // mounted () {
  //   this.create()
  // },
  // updated () {
  //   this.create()
  // },
  destroyed (){
    this.destroy()
    // this.$delete(this.tabular, 'data')
    this.$off()
  },
  methods: {
    reset: function(){
      //console.log('chart.vue mixing reset', this.id, this.$refs[this.id])
      // this.$refs[this.id].reset()
      this.destroy()
      this.create()
    },
    create: function(){
      // //console.log('chart.vue mixing create', this.id, this.$refs[this.id])
      if(this.$refs[this.id] && typeof this.$refs[this.id].create == 'function')
        this.$refs[this.id].create()
    },
    destroy: function(){
      //console.log('chart.vue mixing destroy', this.id)

      if(this.$options.__unwatcher)
        this.$options.__unwatcher()

      this.$options.tabular.data = [[]]

      this.$set(this.tabular, 'data', [[]])

      if(this.$refs[this.id] && typeof this.$refs[this.id].destroy == 'function')
        this.$refs[this.id].destroy()

      this.$options.__chart_init = false

    },
    __create_watcher(name, chart){},
    update_chart_stat (name, data){
      
      // //console.log('chart mixin update_chart_stat', name, this.id, this.$refs[this.id])


      if(this.$options.focus == true && this.$options.visible == true && data.length > 0){
        // //console.log('update_chart_stat visibility', this.id, data)
        if(data.length == 1){

          // this.tabular.data.shift()
          // this.tabular.data.push(data[0])
          /**
          * ensures no "glitches" as a point may be in the incorrect posittion
          */
          // let old_data = Array.clone(this.tabular.data)
          // old_data.shift()
          // old_data.push(data[0])
          // old_data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // this.$set(this.tabular, 'data', old_data)

          this.$options.tabular.data.shift()
          this.$options.tabular.data.push(data[0])

          // this.$set(this.tabular, 'data', old_data)

        }
        else{

          // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

          // this.$set(this.tabular, 'data', data)
          this.$options.tabular.data = data

        }

        this.$options.tabular.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

        // //console.log('chart mixin update_chart_stat', name, this.id, this.$options.tabular.data)

        // this.tabular.lastupdate = Date.now()


        // https://stackoverflow.com/questions/17218938/requestanimationframe-and-knowing-when-the-browser-is-re-painting
        this.$options.tabular.lastupdate = Date.now()
        if(this.$refs[name] && typeof this.$refs[name].update == 'function'){
          frameDebounce(this.$refs[name].update(this.$options.tabular.data))
        }
        else{
          frameDebounce(this.$set(this, 'tabular', this.$options.tabular))
        }


      }

    },
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
    //   // this.$options.visible = isVisible
    //   if(
    //     isVisible == false
    //     && (this.$options.visible == undefined || this.$options.visible == true)
    //   ){
    //     this.reset()
    //   }
    //   // else if (
    //   //   isVisible == true
    //   //   && this.available_charts[id]
    //   //   && (this.visibility[id] == undefined || this.visibility[id] == false)
    //   // ){
    //   //   this.$set(this.visibility, id, true)
    //   //   this.add_chart(this.available_charts[id], id)
    //   // }
      this.$options.visible = isVisible
    },
  }
}
</script>
