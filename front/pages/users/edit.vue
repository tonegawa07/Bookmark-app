<template>
  <ValidationObserver>
    <v-card class="mx-auto mt-5 pa-5" width="400px">
      <v-card-title>
        <h2 class="signup-title">ユーザー編集</h2>
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
            >変更
            </v-btn>
          </v-row>
          <p v-if="error" class="errors">{{error}}</p>
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
        this.name = res.data.name
      })
    }
    if (this.currentUser.id) {
      setDafaultData()
    } else {
      setTimeout(setDafaultData, 1000)
    }
  },

}
</script>
   
<style>
 .signup-title {
   font-size: 24px;
 }
</style>