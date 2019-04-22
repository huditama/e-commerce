<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn flat color="black" icon dark v-on="on" style="margin-left:10%">
        <v-icon>add_shopping_cart</v-icon>Add to Cart
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">{{productName}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Amount*" required v-model="quantity" :rules="[rules.quantity]"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*quantity is required</small>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click="dialog = false"
          v-on:click="addToCart"
        >Add To Cart!</v-btn>
        <v-spacer></v-spacer>
        <v-btn fab dark small v-on:click="quantity++">
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn fab dark small v-on:click="quantity--">
          <v-icon>remove</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["productName", "ProductId", "productStock"],
  data: () => ({
    dialog: false,
    quantity: 0,
    rules: {
      quantity: v => +v >= 0 || "quantity is invalid!"
    }
  }),
  methods: {
    addToCart() {
      if (this.quantity > this.productStock) {
        this.$swal(
          "Error!",
          "Input amount is greater than product stock!",
          "error"
        );
      } else if (this.quantity < 0) {
        this.$swal(
          "Error!",
          "Invalid amount!",
          "error"
        );
      } else {
        let token = localStorage.getItem("token");
        const { ProductId, quantity, amount } = this;
        this.$axios
          .patch(
            "/carts/addToCart",
            { ProductId, quantity },
            { headers: { token } }
          )
          .then(({ data }) => {
            const { products } = data.updatedCart;
            this.$emit("addToCart", products);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style>
</style>
