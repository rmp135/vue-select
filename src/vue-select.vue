<template lang="pug">
  .vue-select
    input(v-model="text", @keydown.down="onDown", @keydown.up="onUp", @keydown="onKeyDown", @keydown.tab.enter="onTab", @focus="onFocus", @blur="onBlur")
    .suggestions(v-show="focused")
      .suggestion(v-for="suggestion, index in filteredSuggestions", :class="{ selected: index == selectedIndex }") {{suggestion}}
</template>
<style lang="scss">
  .vue-select {
    width: 200px
    input {
      width: inherit;
    }
    .suggestions {
      position: absolute;
    }
  }
</style>
<script>
  export default {
    props: {
      suggestions: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        selectedIndex: 0,
        text: '',
        focused: false
      }
    },
    computed: {
      filteredSuggestions () {
        return this.suggestions.filter(s => s.includes(this.text))
      }
    },
    watch: {
      text (value) {
        this.$emit('change', value)
      }
    },
    methods: {
      onKeyDown (e) {
        // Allows the onDown and onUp handlers to fire firxt.
        setTimeout(() => {
          if (this.selectedIndex >= this.filteredSuggestions.length) {
            this.selectedIndex = this.filteredSuggestions.length - 1
          } else if (this.selectedIndex === -1) {
            this.selectedIndex = 0
          }
        }, 0)
      },
      onDown (e) {
        if (this.selectedIndex === this.filteredSuggestions.length - 1) return
        this.selectedIndex++
      },
      onUp (e) {
        if (this.selectedIndex === 0) return
        this.selectedIndex--
      },
      onTab (e) {
        if (this.selectedIndex !== -1) {
          this.text = this.filteredSuggestions[this.selectedIndex]
        }
      },
      onFocus (e) {
        this.focused = true
      },
      onBlur (e) {
        this.focused = false
      }
    }
  }
</script>
