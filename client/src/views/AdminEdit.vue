<template>
  <v-container style="margin-top:10%;width:40%">
    <v-layout justify-center align-center>
      <v-flex>
        <v-form ref="form" v-on:submit.prevent="editProduct(editId)">
          <center>
            <h1>Edit a Product</h1>
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
          <v-btn color="info" type="submit">Edit!</v-btn>
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
  props: ["editId", "editName", "editPrice", "editStock", "editImage"],
  data() {
    return {
      name: this.editName,
      price: this.editPrice,
      stock: this.editStock,
      image: this.editImage
    };
  },
  watch: {
    editName(value) {
      this.name = value;
    },
    editPrice(value) {
      this.price = value;
    },
    editStock(value) {
      this.stock = value;
    }
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    upload(event) {
      this.image = event.target.files[0];
    },
    editProduct(id) {
      let token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("price", this.price);
      formData.append("stock", this.stock);
      formData.append("image", this.image);
      this.$axios
        .patch(`/products/${id}`, formData, {
          headers: { token },
          "Content-Type": "multipart/form-data"
        })
        .then(({ data }) => {
          const { message, createdProduct } = data;
          this.$swal("Success!", message, "success");
          this.$emit("newProduct", createdProduct);
          this.$router.push("/admin");
          this.$emit('updatedProduct')
        })
        .catch(err => {
          this.$swal("Error!", "Invalid input!", "error");
        });
    }
  }
};
</script>

<style>
</style>