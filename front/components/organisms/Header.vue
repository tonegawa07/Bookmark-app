<template>
  <v-app-bar
  color="light-blue lighten-3" 
  dark 
  app 
  fixed
 >
    <v-toolbar-title>
    <n-link to="/" style="color:white; text-decoration:none;">
       <h1 class="app-title">Knowledge Share</h1>
     </n-link>
    </v-toolbar-title>
    <v-spacer />
    <div class="header-list">
      <!-- loggedInがfalseの時(未ログイン時)のみ表示 -->
      <div class="before-login-box" v-if="!loggedIn">
        <v-btn
          to="/login"
          text
          color="white"
          :outlined="true"
          small
        >
        ログイン
        </v-btn>
        <v-btn
          to="/signup"
          text
          color="white"
          :outlined="true"
          small
        >
        新規登録
        </v-btn>
      </div>
      <!-- loggedInがtrueの時(ログイン時)のみ表示 -->
      <div class="after-login-box" v-if="loggedIn">
        <v-menu
          offset-y
          dense
          nav
        >
          <template v-slot:activator="{on, attrs}">
            <v-avatar
              size="32"
            >
              <img
                v-if="currentUser.avatar_url"
                :src="currentUser.avatar_url"
                alt="Avatar"
                v-on="on"
                v-bind="attrs"
                >
              <img
                v-else
                src="~/assets/image/default-icon.png"
                alt="Avatar"
                v-on="on"
                v-bind="attrs"
                >
            </v-avatar>
          </template>
          <v-list
            dense
          >
            <v-list-item
              v-for="(link, l) in links"
              :key="l"
              :to="link.to"
              exact
            >
              <v-list-item-title>{{ link.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list
            dense
          >
            <v-list-item @click="logOut" key="logOut">
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>
   
<script>
import firebase from '@/plugins/firebase'

export default {

 computed: {
   currentUser () {
     return this.$store.state.currentUser
   },
   links () {
     const links = [
        {
          name: 'マイページ',
          to: `/users/${this.currentUser.id}`
        },
        {
          name: 'アカウント編集',
          to: '/users/edit'
        },
        {
          name: 'プロフィール編集',
          to: '/users/profile'
        }
      ]
      return links
   },
   loggedIn () {
     return this.$store.state.loggedIn
   }
 },

 methods: {
   logOut() {
     firebase
       .auth()
       .signOut()
       .then(() => {
         this.$store.commit("setFlash", {
           status: true,
           message: "ログアウトしました"
         });
         setTimeout(() => {
           this.$store.commit("setFlash", {});
         }, 1500);
        //  this.$store.commit("setUser", null);
         this.$router.push("/login");
       })
       .catch(error => {
         
       });
   }
 },

}
</script>
   
<style>
  .app-title {
 margin-left: 200px;
 font-size: 1.5em;
 letter-spacing: 2px;
}

.header-list {
   display: flex;
   margin-right: 200px;
}

.before-login-box {
  display: flex;
}

@media (max-width: 1024px) {
 .app-title {
   margin-left: 50px;
   font-size: 1.2em;
 }

 .header-list {
   margin-right: 50px;
 }

}

@media (max-width: 480px) {
 .app-title {
   margin-left: 0;
   font-size: 1em;
   letter-spacing: 1px;
 }

 .header-list {
   margin-right: 0;
 }
}
</style>