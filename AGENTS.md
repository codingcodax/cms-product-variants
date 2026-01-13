# Development Guidelines

You are an expert full-stack developer working with Payload CMS and modern web technologies. This document defines code quality standards and framework-specific patterns for this project.

## Code Quality Standards (Ultracite)

This project uses **Ultracite**, a zero-config preset built on Biome that enforces strict code quality through automated formatting and linting.

### Quick Commands

```bash
bun x ultracite fix      # Auto-fix formatting and linting issues
bun x ultracite check    # Check for issues without fixing
bun x ultracite doctor   # Diagnose setup problems
```

Biome provides **10-20x faster** linting/formatting compared to ESLint+Prettier. Most issues are automatically fixable.[^1][^2]

### Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Prioritize clarity and explicit intent over brevity.

#### Type Safety \& Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Extract magic numbers into named constants with descriptive names

```typescript
// ✅ Good: Explicit and type-safe
function processUser(user: User): ProcessedUser {
  const MAX_ATTEMPTS = 3 as const
  return {
    id: user.id,
    email: user.email,
    attempts: Math.min(user.attempts, MAX_ATTEMPTS),
  }
}

// ❌ Bad: Using any and magic numbers
function processUser(user: any) {
  return { ...user, attempts: Math.min(user.attempts, 3) }
}
```

#### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment needed, never `var`

```typescript
// ✅ Good: Modern patterns
const fullName = user?.profile?.name ?? 'Anonymous'
for (const item of items) {
  console.log(item)
}

// ❌ Bad: Old patterns
const fullName = user && user.profile && user.profile.name ? user.profile.name : 'Anonymous'
items.forEach((item, index) => {
  console.log(items[index])
})
```

#### Async \& Error Handling

- Always `await` promises in async functions
- Use `async/await` instead of promise chains
- Handle errors with try-catch blocks in async code
- Don't use async functions as Promise executors
- Throw `Error` objects with descriptive messages, not strings

```typescript
// ✅ Good: Proper async handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('User fetch error:', error)
    throw error
  }
}

// ❌ Bad: Unhandled promises
async function fetchUser(id: string) {
  const response = fetch(`/api/users/${id}`) // Missing await!
  return response.json()
}
```

#### React Best Practices

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays
- Use `key` prop with unique IDs (not array indices) for iterables
- Nest children between tags instead of passing as props
- Don't define components inside other components

```tsx
// ✅ Good: Proper hooks and keys
function UserList({ users }: { users: User[] }) {
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchData()
  }, [filter]) // All dependencies included

  return users.map((user) => (
    <UserCard key={user.id} user={user} /> // Unique ID as key
  ))
}

// ❌ Bad: Conditional hooks, index keys
function UserList({ users }) {
  if (someCondition) {
    const [filter, setFilter] = useState('') // Conditional hook!
  }

  return users.map((user, index) => (
    <UserCard key={index} user={user} /> // Array index as key
  ))
}
```

#### Accessibility (a11y)

- Provide meaningful `alt` text for images
- Use proper heading hierarchy (h1 → h2 → h3)
- Add labels for form inputs
- Include keyboard handlers alongside mouse events
- Use semantic HTML (`<button>`, `<nav>`, `<main>`) over divs with roles
- Add `rel="noopener"` when using `target="_blank"`

```tsx
// ✅ Good: Accessible markup
<form>
  <label htmlFor="email">Email address</label>
  <input id="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

// ❌ Bad: Inaccessible markup
<div onClick={handleClick}>Click me</div>
<input type="email" placeholder="Email" /> {/* Missing label */}
<img src="/photo.jpg" /> {/* Missing alt text */}
```

#### Security

- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign to `document.cookie`
- Validate and sanitize user input
- Use Next.js `<Image>` component over `<img>` tags

#### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files re-exporting everything)

```typescript
// ✅ Good: Efficient patterns
import { Button } from '@/components/Button'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ❌ Bad: Performance issues
import * as Components from '@/components' // Namespace import
const isValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) // Regex in function
```

#### Code Organization

- Keep functions focused with low cognitive complexity
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternaries
- Remove `console.log`, `debugger`, and `alert` from production code

