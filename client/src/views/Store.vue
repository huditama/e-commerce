<template>
  <Card
    v-bind:products="filterProducts"
    v-on:addToCart="addToCart"
    v-bind:loggedInRole="loggedInRole"
  ></Card>
</template>

<script>
import Card from "../components/Card";
export default {
  props: ["search", "loggedInRole"],
  data() {
    return {
      products: [],
      searchProduct: "",
      userCart: []
    };
  },
  watch: {
    search(value) {
      this.searchProduct = value;
    }
  },
  created() {
    this.getAllProducts();
    this.getUserCart();
  },
  computed: {
    filterProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().match(this.search);
      });
    }
  },
  components: {
    Card
  },
  methods: {
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
    getUserCart() {
      let token = localStorage.getItem("token");
      this.$axios
        .get("/carts", { headers: { token } })
        .then(({ data }) => {
          const { products } = data;
          this.userCart = products;
          this.$emit("getUserCart", products);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addToCart(updatedCart) {
      this.userCart = updatedCart;
      this.$emit("addToCart", updatedCart);
    }
  }
};
</script>

<style scoped>
</style>