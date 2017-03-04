import template from './vue-comp-template.vue'
import Vue from 'vue'

describe('suite', () => {
  it('should do something', () => {
    const Ctor = Vue.extend(template)
    const vm = new Ctor()
    expect(vm.foo).toBe("bar")
  });
});