```typescript
// ✅ Good: Early returns, clear logic
function canEditPost(user: User, post: Post): boolean {
  if (!user) return false
  if (user.roles.includes('admin')) return true

  const isAuthor = post.authorId === user.id
  const isWithinEditWindow = Date.now() - post.createdAt < 3600000

  return isAuthor && isWithinEditWindow
}

// ❌ Bad: Nested conditionals
function canEditPost(user, post) {
  if (user) {
    if (user.roles.includes('admin')) {
      return true
    } else {
      if (post.authorId === user.id) {
        if (Date.now() - post.createdAt < 3600000) {
          return true
        }
      }
    }
  }
  return false
}
```

### Testing

- Write assertions inside `it()` or `test()` blocks
- Use async/await instead of done callbacks
- Don't commit `.only` or `.skip` in tests
- Keep test suites reasonably flat

### Framework-Specific Notes

**Next.js:**

- Use `<Image>` component for images
- Use App Router metadata API for head elements
- Use Server Components for async data fetching

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

### Beyond Biome

Biome handles formatting and common issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate algorithms
2. **Meaningful naming** - Use descriptive names for functions/variables/types
3. **Architecture** - Component structure, data flow, API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, usability
6. **Documentation** - Comment complex logic, prefer self-documenting code

---

## Payload CMS Development Rules

### Development Environment

#### Build Commands

```bash
pnpm build        # Build production bundle with Next.js
pnpm dev          # Start development server
pnpm devsafe      # Clean dev server (removes .next cache)
pnpm start        # Start production server
pnpm payload      # Access Payload CLI
```

#### Type Generation \& Validation

```bash
pnpm generate:types      # Generate TypeScript types from schema
pnpm generate:importmap  # Generate import map for admin components
tsc --noEmit            # Validate TypeScript without emitting files
```

**Important:** Always run `generate:types` after schema changes and `generate:importmap` after creating/modifying components.[^3]

#### Testing

```bash
pnpm test                                              # Run all tests
pnpm test:int                                         # Integration tests (Vitest)
pnpm test:e2e                                         # E2E tests (Playwright)
pnpm exec vitest run tests/int/specific.test.ts      # Single integration test
pnpm exec playwright test tests/e2e/spec.e2e.spec.ts # Single e2e test
```

### Code Style (Payload-Specific)

#### Formatting (Prettier)

- **Single quotes**: Always use single quotes
- **Trailing commas**: Required in arrays/objects
- **Print width**: 100 characters max
- **Semicolons**: Disabled
- **Indentation**: 2 spaces

#### Import Organization

```typescript
// 1. React imports first
import React from 'react'

// 2. Third-party libraries
import { useState } from 'react'
import type { CollectionConfig } from 'payload'

// 3. Local imports with path aliases
import { Users } from '@/collections/users'
import config from '@payload-config'

// 4. Relative imports (avoid when possible)
import { helper } from '../utils/helper'
```

#### Naming Conventions

| Type        | Convention                                 | Example                             |
| :---------- | :----------------------------------------- | :---------------------------------- |
| Collections | PascalCase, singular                       | `Users`, `Posts`, `Media`           |
| Fields      | camelCase                                  | `firstName`, `isPublished`          |
| Slugs       | kebab-case                                 | `blog-posts`, `user-profiles`       |
| Components  | PascalCase                                 | `CustomField`, `AdminHeader`        |
| Hooks       | camelCase with `use`                       | `useAuth`, `useDocumentInfo`        |
| Types       | PascalCase                                 | `UserDocument`, `PostStatus`        |
| Files       | kebab-case (components), camelCase (utils) | `custom-field.tsx`, `formatDate.ts` |

### Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend routes
│   └── (payload)/           # Payload admin routes
├── collections/             # Collection configs
├── globals/                 # Global configs
├── components/              # Custom React components
├── hooks/                   # Hook functions
├── access/                  # Access control functions
└── payload.config.ts        # Main config
```

### Core Principles

1. **TypeScript-First**: Always use TypeScript with proper types from Payload
2. **Security-Critical**: Follow all security patterns, especially access control
3. **Type Generation**: Run `generate:types` after schema changes
4. **Transaction Safety**: Always pass `req` to nested operations in hooks
5. **Access Control**: Local API bypasses access control by default
6. **Role Verification**: Ensure roles exist when modifying collections/globals with access controls

#### Code Validation

```bash
tsc --noEmit                    # Validate TypeScript correctness
pnpm generate:importmap         # After creating/modifying components
bun x ultracite fix            # Fix formatting and linting
```

### Configuration

#### Minimal Config Pattern

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
})
```

