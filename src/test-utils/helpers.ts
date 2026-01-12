import { mount, type MountingOptions } from "@vue/test-utils";
import type { Component } from "vue";

/**
 * Helper function to mount Vue components with PrimeVue stubs
 * This makes tests faster and avoids PrimeVue complexity
 */
export function mountWithStubs<T extends Component>(
  component: T,
  options?: MountingOptions<InstanceType<T>>
) {
  return mount(component, {
    global: {
      stubs: {
        // PrimeVue components - stub them for simpler tests
        InputText: {
          template:
            '<input :data-testid="$attrs[\'data-testid\']" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ["modelValue", "placeholder"],
          emits: ["update:modelValue"],
        },
        Textarea: {
          template:
            '<textarea :data-testid="$attrs[\'data-testid\']" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ["modelValue"],
          emits: ["update:modelValue"],
        },
        InputNumber: {
          template:
            '<input type="number" :data-testid="$attrs[\'data-testid\']" :value="modelValue" @input="$emit(\'update:modelValue\', parseFloat($event.target.value) || 0)" />',
          props: ["modelValue"],
          emits: ["update:modelValue"],
        },
        Select: {
          template:
            '<select :data-testid="$attrs[\'data-testid\']" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-if="options" v-for="opt in options" :key="opt[optionValue] || opt" :value="opt[optionValue] || opt">{{ opt[optionLabel] || opt }}</option></select>',
          props: [
            "modelValue",
            "options",
            "optionLabel",
            "optionValue",
            "placeholder",
          ],
          emits: ["update:modelValue"],
        },
        Button: {
          template:
            '<button :data-testid="$attrs[\'data-testid\']" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
          props: ["label", "disabled", "loading"],
          emits: ["click"],
        },
        Dialog: {
          template:
            '<div v-if="visible" data-testid="$attrs[\'data-testid\']"><slot /><slot name="footer" /></div>',
          props: ["visible"],
        },
        Message: {
          template: "<div><slot /></div>",
          props: ["severity", "closable"],
        },
        ProgressSpinner: {
          template: "<div>Loading...</div>",
        },
        Card: {
          template: '<div><slot name="header" /><slot name="content" /></div>',
        },
        Tag: {
          template: "<span><slot /></span>",
          props: ["value", "severity"],
        },
        ConfirmDialog: {
          template: "<div></div>",
        },
        Paginator: {
          template: "<div><slot /></div>",
          props: ["first", "rows", "totalRecords"],
        },
      },
    },
    ...options,
  });
}
