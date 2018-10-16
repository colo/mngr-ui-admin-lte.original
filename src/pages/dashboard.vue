<template>
  <!-- Main content -->
  <section class="content" v-if="!$route.params.host">
    <div class="row">
      <section class="col-lg-12 connectedSortable">
        <admin-lte-box-solid
          title="Summary"
          id="dashboard-summary"
          v-once
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >
          <admin-lte-dashboard-summary
            :docs_per_sec="docs_per_sec"
            :number_of_hosts="number_of_hosts"
          >
          </admin-lte-dashboard-summary>
        </admin-lte-box-solid>
      </section>
    </div>

  </section>
  <!-- <router-view v-else :host="$route.params.host"></router-view> -->
  <router-view v-else></router-view>


</template>

<style>
</style>

<script>

// import chart from 'components/mixins/chart'
// import dashboard from 'components/mixins/dashboard'

import AdminLteBoxSolid from 'components/admin-lte/boxSolid'
import AdminLteDashboardSummary from 'components/admin-lte/dashboard/summary'

import { mapState } from 'vuex'

export default {
  // mixins: [chart, dashboard],

  name: 'admin-lte-dashboard',

  components: {
    AdminLteBoxSolid,
    AdminLteDashboardSummary
  },

  computed: Object.merge(mapState({
    // arrow functions can make the code very succinct!
    docs_per_sec: state => state.app.docs.count,
    number_of_hosts: state => state.hosts.all.length,
  })),
  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  }

}

// import AdminLTE from 'admin-lte/dist/js/adminlte.min.js'
</script>
