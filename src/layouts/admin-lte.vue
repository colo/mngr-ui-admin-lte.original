<template>
<div class="wrapper">

  <admin-lte-header/>
  <!-- Left side column. contains the logo and sidebar -->
  <admin-lte-left-sidebar/>

  <!-- Content Wrapper. Contains page content -->
    <!-- <router-view :EventBus="EventBus"/> -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name}}
          <small>{{$route.params.host}}</small>
        </h1>
        <app-breadcrumbs container="ol" class="breadcrumb">
          <li slot-scope="{to, label, utils}" class="active">
            <router-link
              :to="to"
              exact
            >
            <!-- :itemprop="utils && utils.itemprop" -->
              <!-- <i class="fa fa-dashboard"></i>  -->
              {{label}}
            </router-link>
          </li>
        </app-breadcrumbs>


        <!-- <ol class="breadcrumb">
          <li>
            <router-link :to="{name: 'Home'}">
              <i class="fa fa-dashboard"></i> Home
            </router-link>
          </li>

          <li class="active">{{$route.name || $route.path}}</li>

        </ol> -->
      </section>

      <!-- Main content -->
       <router-view></router-view>


      <!-- /.content -->
    </div>

  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <admin-lte-footer/>

  <!-- Control Sidebar -->
  <admin-lte-control-sidebar/>
</div>
<!-- ./wrapper -->


</template>

<script>
// import { openURL } from 'quasar'

// try -> https://github.com/Suruat/vue-2-crumbs
import Vue from 'vue'
import Vue2Crumbs from 'vue-2-crumbs'

Vue.use(Vue2Crumbs)

import AdminLteHeader from './admin-lte/header'
import AdminLteLeftSidebar from './admin-lte/leftSidebar'
import AdminLteFooter from './admin-lte/footer'
import AdminLteControlSidebar from './admin-lte/controlSidebar'

// import 'components/admin-lte/adminlte.js'

import admin_lte_mixin from 'components/mixins/admin-lte'

export default {
  mixins: [admin_lte_mixin],

  name: 'admin-lte',

  components: {
    AdminLteHeader,
    AdminLteLeftSidebar,
    AdminLteFooter,
    AdminLteControlSidebar
  },
  props: {
    // EventBus: {
    //   type: [Object],
    //    default: () => ({})
    // },
  },

  data () {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    // openURL
  },
  created: function(){

  },
  // mounted() {
  //   this.admin_lte_ui()
  // },
  // updated: function(){
  //   this.admin_lte_ui()
  //
  // },
  // methods: {
  //   //https://stackoverflow.com/questions/44134147/vue-js-removes-jquery-event-handlers
  //   admin_lte_ui: function(){
  //     $(document).trigger('vue-loaded')
  //
  //     // Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
  //     jQuery.widget.bridge('uibutton', jQuery.ui.button)
  //
  //     // console.log('admin-lte this.$route',this.$route)
  //
  //     // Make the dashboard widgets sortable Using jquery UI
  //     $('.connectedSortable').sortable({
  //       placeholder         : 'sort-highlight',
  //       connectWith         : '.connectedSortable',
  //       handle              : '.box-header, .nav-tabs',
  //       forcePlaceholderSize: true,
  //       zIndex              : 999999
  //     });
  //     $('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');
  //
  //
  //     $('.box').boxWidget({
  //       animationSpeed : 300,
  //     });
  //   }
  // }
}

// import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
