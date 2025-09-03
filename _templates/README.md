# Hygen Code Generation Templates

This project uses Hygen for code generation to maintain consistency and speed up development.

## Available Templates

### 🧩 Component Generator
Generate UI components with TypeScript and your project patterns.

```bash
# Interactive mode
bun run generate component new

# With options
npx hygen component new --name awesome-button --withVariants true --updateIndex true
```

**Generated files:**
- `src/components/ui/{name}.tsx` - Main component file
- `src/components/ui/{name}-variants.ts` - Variants file (if withVariants=true)
- Updates `src/components/ui/index.ts` (if updateIndex=true)

### 📄 Page Generator
Generate pages following your Welcome.tsx structure with i18n and navigation.

```bash
# Interactive mode
bun run generate page new

# With options
npx hygen page new --name user-profile --backRoute "/settings" --nextRoute "/profile/edit"
```

**Generated files:**
- `src/pages/{PascalCaseName}.tsx` - Page component with navigation and i18n

### 🪝 Hook Generator
Generate custom hooks for your lib/hooks directory.

```bash
# Interactive mode
bun run generate hook new

# With options
npx hygen hook new --name local-storage --updateIndex true
```

**Generated files:**
- `src/lib/hooks/use{PascalCaseName}.ts` - Hook file with TypeScript interfaces
- Updates `src/lib/hooks/index.ts` (if updateIndex=true)

## Usage Examples

### Creating a Modal Component
```bash
bun run generate component new
# Enter: modal
# Include variants: yes
# Update index: yes
```

This creates:
- `src/components/ui/modal.tsx`
- `src/components/ui/modal-variants.ts`
- Updates `src/components/ui/index.ts`

### Creating a Settings Page
```bash
bun run generate page new
# Enter: settings
# Back route: /dashboard
# Next route: /settings/profile
```

This creates:
- `src/pages/Settings.tsx` with proper navigation and i18n structure

### Creating a Data Fetching Hook
```bash
bun run generate hook new
# Enter: api-data
# Update index: yes
```

This creates:
- `src/lib/hooks/useApiData.ts`
- Updates `src/lib/hooks/index.ts`

## Template Features

✅ **TypeScript First** - All templates generate proper TypeScript interfaces  
✅ **Consistent Patterns** - Follows your existing code structure  
✅ **Path Aliases** - Uses `@/` imports automatically  
✅ **i18n Ready** - Pages include translation keys  
✅ **Navigation** - Pages include proper Telegram back button handling  
✅ **Variants Support** - Components can use CVA for styling variants  
✅ **Auto Index Updates** - Automatically exports new components/hooks  

## File Naming Conventions

- **Components**: kebab-case → PascalCase (e.g., `user-card` → `UserCard`)
- **Pages**: kebab-case → PascalCase (e.g., `user-profile` → `UserProfile`)
- **Hooks**: kebab-case → usePascalCase (e.g., `local-storage` → `useLocalStorage`)

## Customizing Templates

Templates are located in `_templates/` directory:
- `_templates/component/new/` - Component templates
- `_templates/page/new/` - Page templates  
- `_templates/hook/new/` - Hook templates

Each template includes:
- `*.ejs.t` files - Template files with EJS syntax
- `prompt.cjs` - Interactive prompts configuration

## Tips

1. **Use descriptive names** - Template names become file/component names
2. **Follow conventions** - Use kebab-case for input names
3. **Update indexes** - Keep your index.ts files updated for clean imports
4. **Test generated code** - Always verify the generated code compiles
5. **Customize as needed** - Modify templates to match your specific patterns

## Troubleshooting

If you encounter issues:
1. Ensure all template files use `.cjs` extension for prompts
2. Check that your project uses proper TypeScript configuration
3. Verify path aliases are correctly configured in `tsconfig.json`
