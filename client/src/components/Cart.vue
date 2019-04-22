<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <!-- TOOLTIP MASIH BELOM BISA UNTUK CART -->
    <!-- <v-tooltip bottom v-if="isLoggedIn"> -->
    <template v-slot:activator="{ on }">
      <v-btn icon dark v-on="on">
        <v-icon>shopping_cart</v-icon>
      </v-btn>
    </template>
    <!-- </v-tooltip -->

    <v-card>
      <v-toolbar dark>
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Your Cart</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click="dialog = false">OKAY</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- IF USER DOES NOT HAVE ITEMS IN CART -->
      <v-flex xs12 v-if="!cart.length">
        <center>
          <v-card dark color="primary" style="margin-top:18%;width:30%">
            <v-card-text class="px-0">
              <center>YOU DO NOT HAVE ANY ITEMS IN YOUR CART</center>
            </v-card-text>
          </v-card>
        </center>
      </v-flex>
      <!-- END OF IF USER DOES NOT HAVE ITEMS IN CART -->

      <!-- IF USER HAS ITEMS IN CART -->
      <div v-if="cart.length">
        <!-- GRID -->
        <template>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <!-- HALF -->

              <!-- IMAGES HALF -->
              <v-flex xs4>
                <v-carousel hide-delimiters height="510px">
                  <v-carousel-item v-for="(item,i) in cart" :key="i">
                    <v-img
                      width="347px"
                      height="200px"
                      :src="item.ProductId.image"
                      style="margin-top:35%"
                    ></v-img>
                  </v-carousel-item>
                </v-carousel>
              </v-flex>
              <!-- END OF IMAGES HALF -->

              <!-- DETAILS HALF -->
              <v-flex xs8>
                <v-card width="750px">
                  <!-- TABLE -->
                  <v-data-table :headers="headers" :items="cart" style="min-width:200px">
                    <template v-slot:items="props">
                      <td class="text-xs-left">{{ props.item.ProductId.name }}</td>
                      <td
                        class="text-xs-left"
                      >{{ props.item.ProductId.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                      <td class="text-xs-left">{{ props.item.quantity}}</td>
                      <td class="text-xs-right">
                        <v-btn
                          fab
                          dark
                          small
                          v-on:click="addQuantity(props.item.ProductId._id, props.item.ProductId.stock)"
                        >
                          <v-icon small>add</v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          dark
                          small
                          v-on:click="subtractQuantity(props.item.ProductId._id, props.item.ProductId.stock)"
                        >
                          <v-icon small>remove</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-btn
                          color="error"
                          v-on:click="removeProduct(props.item.ProductId._id)"
                        >REMOVE</v-btn>
                      </td>
                    </template>
                  </v-data-table>
                  <!-- END OF TABLE -->
                  <v-card-actions>
                    <v-btn color="success" v-on:click="checkout(cart)">
                      <v-icon>shopping_cart</v-icon>CHECKOUT
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
              <!-- END OF DETAILS HALF -->

              <!-- END OF HALF -->
            </v-layout>
          </v-container>
        </template>
        <!-- END OF GRID -->
      </div>
    </v-card>
  </v-dialog>
  <!-- END OF IF USER HAS ITEMS IN CART -->
</template>

<script>
export default {
  props: ["isLoggedIn", "cart"],
  data() {
    return {
      dialog: false,
      total: "",
      headers: [
        {
          text: "Product Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Price (IDR)", value: "ProductId.price" },
        { text: "Quantity", value: "quantity" },
        { text: "Edit Amount", value: "ProductId._id", align: "center" },
        { text: "Actions", value: "ProductId._id", align: "center" }
      ]
    };
  },
  methods: {
    addQuantity(ProductId, stock) {
      const { quantity } = this.cart.find(item => {
        return item.ProductId._id == ProductId;
      });
      if (quantity >= stock) {
        this.$swal(
          "Error!",
          "Input amount is greater than product stock!",
          "error"
        );
      } else {
        let token = localStorage.getItem("token");
        this.$axios
          .patch("/carts/addQuantity", { ProductId }, { headers: { token } })
          .then(({ data }) => {
            const { products } = data.updatedCart;
            this.$emit("addQuantity", products);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    subtractQuantity(ProductId, stock) {
      const { quantity } = this.cart.find(item => {
        return item.ProductId._id == ProductId;
      });
      if (quantity == 1) {
        this.removeProduct(ProductId);
      } else {
        let token = localStorage.getItem("token");
        this.$axios
          .patch(
            "/carts/subtractQuantity",
            { ProductId },
            { headers: { token } }
          )
          .then(({ data }) => {
            const { products } = data.updatedCart;
            this.$emit("subtractQuantity", products);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    removeProduct(ProductId) {
      let token = localStorage.getItem("token");
      this.$axios
        .patch("/carts/removeProduct", { ProductId }, { headers: { token } })
        .then(({ data }) => {
          const { products } = data.updatedCart;
          this.$emit("removeProduct", products);
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkout(details) {
      let token = localStorage.getItem("token");
      this.$axios
        .patch("/carts/checkout", { details }, { headers: { token } })
        .then(({ data }) => {
          const { message, updatedCart } = data;
          this.createTransaction(details);
          this.$swal("Success!", message, "success");
          this.$emit("checkout", updatedCart.products);
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    },
    createTransaction(details) {
      let token = localStorage.getItem("token");
      this.$axios
        .post("/transactions", { details }, { headers: { token } })
        .then(({ data }) => {
          console.log("Created new Transaction!");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
</style>
