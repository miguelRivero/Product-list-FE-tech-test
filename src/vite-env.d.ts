/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

// Vue template JSX support
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: unknown;
  }
}
