<template>
  <ValidationProvider
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors, valid }"
    :vid="$attrs.label"
  >
    <v-textarea
    clearable
    clear-icon="mdi-close-circle"
    :label="$attrs.label"
    rows="10"
    counter
    v-model="inputValue"
    :error-messages="errors"
    :success="valid"
    v-bind="$attrs"
    v-on="$listeners"
    >
    </v-textarea>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: null
    }
  },
  
  data () {
    return {
    }
  },

  computed: {
    inputValue: {
      get () {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  
}
</script>

<style>
  
</style>