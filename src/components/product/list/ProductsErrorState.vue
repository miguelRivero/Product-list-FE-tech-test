<template>
  <Message severity="error" :closable="true" @close="$emit('close')">
    {{ error }}
  </Message>
</template>

<script setup lang="ts">
import Message from "primevue/message";

defineProps<{
  error: string;
}>();

defineEmits<{
  close: [];
}>();
</script>
