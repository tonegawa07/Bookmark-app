<template>
  <v-container>
    <LoginDialog
      :dialog="dialog"
      :email="originEmail"
      @closeDialog="dialog = false"
      @loginSuccess="loginSuccess"
    />
      <v-card class="mx-auto mt-5 pa-5" width="400px">
        <v-card-title>
          <h2 class="signup-title">ユーザー編集</h2>
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="email-box">
              <h3 class="edit-h3">メールアドレス</h3>
              <TextField
                  v-model="email"
                  label="メールアドレス"
                  rules="max:225|required|email"
              />
              <v-row justify="end">
                <v-btn
                  color="light-blue lighten-3"
                  class="white--text"
                  @click="openDialogForEmail"
                >変更
                </v-btn>
              </v-row>
            </div>
            <ValidationObserver>
              <div class="password-box">
                <h3 class="edit-h3">パスワード</h3>
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
                <v-row justify="end">
                  <v-btn
                    color="light-blue lighten-3"
                    class="white--text"
                    @click="openDialogForPassword"

                  >変更
                  </v-btn>
                </v-row>
              </div>
            </ValidationObserver>
            <p v-if="error" class="errors">{{error}}</p>
          </v-form>
              <div class="user-destroy-box">
                <h3 class="edit-h3">アカウントを削除する</h3>
                <v-row justify="center">
                  <v-btn
                    color="white--text red accent-3"
                    @click="openDialogForDeleteAccount"
                  >削除
                  </v-btn>
                </v-row>
              </div>
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
      originEmail: '',
      password: '',
      passwordConfirm: '',
      show1: false,
      show2: false,
      error: '',
      dialog: false,
      isEmail: false,
      isPassword: false,
      isDeleteAccount: false,
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  mounted() {
    // setDefaultDataという関数を定義
    const setDafaultData = () => {
      axios
      .get(`v1/users/${this.currentUser.id}`)
      .then((res) => {
        this.email = res.data.email
        this.originEmail = res.data.email
      })
    }
    if (this.currentUser.id) {
      setDafaultData()
    } else {
      setTimeout(setDafaultData, 1000)
    }
  },

  methods: {
    loginSuccess () {
      if (this.isEmail) {
        this.isEmail = false
        this.changeUserEmail()
      } else if (this.isPassword) {
        this.isPassword = false
        this.changeUserPassword()
      } else if (this.isDeleteAccount) {
        this.isDeleteAccount = false
        this.destroyUser()
      }
    },
    changeUserEmail () {
      // ログイン中ユーザーをuserに代入
      const user = firebase.auth().currentUser
      this.$store.commit("setLoading", true);

      user.updateEmail(this.email).then(() => {
        axios
        .patch(`/v1/users/${this.currentUser.id}`, {
          user: {email: this.email}
        })
        .then((res) => {
          this.$store.commit("setLoading", false);
          this.originEmail = res.data.email
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
        this.error = ( code => {
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
    changeUserPassword () {
      // ログイン中ユーザーをuserに代入
      const user = firebase.auth().currentUser
      this.$store.commit("setLoading", true);

      user.updatePassword(this.password).then(() => {
        this.$store.commit("setLoading", false);
        this.$store.commit("setFlash", {
            status: true,
            message: "パスワードを変更しました"
        });
        this.password = ''
        this.passwordConfirm = ''
        setTimeout(() => {
          this.$store.commit("setFlash", {});
        }, 2000);
      }).catch(error => {
        this.$store.commit('setLoading', false)
      });
    },
    destroyUser() {
      // ログイン中ユーザーをuserに代入
      const user = firebase.auth().currentUser
      this.$store.commit("setLoading", true);
      user.delete().then(() => {
        axios
        .delete(`/v1/users/${this.currentUser.id}`, {user})
        .then(() => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setFlash", {
            status: true,
            message: "ユーザーを削除しました"
          });
          setTimeout(() => {
            this.$store.commit("setFlash", {});
          }, 2000);
          this.$router.push("/");
        })
      }).catch(function(error) {

      });
    },
    openDialogForEmail () {
      this.isEmail = true
      this.dialog = true
    },
    openDialogForPassword () {
      this.isPassword = true
      this.dialog = true
    },
    openDialogForDeleteAccount () {
      this.isDeleteAccount = true
      this.dialog = true
    }
  },
    // ログインしていないユーザーはリダイレクトされる
  fetch ({ redirect, store }) {
    store.watch(
      state => state.currentUser,
      (newuser, olduser) => {
        if (!newuser) {
          return redirect('/login')
        }
      }
    )
  },


}
</script>
   
<style>
  .signup-title {
    font-size: 24px;
  }

  .password-box {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px dashed #B3E5FC;
  }

  .user-destroy-box {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px dashed#B3E5FC;
 }
</style>