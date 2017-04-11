<style lang="scss">
  .vue-select {
    cursor: default;
    width: 200px;
    input {
      width: inherit;
    }
    .suggestions {
      width: inherit;
      position: absolute;
      overflow-y: auto;
    }
  }
</style>
<template lang="pug">
  .vue-select
    input(:placeholder="placeholder", v-model="text", @keydown.down="onDown", @keydown.up="onUp", @keydown.tab.enter="onTab", @focus="onFocus", @blur="onBlur")
    .suggestions(ref="suggestions" v-show="!isHidden")
      .suggestion(v-for="suggestion, index in filteredSuggestions", :class="{ selected: index == selectedIndex }", @mousedown.prevent="onClick(suggestion, index)") {{suggestion}}
</template>
<script>
  export default {
    props: {
      value: {
        type: String,
        required: false,
        default: ''
      },
      suggestions: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        selectedIndex: 0,
        text: '',
        focused: false,
        hasInitialised: false
      }
    },
    mounted () {
      if (this.value === '') {
        this.hasInitialised = true
      }
      this.text = this.value
    },
    computed: {
      filteredSuggestions () {
        return this.suggestions.filter(s => s.toLowerCase().includes(this.text.toLowerCase()))
      },
      isHidden () {
        return !this.focused || this.filteredSuggestions.length === 1 && this.filteredSuggestions[this.filteredSuggestions.length - 1] === this.text
      }
    },
    watch: {
      value (value) {
        this.text = value
      },
      text (value) {
        if (this.hasInitialised) {
          this.$emit('input', value)
        }
        this.hasInitialised = true
      },
      suggestions () {
        this.selectedIndex = 0
      },
      filteredSuggestions () {
        this.selectedIndex = 0
        this.scroll()
      }
    },
    methods: {
      scroll () {
        this.$nextTick(() => {
          const selectedEl = this.$refs.suggestions.children[this.selectedIndex]
          if (selectedEl == null) return
          if (this.filteredSuggestions.length === 0) return
          if (selectedEl.offsetTop < this.$refs.suggestions.scrollTop) {
            this.$refs.suggestions.scrollTop = selectedEl.offsetTop
          } else if (selectedEl.offsetTop + selectedEl.clientHeight > this.$refs.suggestions.scrollTop + this.$refs.suggestions.clientHeight) {
            this.$refs.suggestions.scrollTop = selectedEl.offsetTop + selectedEl.clientHeight - this.$refs.suggestions.clientHeight
          }
        })
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
        }
      },
      onFocus (e) {
        this.selectedIndex = 0
        this.scroll()
        this.focused = true
      },
      onBlur (e) {
        this.focused = false
      },
      onClick (selected, index) {
        this.selectedIndex = index
        this.text = selected
      }
    }
  }
</script>