### Collections

#### Basic Collection

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'content', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
  timestamps: true,
}
```

#### Auth Collection with RBAC

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

### Common Field Patterns

```typescript
// Auto-generate slugs
import { slugField } from 'payload'
slugField({ fieldToUse: 'title' })

// Relationship with filtering
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  filterOptions: { active: { equals: true } },
}

// Conditional field
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    condition: (data) => data.featured === true,
  },
}

// Virtual field (Payload 3.0+)
{
  name: 'fullName',
  type: 'text',
  virtual: true,
  hooks: {
    afterRead: [({ siblingData }) => `${siblingData.firstName} ${siblingData.lastName}`],
  },
}
```

## CRITICAL SECURITY PATTERNS

### 1. Local API Access Control (MOST IMPORTANT)

```typescript
// ❌ SECURITY BUG: Access control bypassed
await payload.find({
  collection: 'posts',
  user: someUser, // Ignored! Runs with ADMIN privileges
})

// ✅ SECURE: Enforces user permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // REQUIRED
})

// ✅ Administrative operation (intentional bypass)
await payload.find({
  collection: 'posts',
  // No user, overrideAccess defaults to true
})
```

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`

### 2. Transaction Safety in Hooks

```typescript
// ❌ DATA CORRUPTION RISK: Separate transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        // Missing req - runs in separate transaction!
      })
    },
  ],
}

// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req, // Maintains atomicity
      })
    },
  ],
}
```

**Rule**: ALWAYS pass `req` to nested operations in hooks

### 3. Prevent Infinite Hook Loops

```typescript
// ❌ INFINITE LOOP
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        req,
      }) // Triggers afterChange again!
    },
  ],
}

// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return

      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ],
}
```

## Access Control

### Collection-Level Access

```typescript
import type { Access } from 'payload'

// Boolean return
const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Query constraint (row-level security)
const ownPostsOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user?.roles?.includes('admin')) return true

  return {
    author: { equals: user.id },
  }
}

// Async access check
const projectMemberAccess: Access = async ({ req, id }) => {
  const { user, payload } = req

  if (!user) return false
  if (user.roles?.includes('admin')) return true

  const project = await payload.findByID({
    collection: 'projects',
    id: id as string,
    depth: 0,
  })

  return project.members?.includes(user.id)
}
```

### Field-Level Access

```typescript
// Field access ONLY returns boolean (no query constraints)
{
  name: 'salary',
  type: 'number',
  access: {
    read: ({ req: { user }, doc }) => {
      // Self can read own salary
      if (user?.id === doc?.id) return true
      // Admin can read all
      return user?.roles?.includes('admin')
    },
    update: ({ req: { user } }) => {
      // Only admins can update
      return user?.roles?.includes('admin')
    },
  },
}
```

### Common Access Patterns

```typescript
// Anyone
export const anyone: Access = () => true

// Authenticated only
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Admin only
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

// Admin or self
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}

// Published or authenticated
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
```

## Hooks

### Common Hook Patterns

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    // Before validation - format data
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],

    // Before save - business logic
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'update' && data.status === 'published') {
          data.publishedAt = new Date()
        }
        return data
      },
    ],

    // After save - side effects
    afterChange: [
      async ({ doc, req, operation, previousDoc, context }) => {
        // Check context to prevent loops
        if (context.skipNotification) return

        if (operation === 'create') {
          await sendNotification(doc)
        }
        return doc
      },
    ],

    // After read - computed fields
    afterRead: [
      async ({ doc, req }) => {
        doc.viewCount = await getViewCount(doc.id)
        return doc
      },
    ],

    // Before delete - cascading deletes
    beforeDelete: [
      async ({ req, id }) => {
        await req.payload.delete({
          collection: 'comments',
          where: { post: { equals: id } },
          req, // Important for transaction
        })
      },
    ],
  },
}
```

## Queries

### Local API

```typescript
// Find with complex query
const posts = await payload.find({
  collection: 'posts',
  where: {
    and: [{ status: { equals: 'published' } }, { 'author.name': { contains: 'john' } }],
  },
  depth: 2, // Populate relationships
  limit: 10,
  sort: '-createdAt',
  select: {
    title: true,
    author: true,
  },
})

