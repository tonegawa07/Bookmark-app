<template>
  <ValidationObserver>
    <v-card class="mx-auto mt-5 pa-5" width="400px">
      <v-card-title>
        <h1 class="signup-title">ログイン</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <p v-if="error" class="errors">{{error}}</p>
          <TextField
              v-model="email"
              label="メールアドレス"
              rules="max:225|required|email"
          />
          <TextField
              v-model="password"
              label="パスワード"
              rules="required|min:6"
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
              vid="password"
          />
          <v-row justify="center">
            <v-btn
              color="light-blue lighten-3"
              class="mx-auto white--text mt-4"
              @click="login"
            >ログイン
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </ValidationObserver>
</template>
   
<script>
import firebase from "@/plugins/firebase";
import TextField from '../components/atoms/TextField.vue'
export default {

  components: {
    TextField
  },
  data() {
    return {
      email: '',
      password: '',
      show1: false,
      error: ''
    };
  },

  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$store.commit("setFlash", {
            status: true,
            message: "ログインしました"
          });
          setTimeout(() => {
            this.$store.commit("setFlash", {});
          }, 2000);
          this.$router.push("/");
        })
        .catch(error => {
          this.error = (code => {
            switch (code) {
              case "auth/user-not-fount":
                return "メールアドレスが正しくありません";
              case "auth/wrong-password":
                return "※ パスワードが正しくありません";
              default:
                return "※ メールアドレスとパスワードをご確認ください";
            }
          })(error.code);
      });
    }
  },
  fetch ({ redirect, store }) {
    if (store.state.currentUser) {
      return redirect('/')
    }
  },

}
</script>
   
<style>
 .signup-title {
   font-size: 24px;
 }
</style>