<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-on:submit.prevent="register"
          style="margin-top:5%"
        >
          <center>
            <h2>Start Shopping Now!</h2>
          </center>

          <!-- FIRST NAME -->
          <v-text-field
            v-model="first_name"
            :counter="10"
            :rules="nameRules"
            label="First Name"
            required
          ></v-text-field>
          <!-- END OF FIRST NAME -->

          <!-- LAST NAME -->
          <v-text-field
            v-model="last_name"
            :counter="10"
            :rules="nameRules"
            label="Last Name"
            required
          ></v-text-field>
          <!-- END OF LAST NAME -->

          <!-- EMAIL -->
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <!-- END OF EMAIL -->

          <!-- PASSWORD -->
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
          <!-- END OF PASSWORD -->

          <!-- SUBMIT BUTTON -->
          <v-btn color="info" type="submit">Register!</v-btn>
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
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    valid: true,
    show1: false,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters"
    }
  }),

  methods: {
    reset() {
      this.$refs.form.reset();
    },
    register() {
      const { first_name, last_name, email, password } = this;
      this.$axios
        .post(`/users/signUp`, {
          first_name,
          last_name,
          email,
          password
        })
        .then(({ data }) => {
          this.$swal(data.message, "Welcome aboard!", "success");
          this.first_name = "";
          this.last_name = "";
          this.email = "";
          this.password = "";
          this.$router.push("/");
        })
        .catch(err => {
          const { errors } = err.response.data;
          let errorMessages = [];
          for (let key in errors) errorMessages.push(errors[key].message);
          errorMessages = errorMessages.join("\n");
          this.$swal("Oops...", errorMessages, "error");
          this.first_name = "";
          this.last_name = "";
          this.email = "";
          this.password = "";
        });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 30% !important;
  margin-top: 6%;
}
</style>