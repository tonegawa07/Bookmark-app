import firebase from "@/plugins/firebase"
import axios from "@/plugins/axios"
export const setUserParameter = (user, store) => {
  async function setUser (user, store) {
    if (user) {
        const { data } = await axios.get(`/v1/users?uid=${user.uid}`)
        const userParams = data
        store.commit("setUser", userParams)
        // ログイン時にloggedInをtrueにする
        store.commit("setLoggedIn", true)
      } else {
        // ログアウト時にはloggedInがfalseになる
        store.commit("setUser", null)
        store.commit("setLoggedIn", false)
    }
  }
  setUser(user, store)
}

const authCheck = ({ store, redirect }) => {
   firebase.auth().onAuthStateChanged(async user => {
     await setUserParameter(user, store)
   })
}

export default authCheck