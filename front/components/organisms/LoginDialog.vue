<template>
  <v-dialog
  v-model="dialogStatus"
  max-width="400px"
  persistent
  >
    <v-card width="500px" class="mx-auto">
      <v-card-title>
        <h4 class="user-edit-title">再認証</h4>
      </v-card-title>
      <p>hoge</p>
      <v-btn @click="closeDialog">閉じる</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  props: {
    dialog: {
      type: Boolean,
      requered: true
    },
  },
  
  data () {
    return {
      dialogStatus: this.dialog,
    }
  },

  watch: {
    dialog (newValue) {
      this.dialogStatus = newValue
    }
  },

  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style>
  
</style>