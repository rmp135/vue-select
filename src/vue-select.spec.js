/* eslint-env jasmine */

import template from './vue-select.vue'
import Vue from 'vue'
import 'babel-polyfill'

describe('vue-select', () => {
  let Ctor, vm
  beforeEach(() => {
    Ctor = Vue.extend(template)
    vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item3'] } }).$mount()
  })
  describe('construction', () => {
    it('should pass suggestions prop', () => {
      expect(vm.suggestions).toEqual(['item1', 'item2', 'item3'])
    })
    it('should set the text to the value prop', () => {
      vm = new Ctor({ propsData: { suggestions: [], value: 'something' } }).$mount()
      expect(vm.text).toBe('something')
    })
    it('should set the text to an empty string if the value prop is not provided', () => {
      vm = new Ctor({ propsData: { suggestions: [] } }).$mount()
      expect(vm.text).toBe('')
    })
    it('should not trigger an event on initialisation', () => {
      vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item3'], value: 'something' } })
      vm.$emit = jasmine.createSpy()
      vm.$mount()
      expect(vm.$emit).not.toHaveBeenCalled()
    })
  })
  describe('computed', () => {
    describe('filteredSuggestions', () => {
      it('should return suggestions filtered by \'text\' value', () => {
        vm = new Ctor({ propsData: { suggestions: ['jam', 'ham', 'jar'] } }).$mount()
        vm.text = 'am'
        expect(vm.filteredSuggestions).toEqual(['jam', 'ham'])
      })
      it('should return all suggestions if \'text\' is blank', () => {
        vm.text = ''
        expect(vm.filteredSuggestions).toEqual(['item1', 'item2', 'item3'])
      })
      it('should return a blank array if nothing matches', () => {
        vm.text = 'qwer'
        expect(vm.filteredSuggestions).toEqual([])
      })
      it('should filter case insensitive', () => {
        vm = new Ctor({ propsData: { suggestions: ['item1', 'ITEM2', 'iTEm3', 'something else'] } }).$mount()
        vm.text = 'ITEM'
        expect(vm.filteredSuggestions).toEqual(['item1', 'ITEM2', 'iTEm3'])
      })
    })
    describe('isHidden', () => {
      it('should be true when the component is not focused', () => {
        vm.focused = false
        expect(vm.isHidden).toBe(true)
      })
      it('should be false when the component is focused and the filteredSuggestions is greater than 1', () => {
        vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item3'] } }).$mount()
        vm.text = ''
        vm.focused = true
        expect(vm.isHidden).toBe(false)
      })
      it('should be false when the component is focused and the filteredSuggestions is 1 and not equal to the suggestion', () => {
        vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item33'] } }).$mount()
        vm.text = 'item3'
        vm.focused = true
        expect(vm.isHidden).toBe(false)
      })
      it('should be true when the component is focused and the filteredSuggestions is 1 and equal to the suggestion', () => {
        vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item33'] } }).$mount()
        vm.text = 'item33'
        vm.focused = true
        expect(vm.isHidden).toBe(true)
      })
    })
  })
  describe('watch', () => {
    describe('test', () => {
      it('should send an \'input\' event when changed after initialisation', (done) => {
        const spy = jasmine.createSpy()
        vm.$emit = spy
        vm.hasInitialised = true
        vm.text = 'new text'
        Vue.nextTick(() => {
          expect(spy).toHaveBeenCalledWith('input', 'new text')
          done()
        })
      })
    })
    describe('suggestions', () => {
      it('should set the selectedIndex back to 0 when changed', (done) => {
        vm.selectedIndex = 1
        vm.suggestions = ['item', 'item2']
        Vue.nextTick(() => {
          expect(vm.selectedIndex).toBe(0)
          done()
        })
      })
    })
  })
  describe('methods', () => {
    describe('onDown', () => {
      it('should do nothing if the selectedIndex is at the max value', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = 2
        vm.onDown()
        expect(vm.selectedIndex).toBe(2)
        expect(vm.scroll).not.toHaveBeenCalled()
      })
      it('should do nothing if the selectedIndex is greater the max value', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = 3
        vm.onDown()
        expect(vm.selectedIndex).toBe(2)
        expect(vm.scroll).not.toHaveBeenCalled()
      })
      it('should increase the selectedIndex if it can be increased', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = 1
        vm.onDown()
        expect(vm.selectedIndex).toBe(2)
        expect(vm.scroll).toHaveBeenCalled()
      })
    })
    describe('onUp', () => {
      it('should do nothing if the selectedIndex is at the min value', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = 0
        vm.onUp()
        expect(vm.selectedIndex).toBe(0)
        expect(vm.scroll).not.toHaveBeenCalled()
      })
      it('should do nothing if the selectedIndex is less than the min value', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = -1
        vm.onUp()
        expect(vm.selectedIndex).toBe(0)
        expect(vm.scroll).not.toHaveBeenCalled()
      })
      it('should decrease the selectedIndex if it can be decreased', () => {
        vm.scroll = jasmine.createSpy()
        vm.selectedIndex = 1
        vm.onUp()
        expect(vm.selectedIndex).toBe(0)
        expect(vm.scroll).toHaveBeenCalled()
      })
    })
    describe('onTab', () => {
      it('should set the text to the selected item if available', () => {
        vm.selectedIndex = 1
        vm.onTab()
        expect(vm.text).toBe('item2')
      })
      it('should not change the text if the selected item cannot be found', () => {
        vm.text = 'item'
        vm.selectedIndex = -1
        expect(vm.text).toBe('item')
      })
    })
    describe('onFocus', () => {
      it('should set the \'focused\' property to true', () => {
        vm.focused = false
        vm.onFocus()
        expect(vm.focused).toBe(true)
      })
      it('should set selectedIndex back to 0', () => {
        vm.focused = 1
        vm.onFocus()
        expect(vm.selectedIndex).toBe(0)
      })
    })
    describe('onBlur', () => {
      it('should set the \'focused\' property to false', () => {
        vm.$mount()
        vm.focused = true
        vm.onBlur()
        expect(vm.focused).toBe(false)
      })
    })
    describe('onClick', () => {
      it('should set the selectedIndex to the item that was selected', () => {
        vm.selectedIndex = 1
        vm.onClick('selected', 2)
        expect(vm.selectedIndex).toBe(2)
      })
      it('should set the text to the selected item', () => {
        vm.text = 'an item'
        vm.onClick('a different item')
        expect(vm.text).toBe('a different item')
      })
    })
  })
})
