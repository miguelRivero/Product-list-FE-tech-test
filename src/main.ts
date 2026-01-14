import "./style.css";
// PrimeIcons
import "primeicons/primeicons.css";

import App from "./App.vue";
// @ts-expect-error - @primevue/themes@4.5.4 doesn't export Aura as default correctly
import Aura from "@primevue/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primevue, components, tailwind-utilities",
      },
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
