// Global type definitions

// Cloudflare Workers environment bindings
// Add KV, D1, R2, etc. bindings here as needed
export type AppEnv = {
  Bindings: Env
  Variables: {
    userId: number
  }
}
