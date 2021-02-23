<template>
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
    />
    <v-row justify="end">
      <v-btn
        color="light-blue lighten-3"
        class="white--text"
      >変更
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import FileInput from '~/components/atoms/FileInput.vue'
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
    }
  },

}
</script>

<style>

</style>