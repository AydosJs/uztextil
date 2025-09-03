---
to: "<%= updateIndex ? 'src/components/ui/index.ts' : null %>"
inject: true
append: true
---
export { <%= h.changeCase.pascalCase(name) %> } from "./<%= name %>"
export type { <%= h.changeCase.pascalCase(name) %>Props } from "./<%= name %>"<% if (withVariants) { %>
export { <%= h.changeCase.camelCase(name) %>Variants } from "./<%= name %>-variants"<% } %>
