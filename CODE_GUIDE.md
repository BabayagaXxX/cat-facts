# Cat Facts - Code Organization Guide

This document explains how the codebase is organized to make it easier to understand and maintain.

## 📁 Project Structure

```
cat-facts/
├── app/                      # Next.js App Router (pages and API routes)
│   ├── api/                  # Backend API endpoints
│   │   ├── breeds/          # Breed CRUD operations
│   │   ├── facts/           # Facts CRUD operations
│   │   └── adoptions/       # Adoption CRUD operations
│   └── (pages)/             # Frontend pages
├── components/              # Reusable UI components
│   ├── features/           # Business logic components
│   ├── layout/             # Layout components (Navbar, Footer)
│   └── ui/                 # Basic UI components (Button, Card, etc.)
├── lib/                    # Utility libraries
│   ├── api.ts             # API client functions
│   ├── db.ts              # Database connection
│   ├── file-upload.ts     # File upload utilities
│   └── utils.ts           # General utilities
├── store/                  # Global state management
│   └── useAppStore.ts     # Zustand store for client-side state
└── types/                  # TypeScript type definitions
```

## 🔑 Key Concepts Explained

### 1. **API Routes** (`app/api/`)

API routes handle communication between the frontend and database. Each route follows a simple pattern:

- **GET**: Fetch data from database
- **POST**: Create new data
- **PUT**: Update existing data
- **DELETE**: Remove data

**Example**: `app/api/breeds/route.ts`
- `GET /api/breeds` → Get all breeds
- `POST /api/breeds` → Add a new breed
- `PUT /api/breeds` → Update a breed
- `DELETE /api/breeds?id=123` → Delete a breed

### 2. **Database Connection** (`lib/db.ts`)

The database uses a **connection pool**, which is like having multiple phone lines instead of one. This makes the app faster because multiple requests can happen at the same time.

```typescript
export const db = mysql.createPool({ ... })
```

### 3. **API Client Functions** (`lib/api.ts`)

These are helper functions that make it easy to call our APIs from components. Organized into three sections:

#### External API Functions
- `getBreeds()` - Fetch breeds from catfact.ninja
- `getFacts()` - Fetch random cat facts from catfact.ninja

#### Local Database Functions - Breeds
- `getLocalBreeds()` - Get breeds from our database
- `addBreed()` - Add a new breed

#### Local Database Functions - Facts
- `getLocalFacts()` - Get saved facts
- `saveFact()` - Save one fact
- `saveMultipleFacts()` - Save many facts at once
- `clearLocalFacts()` - Delete all facts

#### Local Database Functions - Adoptions
- `getAdoptions()` - Get all adoptions
- `addAdoption()` - Create an adoption listing

### 4. **File Upload Utility** (`lib/file-upload.ts`)

Simple, reusable function for handling image uploads:

```typescript
// Instead of repeating this code everywhere:
const bytes = await image.arrayBuffer();
const buffer = Buffer.from(bytes);
// ... 10+ lines of code ...

// We now just do:
const imageUrl = await saveUploadedFile(image, 'breeds');
```

### 5. **Global State Management** (`store/useAppStore.ts`)

Uses Zustand to manage client-side data that needs to persist:

- **hybridBreeds**: Custom breeds created by users
- **savedFacts**: Facts saved by users

The data is automatically saved to `localStorage`, so it survives page refreshes.

### 6. **Components** (`components/`)

#### Features Components
Complex components with business logic:
- `FactsPlayground` - Fetch and display facts
- `AdoptionList` - Filter and display adoptions
- `BreedList` - Search and paginate breeds

#### UI Components
Simple, reusable building blocks:
- `Button`, `Card`, `Input`, etc.

## 🎯 How Data Flows

### Example: Fetching Cat Facts

1. **User clicks "Get New Facts" button** in `FactsPlayground.tsx`
2. **Component calls `handleLoadMore()`** function
3. **Function does 3 things**:
   - Calls `getFacts(10)` to get facts from external API
   - Calls `clearLocalFacts()` to clear old facts from DB
   - Calls `saveMultipleFacts()` to save new facts to DB
4. **Component updates state** with new facts
5. **UI re-renders** to show new facts

### Example: Adding a Breed

1. **User fills form** in `AddBreedForm.tsx`
2. **Form submits** with image file
3. **Component calls `addBreed(formData)`** from `lib/api.ts`
4. **API function sends POST** to `/api/breeds`
5. **API route handler**:
   - Saves image using `saveUploadedFile()`
   - Inserts breed data into database
   - Returns the new breed
6. **Component refreshes** to show the new breed

## 📚 Common Patterns

### Error Handling

All API routes follow this pattern:

```typescript
try {
    // Do the work
    const result = await someOperation();
    return NextResponse.json(result);
} catch (error) {
    console.error('Operation failed:', error);
    return NextResponse.json({ 
        error: 'User-friendly message',
        details: error.message 
    }, { status: 500 });
}
```

### Loading States

Components manage loading states to show feedback:

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
    setLoading(true);
    try {
        await someOperation();
    } finally {
        setLoading(false); // Always reset loading
    }
};
```

### Filtering Data

Use `Array.filter()` to filter data based on conditions:

```typescript
const filtered = items.filter((item) => {
    const matchesStatus = status === "all" || item.status === status;
    const matchesSearch = item.name.includes(searchQuery);
    return matchesStatus && matchesSearch;
});
```

## 🛠️ Technologies Used

- **Next.js 16**: React framework for building the app
- **TypeScript**: Adds type safety to JavaScript
- **MySQL**: Database for storing data
- **Zustand**: Simple state management
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components

## 🚀 Development Workflow

1. **Start the dev server**: `npm run dev`
2. **Make changes** to files
3. **Browser auto-refreshes** to show changes
4. **Check console** for any errors

## 💡 Tips for Understanding the Code

1. **Start with the page files** in `app/` to see what's rendered
2. **Follow the data flow** from components → API functions → API routes → database
3. **Read the comments** - they explain what each function does
4. **Look at one feature at a time** - don't try to understand everything at once
5. **Use the type definitions** in `types/` to understand data structures

## 📖 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