// Find by ID
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  depth: 2,
})

// Create
const newPost = await payload.create({
  collection: 'posts',
  data: {
    title: 'New Post',
    status: 'draft',
  },
})

// Update
await payload.update({
  collection: 'posts',
  id: '123',
  data: { status: 'published' },
})

// Delete
await payload.delete({
  collection: 'posts',
  id: '123',
})
```

### Query Operators

```typescript
// Equals
{ status: { equals: 'published' } }

// Not equals
{ status: { not_equals: 'draft' } }

// Greater than / less than
{ price: { greater_than: 100 } }
{ age: { less_than_equal: 65 } }

// Contains (case-insensitive)
{ title: { contains: 'payload' } }

// Like (all words present)
{ description: { like: 'cms headless' } }

// In array
{ category: { in: ['tech', 'news'] } }

// Exists
{ image: { exists: true } }

// Near (geospatial)
{ location: { near: [-122.4194, 37.7749, 10000] } }
```

### AND/OR Logic

```typescript
{
  or: [
    { status: { equals: 'published' } },
    { author: { equals: user.id } },
  ],
}

{
  and: [
    { status: { equals: 'published' } },
    { featured: { equals: true } },
  ],
}
```

## Getting Payload Instance

```typescript
// In API routes (Next.js)
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
  })

  return Response.json(posts)
}

// In Server Components
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Page() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'posts' })

  return <div>{docs.map(post => <h1 key={post.id}>{post.title}</h1>)}</div>
}
```

## Components

The Admin Panel can be extensively customized using React Components. Custom Components can be Server Components (default) or Client Components.

### Defining Components

Components are defined using **file paths** (not direct imports) in your config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      // Logo and branding
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },

      // Navigation
      Nav: '/components/CustomNav',
      beforeNavLinks: ['/components/CustomNavItem'],
      afterNavLinks: ['/components/NavFooter'],

      // Header
      header: ['/components/AnnouncementBanner'],
      actions: ['/components/ClearCache', '/components/Preview'],

      // Dashboard
      beforeDashboard: ['/components/WelcomeMessage'],
      afterDashboard: ['/components/Analytics'],

      // Auth
      beforeLogin: ['/components/SSOButtons'],
      logout: { Button: '/components/LogoutButton' },

      // Views
      views: {
        dashboard: { Component: '/components/CustomDashboard' },
      },
    },
  },
})
```

**Component Path Rules:**

- Paths are relative to project root or `config.admin.importMap.baseDir`
- Named exports: use `#ExportName` suffix or `exportName` property
- Default exports: no suffix needed
- File extensions can be omitted

### Component Types

1. **Root Components** - Global Admin Panel (logo, nav, header)
2. **Collection Components** - Collection-specific (edit view, list view)
3. **Global Components** - Global document views
4. **Field Components** - Custom field UI and cells

### Server vs Client Components

**All components are Server Components by default** (can use Local API directly):

```tsx
// Server Component (default)
import type { Payload } from 'payload'

async function MyServerComponent({ payload }: { payload: Payload }) {
  const posts = await payload.find({ collection: 'posts' })
  return <div>{posts.totalDocs} posts</div>
}

export default MyServerComponent
```

**Client Components** need the `'use client'` directive:

```tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@payloadcms/ui'

export function MyClientComponent() {
  const [count, setCount] = useState(0)
  const { user } = useAuth()

  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      {user?.email}: Clicked {count} times
    </button>
  )
}
```

### Using Hooks (Client Components Only)

```tsx
'use client'
import {
  useAuth, // Current user
  useConfig, // Payload config (client-safe)
  useDocumentInfo, // Document info (id, collection, etc.)
  useField, // Field value and setter
  useForm, // Form state
  useFormFields, // Multiple field values (optimized)
  useLocale, // Current locale
  useTranslation, // i18n translations
} from '@payloadcms/ui'

export function MyComponent() {
  const { user } = useAuth()
  const { config } = useConfig()
  const { id, collection } = useDocumentInfo()
  const locale = useLocale()
  const { t } = useTranslation()

  return <div>Hello {user?.email}</div>
}
```

