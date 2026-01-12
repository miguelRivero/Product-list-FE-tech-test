<template>
  <Select
    v-model="selectedValue"
    :options="options"
    :option-label="optionLabel"
    :option-value="optionValue"
    :placeholder="placeholder"
    :filter="filter"
    :filter-placeholder="filterPlaceholder"
    :show-clear="showClear"
    :class="selectClass"
    :data-testid="dataTestId"
    :aria-label="ariaLabel"
  >
    <template #value="slotProps">
      <slot
        name="value"
        :value="slotProps.value"
        :label="getLabel(slotProps.value)"
      >
        <span>{{ getLabel(slotProps.value) || placeholder }}</span>
      </slot>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Select from "primevue/select";

interface Props {
  modelValue: string | number | null;
  options: Array<Record<string, unknown>>;
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  showClear?: boolean;
  selectClass?: string;
  dataTestId?: string;
  ariaLabel?: string;
  getLabel?: (value: string | number | null) => string;
}

const props = withDefaults(defineProps<Props>(), {
  optionLabel: "label",
  optionValue: "value",
  placeholder: "Select...",
  filter: false,
  showClear: false,
  selectClass: "",
  dataTestId: "base-select",
  ariaLabel: "Select option",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
}>();

const selectedValue = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
});

const getLabel = (value: string | number | null): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (props.getLabel) {
    return props.getLabel(value);
  }

  const option = props.options.find(opt => opt[props.optionValue] === value);
  return option?.[props.optionLabel] || "";
};
</script>
