# Services Store with Search Functionality

This implementation provides a centralized Zustand store for managing all car services with powerful search and filter capabilities.

## Features

✅ **Centralized Service Management** - All services stored in one place  
✅ **Real-time Search** - Search by service name, description, or features  
✅ **Category Filtering** - Filter by regular, summer, premium, or curated services  
✅ **Type-safe** - Full TypeScript support  
✅ **Persistent State** - Search state maintained across components  

## Files Created

### 1. **`src/stores/servicesStore.ts`**
The main Zustand store containing:
- All service data (regular, summer, premium, curated)
- Search and filter logic
- Helper functions to get services by ID or category

### 2. **`src/components/ServiceSearch.tsx`**
A reusable search component with:
- Search input with real-time filtering
- Dropdown results with service previews
- Category badges and discount indicators
- Click-outside-to-close functionality

### 3. **`src/pages/ServicesDemo.tsx`**
A demo page showcasing:
- Service search functionality
- Category filter buttons
- Responsive service grid
- Service cards with images and details

## Usage

### Basic Usage

```tsx
import { useServicesStore } from '@/stores/servicesStore';

function MyComponent() {
  const { services, filteredServices, searchQuery, setSearchQuery } = useServicesStore();
  
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search services..."
      />
      
      {filteredServices.map(service => (
        <div key={service.id}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using the Search Component

```tsx
import ServiceSearch from '@/components/ServiceSearch';

function MyPage() {
  return (
    <div>
      <ServiceSearch />
      {/* Your other content */}
    </div>
  );
}
```

### Filtering by Category

```tsx
const { setSelectedCategory, getServicesByCategory } = useServicesStore();

// Filter by category
setSelectedCategory('regular'); // 'regular' | 'summer' | 'premium' | 'curated' | null

// Or get services directly
const regularServices = getServicesByCategory('regular');
```

### Getting a Specific Service

```tsx
const { getServiceById } = useServicesStore();

const service = getServiceById('premium-car-services');
```

## Service Data Structure

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'regular' | 'summer' | 'premium' | 'curated';
  features?: string[];
  isNew?: boolean;
  isIcon?: boolean;
  price?: string;
  originalPrice?: string;
  discount?: string;
}
```

## Available Services

The store includes **20 services** across 4 categories:

- **Regular Services** (8): Premium Car Services, AC Service & Repair, Batteries, Tyres & Wheel Care, etc.
- **Summer Services** (4): Front Bumper Paint, Rubbing & Polishing, Deep All Round Spa, Periodic Service
- **Premium Offers** (3): Premium Detailing Package, Complete Tyre Care Package, Engine Care Specialist
- **Curated Services** (5): Comprehensive Inspection Pack, Priority Warranty & Parts, Concierge Service, etc.

## Demo Page

Visit `/services-demo` to see the full implementation in action:
- Real-time search
- Category filtering
- Responsive grid layout
- Service cards with all details

## Store API

### State
- `services` - All available services
- `searchQuery` - Current search query
- `selectedCategory` - Currently selected category filter
- `filteredServices` - Services after applying search and filters

### Actions
- `setSearchQuery(query: string)` - Update search query and filter results
- `setSelectedCategory(category: string | null)` - Filter by category
- `getServiceById(id: string)` - Get a specific service
- `getServicesByCategory(category: string)` - Get all services in a category
- `clearSearch()` - Reset search and filters

## Integration with Existing Components

To integrate with existing components like `Navigation.tsx`:

```tsx
import { useServicesStore } from '@/stores/servicesStore';

const Navigation = () => {
  const { getServicesByCategory } = useServicesStore();
  const carServices = getServicesByCategory('regular');
  
  // Use carServices instead of the local array
  return (
    <div>
      {carServices.map(service => (
        // Your existing service card JSX
      ))}
    </div>
  );
};
```

## Benefits

1. **Single Source of Truth** - All services defined in one place
2. **Easy to Update** - Add/modify services in the store, changes reflect everywhere
3. **Powerful Search** - Search across title, description, and features
4. **Type Safety** - Full TypeScript support prevents errors
5. **Reusable** - Use the search component anywhere in your app
6. **Performance** - Efficient filtering with Zustand's optimized state management

## Next Steps

1. Add the `ServiceSearch` component to your header or landing page
2. Replace local service arrays with `useServicesStore()` calls
3. Customize the search UI to match your design
4. Add more services to the store as needed
5. Implement service detail pages using `getServiceById()`

---

**Created**: November 26, 2025  
**Store Location**: `src/stores/servicesStore.ts`  
**Demo Page**: `/services-demo`
