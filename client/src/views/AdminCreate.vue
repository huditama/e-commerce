<template>
  <v-container style="margin-top:6%;width:40%">
    <v-layout justify-center align-center>
      <v-flex>
        <v-form ref="form" v-on:submit.prevent="createProduct">
          <center>
            <h1>Create a Product</h1>
          </center>
          <!-- PRODUCT NAME -->
          <v-text-field v-model="name" label="Product Name" required></v-text-field>
          <!-- END OF PRODUCT NAME -->

          <!-- PRODUCT PRICE -->
          <v-text-field type="number" v-model="price" label="Product Price" counter></v-text-field>
          <!-- END OF PRODUCT PRICE -->

          <!-- PRODUCT STOCK -->
          <v-text-field type="number" v-model="stock" label="Product Stock" counter></v-text-field>
          <!-- END OF PRODUCT STOCK -->

          <!-- IMAGE INPUT -->
          <input type="file" v-on:change="upload">
          <br>
          <br>
          <!-- END OF IMAGE INPUT -->

          <!-- SUBMIT BUTTON -->
          <v-btn color="info" type="submit">Create!</v-btn>
          <!-- END OF SUBMIT BUTTON -->

          <!-- RESET FORM -->
          <v-btn color="error" @click="reset">Reset Form</v-btn>
          <!-- END OF RESET FORM -->
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    name: "",
    stock: "",
    price: "",
    image: null
  }),
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    upload(event) {
      this.image = event.target.files[0];
    },
    createProduct() {
      let token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("price", this.price);
      formData.append("stock", this.stock);
      formData.append("image", this.image);

      this.$axios
        .post("/products", formData, {
          headers: { token },
          'Content-Type': 'multipart/form-data'
        })
        .then(({ data }) => {
          const { message, createdProduct } = data;
          this.$swal("Success!", message, "success");
          this.$emit("newProduct", createdProduct);
          this.$router.push("/admin");
        })
        .catch(err => {
          const { errors } = err.response.data;
          let errorMessages = [];
          for (let key in errors) errorMessages.push(errors[key].message);
          errorMessages = errorMessages.join("\n");

          this.$swal("Error!", errorMessages, "error");
        });
    }
  }
};
</script>

<style>
</style>
