<template>
  <Dialog
    :visible="visible"
    header="Delete Product"
    :modal="true"
    :style="{ width: '500px' }"
    class="delete-confirmation-dialog"
    data-testid="delete-confirmation-dialog"
    @update:visible="handleClose"
  >
    <div class="delete-dialog-content">
      <p class="delete-message">
        Are you sure you want to delete <strong>"{{ productTitle }}"</strong>?
        This action cannot be undone.
      </p>

      <div v-if="errorMessage" class="delete-error-message">
        {{ errorMessage }}
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer-content">
        <div class="dialog-message-container">
          <span v-if="successMessage" class="dialog-success-message">
            {{ successMessage }}
          </span>
        </div>
        <div class="dialog-footer-buttons">
          <Button
            label="Cancel"
            class="dialog-button dialog-button-cancel"
            @click="handleCancel"
          />
          <Button
            label="Delete"
            class="dialog-button dialog-button-delete"
            :loading="isDeleting"
            @click="handleConfirm"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { watch } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { DIALOG_AUTO_CLOSE_DELAY } from "@/utils/constants";

const props = defineProps<{
  visible: boolean;
  productTitle: string;
  isDeleting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const handleClose = (value: boolean) => {
  emit("update:visible", value);
};

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  emit("update:visible", false);
};

// Close dialog when deletion is successful
watch(
  () => props.successMessage,
  newValue => {
    if (newValue) {
      setTimeout(() => {
        emit("update:visible", false);
      }, DIALOG_AUTO_CLOSE_DELAY);
    }
  }
);
</script>

<style scoped lang="scss">
.delete-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-message {
  font-size: 1rem;
  color: $text-primary;
  line-height: 1.5;
  margin: 0;

  strong {
    font-weight: 600;
    color: $text-primary;
  }
}

.delete-error-message {
  padding: 0.75rem 1rem;
  background-color: rgba($danger, 0.1);
  border: 1px solid rgba($danger, 0.2);
  border-radius: 0.375rem;
  color: $danger;
  font-size: 0.875rem;
}

.dialog-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.dialog-message-container {
  flex: 1;
  min-width: 0;
}

.dialog-success-message {
  font-size: 0.875rem;
  color: $success;
}

.dialog-footer-buttons {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}
</style>
