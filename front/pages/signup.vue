<template>
  <ValidationObserver>
    <v-card class="mx-auto mt-5 pa-5" width="400px">
      <v-card-title>
        <h1 class="signup-title">新規登録</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <TextField
              v-model="name"
              label="名前"
              rules="max:20|required"
          />
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
          <TextField
              v-model="passwordConfirm"
              label="パスワード(再入力)"
              rules="required|min:6|confirmed:パスワード"
              :type="show2 ? 'text' : 'password'"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show2 = !show2"
          />

          <v-row justify="center">
            <v-btn
              color="light-blue lighten-3"
              class="mx-auto white--text mt-4"
              @click="signup"
            >新規登録
            </v-btn>
          </v-row>
          
        </v-form>
      </v-card-text>
    </v-card>
  </ValidationObserver>
</template>
   
<script>
import firebase from "@/plugins/firebase";
import axios from "@/plugins/axios";
import TextField from '~/components/atoms/TextField.vue'
export default {

  components: {
    TextField
  },
  data() {
    return {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
      show1: false,
      show2: false,
      error: ''
    };
  },

  methods: {
    signup() {
      if (this.password !== this.passwordConfirm) {
        this.error = "※ パスワードとパスワード確認が一致していません";
      }
      this.$store.commit("setLoading", true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(res => {
          const user = {
            email: res.user.email,
            name: this.name,
            uid: res.user.uid
          };
          axios.post("/v1/users", { user }).then((res) => {
            this.$store.commit("setLoading", false);
            this.$store.commit("setUser", res.data);
            this.$store.commit("setFlash", {
              status: true,
              message: "ログインしました"
            });
            setTimeout(() => {
              this.$store.commit("setFlash", {});
            }, 2000);
            this.$router.push("/");
          })
        })
        .catch(error => {
          this.error = (code => {
            switch (code) {
              case "auth/email-already-in-use":
                return "既にそのメールアドレスは使われています";
              case "auth/wrong-password":
                return "※ パスワードが正しくありません";
              case "auth/weak-password":
                return "※ パスワードは最低6文字以上にしてください";
              default:
                return "※ メールアドレスとパスワードをご確認ください";
            }
          })(error.code);
          this.$store.commit("setLoading", false)
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