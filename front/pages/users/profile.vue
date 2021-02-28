<template>
  <v-container>
    <v-card class="mx-auto mt-5 pa-5" width="400px">
      <v-card-title>
        <h2 class="user-edit-title">プロフィール編集</h2>
      </v-card-title>
      <v-card-text>
        <v-form>
          <ChangeUsersAvatar
            v-model="currentAvatarUrl"
            rules="size:300"
          />
          <ChangeUsersName
            v-model="name"
            label="名前"
            rules="max:30|required"
          />
          <ChangeUsersProfile
            v-model="profile"
            label="プロフィール文"
            rules="max:140"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";
import ChangeUsersName from '~/components/organisms/users/ChangeUsersName.vue'
import ChangeUsersProfile from '~/components/organisms/users/ChangeUsersProfile.vue'
import ChangeUsersAvatar from '~/components/organisms/users/ChangeUsersAvatar.vue'

export default {

  components: {
    ChangeUsersName,
    ChangeUsersProfile,
    ChangeUsersAvatar
  },

  data () {
    return {
      name: '',
      profile: '',
      avatar: '',
      currentAvatarUrl: ''
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  mounted() {
    // setDefaultDataという関数を定義
    const setDefaultData = () => {
      axios
      .get(`v1/users/${this.currentUser.id}`)
      .then((res) => {
        this.name = res.data.name
        this.profile = res.data.profile
        this.currentAvatarUrl = res.data.avatar_url
      })
    }
    if (this.currentUser.id) {
      setDefaultData()
    } else {
      setTimeout(setDefaultData, 1000)
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

</style>