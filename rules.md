# Rules

## Project Structure and Setup

### TypeScript Usage

- Use **TypeScript** for all new files and components.

### Package Manager

- Use **yarn** as the main package manager.

### Next.js Structure

- Follow the **Next.js 14+** pages directory structure:
  - Place pages in the `src/pages` directory.
  - Use layout files for shared layouts.
  - Place components based on their modules `src/modules/[admin/client]/[module]/components`.

## UI Components and Styling

### UI Components

- Use the **shadcn/ui** component library for UI components, located in `src/components/ui`.
  - Use the `cn` utility function for conditional class names.
  - Use theme colors from `src/styles/globals.css` / `tailwind.config.ts` for styling.
  - Use toast from `sonner` for notifications.
  - Use the **Next.js `<Image>`** component for optimized image loading.

### Tailwind CSS

- Use **Tailwind CSS** for styling.
  - Configure Tailwind in `tailwind.config.ts`.

## Server-Side Rendering and API

### Server-Side Rendering (SSR)

- Implement **server-side rendering (SSR)** where possible, using Next.js features.
- For the server-side only files like `src/server/db.ts`, `src/server/auth.ts` and `src/server/api/trpc.ts` use `import "server-only"` to avoid hydration errors and leaking sensitive information to the client.

### tRPC for API Routes

- Use **tRPC** for type-safe API routes:
  - Define routers in `src/server/routers`.
  - Use `createTRPCRouter`, `adminProcedure`, `studentProcedure`, `publicProcedure`, or `protectedProcedure` from `src/server/trpc.ts`.
  - Use `trpc` caller for server-side calls.
  - Use `trpc` React hooks like `useQuery` and `useMutation` for client-side calls.

#### Example

```tsx
import { trpc } from "@/utils/trpc";
const { data: babListData, isLoading: loadingBabList } = trpc.admin.bab.list.useQuery(
    {
        id,
    },
    {
        enabled: id,
    }
);

const { mutateAsync: createBab, status: createStatus } =
    trpc.admin.bab.add.useMutation();
```

## Input Validation and Form Handling

### Input Validation with Zod

- Use **zod** for input validation in `trpc`.

```ts
import { z } from "zod";

export const createRuleSchema = z.object({
  title: z.string(),
  content: z.string(),
  isPrivate: z.boolean(),
  tags: z.array(z.string()),
});

export type CreateRuleSchema = z.infer<typeof createRuleSchema>;
```

- Export schemas and use them in the `trpc` router for input validation.

### Form Handling

- Implement form handling using **react-hook-form** and **zod** for validation.

## Database Operations

### Prisma for Database Operations

- Use **Prisma** for database operations.
  - Define models in `prisma/schema.prisma`.
  - Use the `db` instance from `prisma/db.ts` for database queries.
  - Never expose the `db` instance to the client.
  - Use **postgresql** database

## Authentication and Security

### Authentication with NextAuth.js

- Use **NextAuth.js** for authentication.

  - Define authentication options in `src/server/auth.ts`.
  - Use `auth()` to get the user session on the server side.
  - Use `useSession()` to get the user session on the client side.
  - Use server-side authentication as much as possible.

  - For server components, use `auth()` to get the user session.

  ```tsx
  const session = await auth();
  ```

  - For client components, use `useSession()` to get the user session.

  ```tsx
  const session = useSession();
  ```

### Environment Variables

- Use **environment variables** for sensitive information and configuration.
  - Store them in the `.env` file (not committed to version control).
  - Access them using `process.env` in server-side code.

## Error Handling and Asynchronous Operations

### Error Handling and Loading States

- Implement error handling and loading states for asynchronous operations.

### Client-Side Error Handling

- Use try/catch blocks for async operations in client components
- Display user-friendly error messages using the `sonner` toast library
- Implement error boundaries at the page level to prevent entire UI crashes

```tsx
try {
  await someAsyncOperation();
  toast.success("Operation successful");
} catch (error) {
  console.error("Operation failed:", error);
  toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
}
````

## Code Style and Naming Conventions

### Naming Conventions

- Follow these conventions:
  - Use **PascalCase** for component names.
  - Use **camelCase** for function and variable names.
  - Use **UPPERCASE_SNAKE_CASE** for constants.
