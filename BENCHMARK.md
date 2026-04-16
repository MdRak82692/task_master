# Performance and Benchmark Strategy

This document highlights the strategy and benchmarking notes for the Interactive Urban Farming Platform API.

## API Response Strategy
- **Standardized Format**: We use a unified JSON response schema ensuring consistent API interaction. 
- **Error Handling**: Globally caught and cleanly parsed via customized centralized middleware, protecting against raw trace leaks and simplifying debugging.

## Pagination Strategy
- Utilized generic pagination helper (`utils/pagination.ts`) reading `page`, `limit`, `sortBy` and `sortOrder`.
- Handled efficiently with Prisma's `skip` and `take` mapping, lowering query costs sequentially across datasets. Memory efficiency is ensured.

## Indexing Strategy
To ensure optimal performance as DB size increases, several fields logically act as foreign keys and lookup targets. Prisma automatically creates indices for `@unique` and relations (`vendorId`, `userId`, `produceId`, `rentalSpaceId`).
- `User.email` (Unique index automatically)
- `VendorProfile.userId` (Unique)
- Foreign keys like `Produce.vendorId`, `Order.userId`, `Order.vendorId` act as automatic indexing paths optimizing direct role-based scoped lookups.

## Rate Limiting Strategy
- Applying express-rate-limit to sensitive routes:
  - `authLimiter`: 15 requests / 15 mins for `/api/v1/auth` routes (prevents brute forcing).
  - `apiLimiter`: 100 requests / 15 mins on global endpoints, preventing excessive generalized DDOS attacks.

## Database Query Optimizations
- Included `select` fields in Prisma queries where applicable to limit fetched columns instead of requesting all columns (e.g. nested relation fetches `vendor: { select: { farmName: true } }`).
- Leveraged `Prisma.$transaction` when atomic operations are needed (e.g., deducting quantity during order creation).

## Sample / Theoretical Timings
Assuming local PostgreSQL on SSD:
- **Simple GET**: ~5-10ms logic time
- **List GET (Paginated with Relations)**: ~15-25ms
- **Write Operations (Transactions)**: ~30-50ms
The SSE Connection (`/api/v1/plant-tracks/stream`) connects seamlessly retaining minimal memory overhead per persistent route via typical event streams logic.
