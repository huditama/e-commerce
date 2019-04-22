<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <center>
          <h2 style="margin-top:10%">User Transactions</h2>
          <!-- TRANSACTIONS TABLE -->
          <v-data-table
            :headers="headers"
            :items="transactions"
            class="elevation-5"
            style="width:80%;"
          >
            <template v-slot:items="props">
              <td>{{ props.item.UserId.first_name + ' ' + props.item.UserId.last_name }}</td>
              <td>{{ props.item.UserId.email }}</td>
              <td>
                <ul v-for="(item, index) in props.item.cart" :key="index">
                  <li style="list-style:none;">{{item.ProductId.name}}</li>
                </ul>
              </td>
              <td>
                <ul v-for="(item, index) in props.item.cart" :key="index">
                  <li style="list-style:none;">{{item.quantity}}</li>
                </ul>
              </td>
              <td>{{new Date(props.item.createdAt).toDateString()}}</td>
            </template>
          </v-data-table>
          <!-- END OF TRANSACTIONS TABLE -->
        </center>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      transactions: [],
      cart: [],
      headers: [
        {
          text: "Customer Name",
          align: "left",
          value: "UserId.first_name",
          sortable: false
        },
        {
          text: "E-mail",
          align: "left",
          value: "UserId.email",
          sortable: false
        },
        {
          text: "Products",
          align: "left",
          value: "cart",
          sortable: false
        },
        {
          text: "Amount",
          align: "left",
          value: "quantity",
          sortable: false
        },
        {
          text: "Transaction Date",
          align: "left",
          value: "createdAt"
        }
      ]
    };
  },
  created() {
    let token = localStorage.getItem("token");
    this.$axios
      .get("/transactions", { headers: { token } })
      .then(({ data }) => {
        console.log(data, "==== DARI TRANSACTIONS");
        this.transactions = data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
</style>
