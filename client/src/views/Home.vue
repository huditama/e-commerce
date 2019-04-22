<template>
  <!-- JUMBOTRON -->
  <v-container>
    <v-responsive>
      <v-container fluid>
        <v-layout align-center justify-center column fill-heightr>
          <v-flex>
            <h3 class="display-3">Welcome to Cleatz!</h3>
            <span
              class="subheading"
            >Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
            <v-divider class="my-3"></v-divider>
            <div v-if="!isLoggedIn || loggedInRole == 'user'" class="title mb-3">Check out our products!</div>

            <!-- REGISTER BUTTON -->
            <router-link to="/register" style="textDecoration:none;color:white;" v-if="!isLoggedIn">
              <v-btn class="mx-0" color="primary" large>Sign Up Today!</v-btn>
            </router-link>
            <!-- END OF REGISTER BUTTON -->

            <!-- CONTINUE SHOPPING BUTTON -->
            <router-link to="/store" style="textDecoration:none;color:white;" v-if="isLoggedIn && loggedInRole == 'user'">
              <v-btn class="mx-0" color="primary" large>Continue Shopping!</v-btn>
            </router-link>
            <!-- END OF CONTINUE SHOPPING BUTTON -->

            <!-- ADMIN DASHBOARD BUTTON -->
            <router-link to="/admin" style="textDecoration:none;color:white;" v-if="isLoggedIn && loggedInRole == 'admin'">
              <v-btn class="mx-0" color="primary" large>Store Dashboard!</v-btn>
            </router-link>
            <!-- END OF ADMIN DASHBOARD BUTTON -->

          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>
  </v-container>
  <!-- END OF JUMBOTRON -->
</template>

<script>
export default {
  props: ["isLoggedIn", "loggedInRole"]
};
</script>

<style scoped>
.container {
  margin-top: 6%;
}
</style>