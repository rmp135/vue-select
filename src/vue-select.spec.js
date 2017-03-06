/* eslint-env jasmine */

import template from './vue-select.vue'
import Vue from 'vue'
import 'babel-polyfill'

describe('vue-select', () => {
  let Ctor, vm
  beforeEach(() => {
    Ctor = Vue.extend(template)
    vm = new Ctor({ propsData: { suggestions: ['item1', 'item2', 'item3'] } })
  })
  describe('construction', () => {
    it('should pass suggestions prop', () => {
      expect(vm.suggestions).toEqual(['item1', 'item2', 'item3'])
    })
  })
  describe('computed', () => {
    describe('filteredSuggestions', () => {
      it('should return suggestions filtered by \'text\' value', () => {
        vm = new Ctor({ propsData: { suggestions: ['jam', 'ham', 'jar'] } })
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
    })
  })
  describe('watch', () => {
    it('should send an \'change\' event when changed', (done) => {
      const spy = jasmine.createSpy()
      vm.$emit = spy
      vm.text = 'new text'
      Vue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith('change', 'new text')
        done()
      })
    })
  })
  describe('methods', () => {
    describe('onKeyDown', () => {
      it('should set the selectedIndex to max if the current index is too high', () => {
        jasmine.clock().install()
        vm.selectedIndex = 3
        vm.onKeyDown()
        expect(vm.selectedIndex).toBe(3)
        jasmine.clock().tick(0)
        expect(vm.selectedIndex).toBe(2)
        jasmine.clock().uninstall()
      })
      it('should set the selectedIndex to 0 if the current index is too low', () => {
        jasmine.clock().install()
        vm.selectedIndex = -1
        vm.onKeyDown()
        expect(vm.selectedIndex).toBe(-1)
        jasmine.clock().tick(0)
        expect(vm.selectedIndex).toBe(0)
        jasmine.clock().uninstall()
      })
      it('should not change the selectedIndex if the current index is in range', () => {
        jasmine.clock().install()
        vm.selectedIndex = 1
        vm.onKeyDown()
        expect(vm.selectedIndex).toBe(1)
        jasmine.clock().tick(0)
        expect(vm.selectedIndex).toBe(1)
        jasmine.clock().uninstall()
      })
    })
    describe('onDown', () => {
      it('should do nothing if the selectedIndex is at the max value', () => {
        vm.selectedIndex = 2
        vm.onDown()
        expect(vm.selectedIndex).toBe(2)
      })
      it('should increase the selectedIndex if it can be increased', () => {
        vm.selectedIndex = 1
        vm.onDown()
        expect(vm.selectedIndex).toBe(2)
      })
    })
    describe('onUp', () => {
      it('should do nothing if the selectedIndex is at the min value', () => {
        vm.selectedIndex = 0
        vm.onUp()
        expect(vm.selectedIndex).toBe(0)
      })
      it('should decrease the selectedIndex if it can be decreased', () => {
        vm.selectedIndex = 1
        vm.onUp()
        expect(vm.selectedIndex).toBe(0)
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
    })
    describe('onBlur', () => {
      it('should set the \'focused\' property to false', () => {
        vm.focused = true
        vm.onBlur()
        expect(vm.focused).toBe(false)
      })
    })
  })
})