### Collection/Global Components

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    components: {
      // Edit view
      edit: {
        PreviewButton: '/components/PostPreview',
        SaveButton: '/components/CustomSave',
        SaveDraftButton: '/components/SaveDraft',
        PublishButton: '/components/Publish',
      },

      // List view
      list: {
        Header: '/components/ListHeader',
        beforeList: ['/components/BulkActions'],
        afterList: ['/components/ListFooter'],
      },
    },
  },
}
```

### Field Components

```typescript
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  admin: {
    components: {
      // Edit view field
      Field: '/components/StatusField',
      // List view cell
      Cell: '/components/StatusCell',
      // Field label
      Label: '/components/StatusLabel',
      // Field description
      Description: '/components/StatusDescription',
      // Error message
      Error: '/components/StatusError',
    },
  },
}
```

**UI Field** (presentational only, no data):

```typescript
{
  name: 'refundButton',
  type: 'ui',
  admin: {
    components: {
      Field: '/components/RefundButton',
    },
  },
}
```

### Performance Best Practices

1. **Import correctly:**
   - Admin Panel: `import { Button } from '@payloadcms/ui'`
   - Frontend: `import { Button } from '@payloadcms/ui/elements/Button'`
2. **Optimize re-renders:**

```tsx
// ❌ BAD: Re-renders on every form change
const { fields } = useForm()

// ✅ GOOD: Only re-renders when specific field changes
const value = useFormFields(([fields]) => fields[path])
```

1. **Prefer Server Components** - Only use Client Components when you need:
   - State (useState, useReducer)
   - Effects (useEffect)
   - Event handlers (onClick, onChange)
   - Browser APIs (localStorage, window)
2. **Minimize serialized props** - Server Components serialize props sent to client

### Styling Components

```tsx
import './styles.scss'

export function MyComponent() {
```

return <div className="my-component">Content</div>

```
}
```

```scss
// Use Payload's CSS variables
.my-component {
  background-color: var(--theme-elevation-500);
  color: var(--theme-text);
  padding: var(--base);
  border-radius: var(--border-radius-m);
}

// Import Payload's SCSS library
@import '~@payloadcms/ui/scss';

.my-component {
  @include mid-break {
    background-color: var(--theme-elevation-900);
  }
}
```

### Type Safety

```tsx
import type {
  TextFieldServerComponent,
  TextFieldClientComponent,
  TextFieldCellComponent,
  SelectFieldServerComponent,
  // ... etc
} from 'payload'

export const MyField: TextFieldClientComponent = (props) => {
  // Fully typed props
}
```

### Import Map

Payload auto-generates `app/(payload)/admin/importMap.js` to resolve component paths.

**Regenerate manually:**

```bash
pnpm generate:importmap
```

## Custom Endpoints

```typescript
import type { Endpoint } from 'payload'
import { APIError } from 'payload'

// Always check authentication
export const protectedEndpoint: Endpoint = {
  path: '/protected',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    // Use req.payload for database operations
    const data = await req.payload.find({
      collection: 'posts',
      where: { author: { equals: req.user.id } },
    })

    return Response.json(data)
  },
}

// Route parameters
export const trackingEndpoint: Endpoint = {
  path: '/:id/tracking',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams

    const tracking = await getTrackingInfo(id)

    if (!tracking) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    return Response.json(tracking)
  },
}
```

## Drafts \& Versions

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false, // Don't validate drafts
    },
    maxPerDoc: 100,
  },
  access: {
    read: ({ req: { user } }) => {
      // Public sees only published
      if (!user) return { _status: { equals: 'published' } }
      // Authenticated sees all
      return true
    },
  },
}

// Create draft
await payload.create({
  collection: 'pages',
  data: { title: 'Draft Page' },
  draft: true, // Skips required field validation
})

// Read with drafts
const page = await payload.findByID({
  collection: 'pages',
  id: '123',
  draft: true, // Returns draft if available
})
```

## Field Type Guards

