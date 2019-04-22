<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-on:submit.prevent="login"
          style="margin-top:25%"
        >
          <center>
            <h2>Continue Your Cleat Hunt!</h2>
          </center>

          <!-- EMAIL -->
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <!-- END OF EMAIL -->

          <!-- PASSWORD -->
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            :rules="[rules.required]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
          <!-- END OF PASSWORD -->

          <!-- SUBMIT BUTTON -->
          <v-btn color="info" type="submit">Let's Go!</v-btn>
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
    email: "",
    password: "",
    valid: true,
    show1: false,
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    rules: {
      required: value => !!value || "Required."
    }
  }),
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    login() {
      const { email, password } = this;
      this.$axios
        .post(`/users/signIn`, {
          email,
          password
        })
        .then(({ data }) => {
          const { token, details } = data;
          const { email, id, role } = details;
          localStorage.setItem("token", token);
          localStorage.setItem("email", email);
          localStorage.setItem("UserId", id);
          localStorage.setItem("role", role);
          this.$emit("success-login", role);
          this.$swal(data.message, "Welcome back!", "success");
          if (role == "admin") this.$router.push("/admin");
          else this.$router.push("/store");
        })
        .catch(err => {
          const { message } = err.response.data;
          this.$swal("Error!", message, "error");
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