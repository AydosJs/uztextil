---
to: "<%= updateIndex ? 'src/lib/hooks/index.ts' : null %>"
inject: true
append: true
---
export { use<%= h.changeCase.pascalCase(name) %> } from "./use<%= h.changeCase.pascalCase(name) %>"
