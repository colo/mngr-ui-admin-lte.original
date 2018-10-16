<script>

import chart from 'components/chart'
import chartTabular from 'components/chart.tabular'

import chartEmptyContainer from 'components/chart.empty.container'

import admin_lte_mixin from 'components/mixins/admin-lte'

export default {
  mixins: [admin_lte_mixin],

  components: {
    chart,
    chartTabular,
    chartEmptyContainer
  },

  __unwatchers__: {},

  data () {
    return {
      EventBus: EventBus,
      stats: {},
      charts: {},
      available_charts: {}
    }
  },
  // updated: function(){
  //   this.admin_lte_ui()
  //
  // },
  methods: {
    /**
    * @start -charting
    **/
    add_chart: function (payload){
      let {name, chart, init, watch, watcher} = payload

      this.available_charts[name] = payload
      this.$set(this.charts, name, chart)

      // if(!this.stats[name])
      //   this.$set(this.stats, name, {lastupdate: 0, 'data': [] })

      if(init && typeof init == 'function')
        init(payload)

      if(watch == true && watcher)
        this.add_watcher(payload)

      //////console.log('add_chart', name)

      // if(this.$refs[name] && typeof this.$refs[name].create == 'function' ) this.$refs[name].create()

      // if(finish && typeof finish == 'function')
      //   finish(payload)

    },
    remove_chart: function (name, options){
      options = options || {}

      if(this.available_charts[name] && this.available_charts[name].stop && typeof this.available_charts[name].stop == 'function')
        this.available_charts[name].stop(this.available_charts[name])

      this.$delete(this.charts, name)

      // if(options.clean && options.clean == true)
      //   this.$set(this.stats, name, undefined)

      if(options.unwatch && options.unwatch == true){
        if(Array.isArray(this.available_charts[name].stat)){
          Array.each(this.available_charts[name].stat, function(stat, index){
            let indexed_name = name+'_'+index
            this.remove_watcher(indexed_name)
          }.bind(this))
        }
        else{
          this.remove_watcher(name)
        }
      }

      // if(this.$refs[name] && typeof this.$refs[name].reset == 'function'){
      //    this.$refs[name].reset()
      // }
      // else if (this.$refs[name] && this.$refs[name][0] && typeof this.$refs[name][0].reset == 'function' ){
      //   this.$refs[name][0].reset()
      // }

      //console.log('remove_chart', name, this.$refs[name])
    },
    remove_charts: function(options){
      Object.each(this.charts, function(chart, name){
        this.remove_chart(name, options)
      }.bind(this))
    },
    remove_watcher: function(name){
      //////console.log('remove_watcher', name)

      if(this.$options.__unwatchers__[name]){
        this.$options.__unwatchers__[name]()
        delete this.$options.__unwatchers__[name]
      }
    },
    add_chart_stat: function (name){
      // if(!this.stats[name])
      this.$set(this.stats, name, {lastupdate: 0, 'data': [] })
    },
    remove_chart_stat: function (name){
      this.$delete(this.stats, name)
    },
    remove_chart_stats: function(){
      // Object.each(this.stats, function(stat, name){
      //   this.remove_chart_stat(name)
      // }.bind(this))
      // this.$delete(this, 'stats')
      this.$set(this, 'stats', {})
    },
    add_watcher: function(payload){
      let {name, watcher} = payload
      // //////console.log('add_watcher', name, watch)

      this.remove_watcher(name)
      // if(!this.$options.__unwatchers__[name]){
        this.$options.__unwatchers__[name] = this.$watch(watcher.name, function (doc, old) {
          // //////console.log('add_watcher', name)
          if(watcher.cb)
            watcher.cb(doc, old, payload)

        }.bind(this),{
          deep: watcher.deep || false
        })
      // }
    },
    /**
    * @move to stat mixin
    **/
    __get_stat: function(payload, cb){
      ////////console.log('__get_stat', payload)
      // if(payload.tabular == true){
      //   this.$store.dispatch('stats_tabular/get', payload).then((docs) => cb(docs))
      // }
      // else{
        this.$store.dispatch('stats/get', payload).then((docs) => cb(docs))
      // }
    },
    __update_chart_stat: function(name, doc, splice){
      console.log('__update_chart_stat', name, doc, splice)

      /**
      * @config option this.visibility
      **/
      if(this.stats[name] && this.visibility[name] == true){

        if(Array.isArray(doc) && doc.length > 0){
          let data = []

          // doc.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

          Array.each(doc, function(d, index){
            data.push({ timestamp: d.metadata.timestamp, value: d.data })

            if(index == doc.length -1){

              // let old_data = Array.clone(this.stats[name].data)
              // data = old_data.combine(data)
              // data = this.stats[name].data.combine(data)
              data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
              this.$set(this.stats[name], 'data', data)
            }
          }.bind(this))

          // splice = splice || this.seconds
          // let length = this.stats[name].data.length
          // this.stats[name].data.splice(
          //   (splice * -1) -1,
          //   length - splice
          // )
        }
        else if(doc && !Array.isArray(doc)){
          let data = { timestamp: doc.metadata.timestamp, value: doc.data }
          this.stats[name].data.push(data)


          // if(length > this.seconds)
          //   this.stats[name].data.shift()
        }

        splice = (isNaN(splice)) ? this.seconds : splice

        let length = this.stats[name].data.length
        // if(splice == 1){
        //   let last = this.stats[name].data[this.stats[name].data.length -1]
        //   this.$set(this.stats[name], 'data', [last])
        // }
        // else{
          splice = (splice == 1) ? 2 : splice

          if(splice == 0){
            this.$set(this.stats[name], 'data', [])
          }
          else{
            this.stats[name].data.splice(
              (splice * -1) -1,
              length - splice
            )
          }
        // }

        ////console.log('__update_chart_stat',name, doc, splice, this.stats[name].data)

        this.stats[name].lastupdate = Date.now()
      }
    },
    /**
    * @end - charting
    **/

    /**
    * UI
    **/
    showCollapsible (collapsible){
      ////////console.log('showCollapsible', collapsible)
      // this.$options.has_no_data[collapsible.replace('-collapsible', '')] = 0
      // this.$set(this.hide, collapsible.replace('-collapsible', ''), false)

    },
    hideCollapsible (collapsible){
      ////////console.log('hideCollapsible', collapsible)
      // let name = collapsible.replace('-collapsible', '')
      // this.$options.has_no_data[name] = 61
      // this.$set(this.hide, name, true)
      //
      // // delete this.stats[name].data
      // // this.$set(this.stats[name], 'data', [])

    },


  }
}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-dygraph-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-legend {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-axis-label {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}
</style>
