<template>
  <div>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex v-for="(product, index) in products" :key="index" xs4>
          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-card width="190%">
                <!-- STOCK IMAGE -->
                <v-img class="white--text" width="347px" height="200px" :src="product.image"></v-img>
                <!-- END OF STOCK IMAGE -->

                <!-- PRODUCT DETAILS -->
                <v-card-title style="text-align:left;">
                  <div>
                    <span class="grey--text">{{product.name}}</span>
                    <br>
                    <span>Price: Rp. {{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</span>
                    <br>
                    <span>Stock: {{product.stock}}</span>
                  </div>
                </v-card-title>
                <!-- END OF PRODUCT DETAILS -->

                <v-card-actions style="display:flex; justify-content:space-evenly;text-align:left;">
                  <!-- DIALOG VIEW -->
                  <ViewDialog
                    v-bind:name="product.name"
                    v-bind:image="product.image"
                    v-bind:price="product.price"
                    v-bind:stock="product.stock"
                  ></ViewDialog>
                  <!-- END OF DIALOG VIEW -->

                  <!-- ADD TO CART BUTTON -->
                  <AddToCart
                    v-if="loggedInRole == 'user'"
                    v-bind:productName="product.name"
                    v-bind:ProductId="product._id"
                    v-bind:productStock="product.stock"
                    v-on:addToCart="addToCart"
                  ></AddToCart>
                  <!-- END OF ADD TO CART BUTTON -->
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ViewDialog from "./ViewDialog";
import AddToCart from "./AddToCart";
export default {
  props: ["products", "loggedInRole"],
  data() {
    return {
      dialog: false
    };
  },
  components: {
    ViewDialog,
    AddToCart
  },
  methods: {
    addToCart(updatedCart) {
      this.$emit("addToCart", updatedCart);
    }
  }
};
</script>

<style scoped>
.flex.offset-sm3 {
  margin-top: 15%;
  margin-left: 0;
  /* margin-bottom: -10%; */
}
</style>
