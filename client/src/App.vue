<template>
  <v-app>
    <!-- NAVBAR -->
    <v-toolbar dark fixed>
      <!-- <v-toolbar-side-icon v-if="isLoggedIn"></v-toolbar-side-icon> -->
      <v-toolbar-title class="white--text">⚽ Cleatz</v-toolbar-title>

      <!-- SEARCH BAR -->
      <v-text-field
        placeholder="Search"
        style="width:10%;margin-left:3%;"
        v-if="isLoggedIn && this.$route.path == '/store'"
        v-model="search"
      ></v-text-field>
      <!-- END OF SEARCH BAR -->

      <v-spacer></v-spacer>

      <!-- HOME BUTTON -->
      <router-link to="/" style="textDecoration:none;color:white;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon>
              <v-icon dark v-on="on">home</v-icon>
            </v-btn>
          </template>
          <span>Home</span>
        </v-tooltip>
      </router-link>
      <!-- END OF HOME BUTTON -->

      <!-- STORE DASHBOARD BUTTON -->
      <router-link
        to="/admin"
        style="textDecoration:none;color:white;"
        v-if="isLoggedIn && loggedInRole == 'admin'"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon>
              <v-icon dark v-on="on">dashboard</v-icon>
            </v-btn>
          </template>
          <span>Store Dashboard</span>
        </v-tooltip>
      </router-link>
      <!-- END OF STORE DASHBOARD BUTTON -->

      <!-- STORE BUTTON -->
      <router-link to="/store" style="textDecoration:none;color:white;" v-if="isLoggedIn">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon>
              <v-icon dark v-on="on">shop</v-icon>
            </v-btn>
          </template>
          <span>Store</span>
        </v-tooltip>
      </router-link>
      <!-- END OF STORE BUTTON -->

      <!-- REGISTER BUTTON -->
      <router-link to="/register" style="textDecoration:none;color:white;" v-if="!isLoggedIn">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon>
              <v-icon dark v-on="on">person_add</v-icon>
            </v-btn>
          </template>
          <span>Register</span>
        </v-tooltip>
      </router-link>
      <!-- END OF REGISTER BUTTON -->

      <!-- LOGIN BUTTON -->
      <router-link to="/login" style="textDecoration:none;color:white;" v-if="!isLoggedIn">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon>
              <v-icon dark v-on="on">input</v-icon>
            </v-btn>
          </template>
          <span>Login</span>
        </v-tooltip>
      </router-link>
      <!-- END OF LOGIN BUTTON -->

      <!-- CART DIALOG -->
      <v-badge left overlap inline v-if="isLoggedIn && loggedInRole == 'user'">
        <template v-slot:badge v-if="userCart.length">
          <span>{{userCart.length}}</span>
        </template>
        <Cart
          v-bind:isLoggedIn="isLoggedIn"
          v-bind:cart="userCart"
          v-on:addQuantity="addQuantity"
          v-on:subtractQuantity="subtractQuantity"
          v-on:removeProduct="removeProduct"
          v-on:getAllProducts="getAllProducts"
          v-on:checkout="checkout"
        ></Cart>
      </v-badge>
      <!-- END OF CART DIALOG -->

      <!-- LOGOUT BUTTON -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-if="isLoggedIn" v-on:click="logout">
            <v-icon dark v-on="on">settings_power</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
      <!-- END OF LOGOUT BUTTON -->
    </v-toolbar>
    <!-- END OF NAVBAR -->

    <!-- MAIN CONTENT -->
    <v-content>
      <router-view
        v-on:success-login="login"
        v-bind:search="search"
        v-bind:isLoggedIn="isLoggedIn"
        v-on:getUserCart="getUserCart"
        v-on:addToCart="addToCart"
        v-bind:loggedInRole="loggedInRole"
        v-bind:products="products"
        v-on:newProduct="createProduct"
        v-on:updatedProduct="updatedProduct"
        v-on:deletedProduct="deletedProduct"
      ></router-view>
    </v-content>
    <!-- END OF MAIN CONTENT -->

    <!-- FOOTER -->
    <v-footer dark>
      <v-card class="flex" flat tile>
        <v-card-actions class="black justify-center">
          &copy;2019 —
          <strong>Cleatz</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
    <!-- END OF FOOTER -->
  </v-app>
</template>

<script>
import Home from "./views/Home";
import Cart from "./components/Cart";

export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      loggedInRole: "",
      search: "",
      userCart: [],
      products: []
    };
  },
  components: {
    Cart
  },
  created() {
    let token = localStorage.getItem("token");

    // Verify token
    if (token) this.verify();
  },
  methods: {
    verify() {
      let token = localStorage.getItem("token");
      let role = localStorage.getItem("role");
      this.$axios
        .post(`users/verify`, { token }, { headers: { token } })
        .then(({ data }) => {
          this.isLoggedIn = true;
          this.loggedInRole = role;
          if (role == "admin") this.$router.push("/admin");
          else this.$router.push("/store");
          this.getAllProducts();
          console.log(data.message);
        })
        .catch(err => {
          const { message } = err.response.data;
          this.$swal("Error!", message, "error");
          localStorage.removeItem("token");
          localStorage.removeItem("UserId");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
        });
    },
    login(role) {
      this.isLoggedIn = true;
      this.loggedInRole = role;
      this.getAllProducts();
    },
    logout() {
      this.isLoggedIn = false;
      this.$swal("Bye-bye!", "", "success");
      this.$router.push("/");
      localStorage.removeItem("token");
      localStorage.removeItem("UserId");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    },
    getUserCart(cart) {
      this.userCart = cart;
    },
    addToCart(updatedCart) {
      this.userCart = updatedCart;
    },
    addQuantity(updatedCart) {
      this.userCart = updatedCart;
    },
    subtractQuantity(updatedCart) {
      this.userCart = updatedCart;
    },
    removeProduct(updatedCart) {
      this.userCart = updatedCart;
    },
    getAllProducts() {
      let token = localStorage.getItem("token");
      this.$axios
        .get("/products", { headers: { token } })
        .then(({ data }) => {
          this.products = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    createProduct(newProduct) {
      this.products.push(newProduct);
    },
    updatedProduct() {
      this.getAllProducts();
    },
    deletedProduct() {
      this.getAllProducts();
    },
    checkout(updatedCart) {
      this.getAllProducts()
      this.userCart = updatedCart;
    }
  }
};
</script>

<style scoped>
</style>