```typescript
import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsArrayType,
  fieldIsBlockType,
  fieldSupportsMany,
  fieldHasMaxDepth,
} from 'payload'

function processField(field: Field) {
  // Check if field stores data
  if (fieldAffectsData(field)) {
    console.log(field.name) // Safe to access
  }

  // Check if field has nested fields
  if (fieldHasSubFields(field)) {
    field.fields.forEach(processField) // Safe to access
  }

  // Check field type
  if (fieldIsArrayType(field)) {
    console.log(field.minRows, field.maxRows)
  }

  // Check capabilities
  if (fieldSupportsMany(field) && field.hasMany) {
    console.log('Multiple values supported')
  }
}
```

## Plugins

### Using Plugins

```typescript
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
    }),
    redirectsPlugin({
      collections: ['pages'],
    }),
  ],
})
```

### Creating Plugins

```typescript
import type { Config, Plugin } from 'payload'

interface MyPluginConfig {
  collections?: string[]
  enabled?: boolean
}

export const myPlugin =
  (options: MyPluginConfig): Plugin =>
  (config: Config): Config => ({
    ...config,
    collections: config.collections?.map((collection) => {
      if (options.collections?.includes(collection.slug)) {
        return {
          ...collection,
          fields: [...collection.fields, { name: 'pluginField', type: 'text' }],
        }
      }
      return collection
    }),
  })
```

## Best Practices

### Security

1. Always set `overrideAccess: false` when passing `user` to Local API
2. Field-level access only returns boolean (no query constraints)
3. Default to restrictive access, gradually add permissions
4. Never trust client-provided data
5. Use `saveToJWT: true` for roles to avoid database lookups

### Performance

1. Index frequently queried fields
2. Use `select` to limit returned fields
3. Set `maxDepth` on relationships to prevent over-fetching
4. Use query constraints over async operations in access control
5. Cache expensive operations in `req.context`

### Data Integrity

1. Always pass `req` to nested operations in hooks
2. Use context flags to prevent infinite hook loops
3. Enable transactions for MongoDB (requires replica set) and Postgres
4. Use `beforeValidate` for data formatting
5. Use `beforeChange` for business logic

### Type Safety

1. Run `generate:types` after schema changes
2. Import types from generated `payload-types.ts`
3. Type your user object: `import type { User } from '@/payload-types'`
4. Use `as const` for field options
5. Use field type guards for runtime type checking

### Organization

1. Keep collections in separate files
2. Extract access control to `access/` directory
3. Extract hooks to `hooks/` directory
4. Use reusable field factories for common patterns
5. Document complex access control with comments

## Common Gotchas

1. **Local API Default**: Access control bypassed unless `overrideAccess: false`
2. **Transaction Safety**: Missing `req` in nested operations breaks atomicity
3. **Hook Loops**: Operations in hooks can trigger the same hooks
4. **Field Access**: Cannot use query constraints, only boolean
5. **Relationship Depth**: Default depth is 2, set to 0 for IDs only
6. **Draft Status**: `_status` field auto-injected when drafts enabled
7. **Type Generation**: Types not updated until `generate:types` runs
8. **MongoDB Transactions**: Require replica set configuration
9. **SQLite Transactions**: Disabled by default, enable with `transactionOptions: {}`
10. **Point Fields**: Not supported in SQLite

## Additional Context Files

For deeper exploration of specific topics, refer to the context files in `.cursor/rules/`:

1. **`payload-overview.md`** - High-level architecture and core concepts
2. **`security-critical.md`** - Critical security patterns (⚠️ IMPORTANT)
3. **`collections.md`** - Collection configurations
4. **`fields.md`** - Field types and patterns
5. **`field-type-guards.md`** - TypeScript field type utilities
6. **`access-control.md`** - Permission patterns
7. **`access-control-advanced.md`** - Complex access patterns
8. **`hooks.md`** - Lifecycle hooks
9. **`queries.md`** - Database operations
10. **`endpoints.md`** - Custom API endpoints
11. **`adapters.md`** - Database and storage adapters
12. **`plugin-development.md`** - Creating plugins
13. **`components.md`** - Custom Components

## Resources

- **Payload Docs**: <https://payloadcms.com/docs>
- **Payload LLM Context**: <https://payloadcms.com/llms-full.txt>
- **Payload GitHub**: <https://github.com/payloadcms/payload>
- **Ultracite Docs**: <https://www.ultracite.ai>
- **Biome Docs**: <https://biomejs.dev>
