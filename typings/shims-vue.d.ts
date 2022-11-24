/*fix the import warning issue of vue file*/

import '@vue/runtime-dom'
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
