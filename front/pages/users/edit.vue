<template>
  <v-container>
    <LoginDialog
      :dialog="dialog"
      @closeDialog="dialog = false"
    />
      <v-card class="mx-auto mt-5 pa-5" width="400px">
        <v-card-title>
          <h2 class="signup-title">ユーザー編集</h2>
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="email-box">
              <TextField
                  v-model="email"
                  label="メールアドレス"
                  rules="max:225|required|email"
              />
              <v-row justify="end">
                <v-btn
                  color="light-blue lighten-3"
                  class="white--text"
                  @click="openDialog"
                >変更
                </v-btn>
              </v-row>
            </div>
            <ValidationObserver>
              <div class="password-box">
                <TextField
                    v-model="password"
                    label="変更後のパスワード"
                    rules="required|min:6"
                    :type="show1 ? 'text' : 'password'"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                    vid="password"
                />
                <TextField
                    v-model="passwordConfirm"
                    label="変更後のパスワード(再入力)"
                    rules="required|min:6|confirmed:パスワード"
                    :type="show2 ? 'text' : 'password'"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show2 = !show2"
                />
                <v-row justify="end">
                  <v-btn
                    color="light-blue lighten-3"
                    class="white--text"
                  >変更
                  </v-btn>
                </v-row>
              </div>
            </ValidationObserver>
            <p v-if="error" class="errors">{{error}}</p>
          </v-form>
        </v-card-text>
      </v-card>
  </v-container>
</template>
   
<script>
import firebase from "@/plugins/firebase";
import axios from "@/plugins/axios";
import TextField from '~/components/atoms/TextField.vue'
import LoginDialog from '~/components/organisms/LoginDialog.vue'

export default {

  components: {
    TextField,
    LoginDialog
  },

  data() {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      show1: false,
      show2: false,
      error: '',
      disabled: false,
      dialog: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  mounted() {
    const setDafaultData = () => {
      axios
      .get(`v1/users/${this.currentUser.id}/edit`)
      .then((res) => {
        this.email = res.data.email
      })
    }
    if (this.currentUser.id) {
      setDafaultData()
    } else {
      setTimeout(setDafaultData, 1000)
    }
  },

  methods: {
    changeUserEmail () {
      const user = firebase.auth().currentUser
      this.$store.commit("setLoading", true);

      user.updateEmail(this.email).then(() => {
        axios
        .patch(`/v1/users/${this.currentUser.id}`, {
          user: {email: this.email}
        })
        .then((res) => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setFlash", {
            status: true,
            message: "メールアドレスを変更しました"
          });
          setTimeout(() => {
            this.$store.commit("setFlash", {});
          }, 2000);
        })
      })
      .catch(error => {
        this,error = ( code => {
          switch (code) {
            case "auth/email-already-in-use":
              return "既にそのメールアドレスは使われています";
            case "auth/wrong-password":
              return "※パスワードが正しくありません";
            case "auth/weak-password":
              return "※パスワードは最低6文字以上にしてください";
            default:
              return "※メールアドレスとパスワードをご確認ください";
          }
        })(error.code);
        this.$store.commit("setLoading", false)
      });
    },

    openDialog () {
      this.dialog = true
    }
  },

}
</script>
   
<style>
 .signup-title {
   font-size: 24px;
 }
</style>