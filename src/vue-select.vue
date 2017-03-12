<template lang="pug">
  .vue-select
    input(v-model="text", @keydown.down="onDown", @keydown.up="onUp", @keydown.tab.enter="onTab", @focus="onFocus", @blur="onBlur")
    .suggestions(ref="suggestions" v-show="focused")
      .suggestion(v-for="suggestion, index in filteredSuggestions", :class="{ selected: index == selectedIndex }", @mousedown="onClick(suggestion)") {{suggestion}}
</template>
<style lang="scss">
  .vue-select {
    width: 200px;
    input {
      width: inherit;
    }
    .suggestions {
      width: inherit;
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
      scroll () {
        const selectedEl = this.$refs.suggestions.children[this.selectedIndex]
        if (selectedEl.offsetTop < this.$refs.suggestions.scrollTop) {
          this.$refs.suggestions.scrollTop = selectedEl.offsetTop
        } else if (selectedEl.offsetTop + selectedEl.clientHeight > this.$refs.suggestions.scrollTop + this.$refs.suggestions.clientHeight) {
          this.$refs.suggestions.scrollTop = selectedEl.offsetTop + selectedEl.clientHeight - this.$refs.suggestions.clientHeight
        }
      },
      onDown (e) {
        if (this.selectedIndex >= this.filteredSuggestions.length) {
          this.selectedIndex = this.filteredSuggestions.length - 1
        }
        if (this.selectedIndex === this.filteredSuggestions.length - 1) return
        this.selectedIndex++
        this.scroll()
      },
      onUp (e) {
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0
        }
        if (this.selectedIndex === 0) return
        this.selectedIndex--
        this.scroll()
      },
      onTab (e) {
        if (this.filteredSuggestions.length > 0) {
          this.text = this.filteredSuggestions[this.selectedIndex]
          this.selectedIndex = 0
        }
      },
      onFocus (e) {
        this.focused = true
      },
      onBlur (e) {
        this.$refs.suggestions.scrollTop = 0
        this.focused = false
      },
      onClick (selected) {
        this.selectedIndex = 0
        this.text = selected
      }
    }
  }
</script>
