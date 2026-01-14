import { mount, type MountingOptions } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { vi } from "vitest";
import type { ProductRepository } from "@/domain/product/ProductRepository";

/**
 * Helper function to mount Vue components with PrimeVue stubs
 * This makes tests faster and avoids PrimeVue complexity
 */
export function mountWithStubs<T extends DefineComponent>(
  component: T,
  options?: MountingOptions<InstanceType<T>>
) {
  return mount(
    component as unknown as T,
    {
      global: {
        stubs: {
          // PrimeVue components - stub them for simpler tests
          InputText: {
            template:
              '<input :data-testid="$attrs[\'data-testid\']" :value="modelValue" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />',
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
              '<button :data-testid="$attrs[\'data-testid\']" :disabled="disabled || loading" @click="$emit(\'click\')">{{ label || "" }}<slot /></button>',
            props: ["label", "disabled", "loading"],
            emits: ["click"],
          },
          Dialog: {
            template:
              '<div v-if="visible" :data-testid="$attrs[\'data-testid\']"><slot /><slot name="footer" /></div>',
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
            template:
              '<div><slot name="header" /><slot name="content" /></div>',
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
      // Type assertion needed due to complex type inference when combining stubs with options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );
}

/**
 * Creates a mock ProductRepository with all methods mocked
 * Useful for testing use cases without a real repository implementation
 */
export function createMockProductRepository(): ProductRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCategory: vi.fn(),
    search: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
    existsByTitle: vi.fn(),
  };
}
