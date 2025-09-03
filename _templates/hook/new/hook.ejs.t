---
to: src/lib/hooks/use<%= h.changeCase.pascalCase(name) %>.ts
---
import { useState, useEffect } from 'react'

interface Use<%= h.changeCase.pascalCase(name) %>Options {
  // Add options interface here
}

interface Use<%= h.changeCase.pascalCase(name) %>Return {
  // Add return type interface here
  loading: boolean
  error: string | null
}

export function use<%= h.changeCase.pascalCase(name) %>(options?: Use<%= h.changeCase.pascalCase(name) %>Options): Use<%= h.changeCase.pascalCase(name) %>Return {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Add your hook logic here
    console.log('Hook initialized with options:', options)
  }, [options])

  return {
    loading,
    error,
    // Add other return values here
  }
}
