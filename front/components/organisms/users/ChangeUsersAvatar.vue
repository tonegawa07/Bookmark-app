<template>
  <ValidationObserver ref="obs" v-slot="ObserberProps">
    <div class="user-avatar-box">
      <h3 class="edit-h3">アバター画像</h3>
      <v-row justify="center">
        <v-avatar
          v-if="uploadImageUrl"
          size="62"
        >
        <img
          :src="uploadImageUrl"
          alt="Avatar"
        />
        </v-avatar>
      </v-row>
      <FileInput
        v-model="avatar"
        label="画像をアップロードしてください"
        accept="image/*"
        :rules="rules"
        @change="onImagePicked"
        :disabled="ObserberProps.invalid || !ObserberProps.validated"
      />
      <v-row justify="end">
        <v-btn
          color="light-blue lighten-3"
          class="white--text"
          @click="changeUsersAvatar"
        >変更
        </v-btn>
      </v-row>
    </div>
  </ValidationObserver>
</template>

<script>
import FileInput from '~/components/atoms/FileInput.vue'
import axios from '@/plugins/axios'

export default {
  
  components: {
    FileInput
  },

  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
  },

  data () {
    return {
      avatar: [],
      uploadImageUrl: ''
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
  },

  methods: {
    attachingImg () {
      console.log(this.avatar)
    },
    onImagePicked(file) {
      if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.uploadImageUrl = fr.result
        })
      } else {
        this.uploadImageUrl = ''
      }
    },
    changeUsersAvatar () {
      this.$store.commit("setLoading", true);
      // 空のFormDataオブジェクトを生成
      const formData = new FormData()
      // appendでキーと値の組を追加
      formData.append('avatar', this.avatar)
      // 変数configにheaderを設定
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      axios
      // patchの引数(url, data, config)
      .patch(`v1/users/${this.currentUser.id}/update_avatar`, formData, config)
      .then((res) => {
        this.avatar = res.data.avatar
        this.$store.commit("setUserAvatarUrl", res.data.avatar_url)
        this.$store.commit("setLoading", false);
        this.$store.commit("setFlash", {
          status: true,
          message: "アバターを変更しました"
        });
        setTimeout(() => {
          this.$store.commit("setFlash", {});
        }, 2000);
      })
      .catch((error) => {
        this.$store.commit("setLoading", false);
      })
    }
  },

}
</script>

<style>

</style>