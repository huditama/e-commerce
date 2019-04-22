<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="red lighten-2" dark v-on="on">View</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>{{productName}}</v-card-title>
        <center>
          <v-img class="white--text" width="347px" height="200px" :src="productImage"></v-img>
        </center>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["productImage", "productName"],
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style>
</style>
