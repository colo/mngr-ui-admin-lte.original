<template>
  <header class="main-header">

    <admin-lte-header-logo/>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">

          <!-- <admin-lte-header-messages-menu/> -->

          <admin-lte-header-notifications-menu/>

          <!-- <admin-lte-header-tasks-menu/> -->

          <!-- <admin-lte-header-user-menu/> -->

          <!-- Control Sidebar Toggle Button -->
          <li>
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
          </li>
        </ul>
      </div>
    </nav>
  </header>

</template>


<script>

import AdminLteHeaderLogo from './header/logo'
import AdminLteHeaderMessagesMenu from './header/messagesMenu'
import AdminLteHeaderNotificationsMenu from './header/notificationsMenu'
import AdminLteHeaderTasksMenu from './header/tasksMenu'
import AdminLteHeaderUserMenu from './header/userMenu'

export default {
  name: 'admin-lte-header',

  components: {
    AdminLteHeaderLogo,
    AdminLteHeaderMessagesMenu,
    AdminLteHeaderNotificationsMenu,
    AdminLteHeaderTasksMenu,
    AdminLteHeaderUserMenu
  },

}

</script>
