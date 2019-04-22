<template>
  <div>
    <v-container grid-list-md text-xs-center v-if="this.$route.path == '/admin'">
      <h1 style="margin-top:5%">Store Dashboard</h1>
      <v-layout row wrap>
        <!-- TABLE PRODUCT DETAILS -->
        <v-flex xs12>
          <center>
            <v-data-table
              :headers="headers"
              :items="products"
              class="elevation-5"
              style="width:80%"
            >
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.price.toLocaleString() }}</td>
                <td class="text-xs-left">{{ props.item.stock }}</td>
                <td>
                  <AdminView
                    v-bind:productImage="props.item.image"
                    v-bind:productName="props.item.name"
                  ></AdminView>
                </td>
                <!-- EDIT PRODUCT BUTTON -->
                <td>
                  <router-link to="/admin/edit" style="textDecoration:none;">
                    <v-btn
                      color="warning"
                      v-on:click="fillDetails(props.item._id, props.item.name, props.item.price ,props.item.stock, props.item.image)"
                    >
                      <v-icon>edit</v-icon>EDIT
                    </v-btn>
                  </router-link>
                </td>
                <!-- END OF EDIT PRODUCT BUTTON -->
                <!-- DELETE PRODUCT BUTTON -->
                <td>
                  <v-btn color="error" v-on:click="deleteProduct(props.item._id)">
                    <v-icon>delete_forever</v-icon>Delete
                  </v-btn>
                </td>
                <!-- END OF DELETE PRODUCT BUTTON -->
              </template>
            </v-data-table>
          </center>
          <!-- ADD PRODUCT BUTTON -->
          <router-link to="/admin/create" style="textDecoration:none;">
            <v-btn color="info">
              <v-icon>add</v-icon>Create a Product
            </v-btn>
          </router-link>
          <!-- END OF ADD PRODUCT BUTTON -->
          <!-- VIEW TRANSACTIONS BUTTON -->
          <router-link to="/admin/transactions" style="textDecoration:none;">
            <v-btn color="success">
              <v-icon>monetization_on</v-icon>Transactions
            </v-btn>
          </router-link>
          <!-- END OF VIEW TRANSACTIONS BUTTON -->
        </v-flex>
        <!-- END OF PRODUCT DETAILS -->
      </v-layout>
    </v-container>

    <router-view
      v-on:newProduct="createProduct"
      v-on:updatedProduct="updatedProduct"
      v-bind:editId="id"
      v-bind:editName="name"
      v-bind:editPrice="price"
      v-bind:editStock="stock"
      v-bind:editImage="image"
    ></router-view>
  </div>
</template>

<script>
import AdminView from "../components/AdminView";
export default {
  props: ["products"],
  data() {
    return {
      id: "",
      name: "",
      price: "",
      stock: "",
      image: "",
      headers: [
        {
          text: "Product Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Price (IDR)", align: "left", value: "price" },
        { text: "Stock", align: "left", value: "stock" },
        { text: "Image", align: "center", value: "image", sortable: false },
        {
          text: "Edit Details",
          align: "center",
          value: "edit",
          sortable: false
        },
        {
          text: "Remove",
          align: "center",
          value: "delete",
          sortable: false
        }
      ]
    };
  },
  components: {
    AdminView
  },
  methods: {
    createProduct(newProduct) {
      this.$emit("newProduct", newProduct);
    },
    updatedProduct() {
      this.$emit("updatedProduct");
    },
    fillDetails(id, name, price, stock, image) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.stock = stock;
      this.image = image;
    },
    deleteProduct(id) {
      this.$swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        let token = localStorage.getItem("token");
        if (willDelete) {
          this.$axios
            .delete(`/products/${id}`, { headers: { token } })
            .then(({ data }) => {
              const { message } = data;
              this.$swal(message, {
                icon: "success"
              });
              this.$emit('deletedProduct')
            });
        } else {
          this.$swal("Phew....that was close!");
        }
      });
    }
  }
};
</script>

<style>
</style>
