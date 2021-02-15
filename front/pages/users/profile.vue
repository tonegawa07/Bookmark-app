<template>
  <v-container>
    <v-card class="mx-auto mt-5 pa-5" width="400px">
      <v-card-title>
        <h2 class="user-edit-title">プロフィール編集</h2>
      </v-card-title>
      <v-card-text>
        <v-form>
          <div class="username-box">
            <h3 class="edit-h3">名前</h3>
            <TextField
            v-model="name"
            label="名前"
            rules="max:30|required"
            />
            <v-row justify="end">
              <v-btn
              color="light-blue lighten-3"
              class="white--text"
              @click="changeUsersName"
              >変更
              </v-btn>
            </v-row>
          </div>
          <div class="profile-box">
            <h3 class="edit-h3">プロフィール文</h3>
            <TextArea
            v-model="profile"
            label="プロフィール文"
            rules="max:140"
            />
            <v-row justify="end">
              <v-btn
              color="light-blue lighten-3"
              class="white--text"
              @click="changeUsersProfile"
              >変更
              </v-btn>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";
import TextField from '~/components/atoms/TextField.vue'

export default {

  components: {
    TextField,
  },

  data () {
    return {
      name: '',
      profile: '',
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    changeUsersName () {
      const user = {
        name: this.name
      }
      this.$store.commit("setLoading", true);

      axios
      .patch(`v1/users/${this.currentUser.id}`, {user})
      .then((res) => {
        this.name = res.data.name
        this.$store.commit("setUserName", res.data.name)
        this.$store.commit("setLoading", false);
        this.$store.commit("setFlash", {
          status: true,
          message: "名前を変更しました"
        });
        setTimeout(() => {
          this.$store.commit("setFlash", {});
        }, 2000);
      })
    },
    changeUsersProfile () {
      const user = {
        profile: this.profile
      }
      this.$store.commit("setLoading", true);

      axios
      .patch(`v1/users/${this.currentUser.id}`, {user})
      .then((res) => {
        this.profile = res.data.profile
        this.$store.commit("setUserProfile", res.data.profile)
        this.$store.commit("setLoading", false);
        this.$store.commit("setFlash", {
          status: true,
          message: "プロフィール文を変更しました"
        });
        setTimeout(() => {
          this.$store.commit("setFlash", {});
        }, 2000);
      })
    }
  },

  mounted() {
    const setDefaultData = () => {
      axios
      .get(`v1/users/${this.currentUser.id}/edit`)
      .then((res) => {
        this.name = res.data.name
        this.profile = res.data.profile
      })
    }
    if (this.currentUser.id) {
      setDefaultData()
    } else {
      setTimeout(setDefaultData, 1000)
    }
  },
  
}
</script>

<style>
  .profile-message-btn {
    margin-top: 16px;
    }
</style>