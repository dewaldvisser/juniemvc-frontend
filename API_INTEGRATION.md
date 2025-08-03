# JunieMVC Frontend - Spring Boot API Integration

This Next.js frontend application provides a complete web interface for the JunieMVC Beer API.

## Features Implemented

### 🏠 Dashboard
- Real-time metrics display (total beers, customers, orders, shipments)
- Recent orders overview
- Low stock alerts for beers with inventory < 10
- Clickable cards that navigate to relevant management pages

### 🍺 Beer Management (`/beers`)
- Full CRUD operations for beer inventory
- Create, read, update, and delete beers
- Form validation and error handling
- Table view with inline actions

### 👥 Customer Management (`/customers`)
- Complete customer database management
- Full address information support
- Create, read, update, and delete customers
- Responsive form layout

### 📦 Beer Order Management (`/beer-orders`)
- Create new beer orders with multiple line items
- Dynamic order line management (add/remove items)
- Order status updates (NEW, PAID, CANCELLED, INPROCESS, COMPLETE)
- Expandable order details view
- Order deletion capability

### 🚚 Shipment Management (`/shipments`)
- Create and track beer order shipments
- Carrier and tracking number management
- Link shipments to existing beer orders
- DateTime picker for shipment scheduling
- Update shipment details

## Technical Implementation

### API Client Architecture
- **Location**: `src/lib/api.ts`
- **Base URL**: `http://localhost:8080/api/v1`
- **Features**:
  - Centralized HTTP client with error handling
  - TypeScript interfaces for all API entities
  - Service functions for each resource (beers, customers, orders, shipments)
  - Proper error handling and response parsing

### Component Structure
- **Responsive Design**: Mobile-first Tailwind CSS implementation
- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: User-friendly error messages and fallbacks
- **Form Validation**: Client-side validation with required fields
- **Dark Mode Support**: Full dark/light theme compatibility

### Navigation
- **Sidebar Navigation**: Clean left-side navigation with active state indicators
- **Breadcrumb Integration**: Contextual navigation throughout the app
- **Link Integration**: Dashboard metrics link directly to management pages

## API Endpoints Covered

### Beer Management
- `GET /beers` - List all beers
- `GET /beers/{id}` - Get beer by ID
- `POST /beers` - Create new beer
- `PUT /beers/{id}` - Update beer
- `DELETE /beers/{id}` - Delete beer

### Customer Management
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

### Beer Order Management
- `GET /beer-orders` - List all beer orders (with optional customerRef filter)
- `GET /beer-orders/{id}` - Get order by ID
- `POST /beer-orders` - Create new order
- `PUT /beer-orders/{id}/status` - Update order status
- `DELETE /beer-orders/{id}` - Delete order

### Shipment Management
- `GET /beer-order-shipments` - List all shipments (with optional beerOrderId filter)
- `GET /beer-order-shipments/{id}` - Get shipment by ID
- `POST /beer-order-shipments` - Create new shipment
- `PUT /beer-order-shipments/{id}` - Update shipment
- `DELETE /beer-order-shipments/{id}` - Delete shipment

## Getting Started

1. **Start your Spring Boot API**:
   ```bash
   # Make sure your Spring Boot application is running on:
   # http://localhost:8080
   ```

2. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   ```
   http://localhost:3000
   ```

## Data Flow

1. **Dashboard** loads overview statistics from all API endpoints
2. **Management pages** provide full CRUD operations for each resource
3. **Forms** submit data to Spring Boot API endpoints
4. **Real-time updates** refresh data after successful operations
5. **Error handling** displays user-friendly messages for API failures

## Error Handling

- **Network Errors**: Displays connection error messages with retry suggestions
- **Validation Errors**: Shows field-specific validation messages from the API
- **404 Errors**: Handles missing resources gracefully
- **Server Errors**: Provides meaningful error messages to users

## Future Enhancements

- Add pagination for large datasets
- Implement search and filtering capabilities
- Add bulk operations for beer inventory management
- Include order analytics and reporting
- Add real-time notifications for order status changes
- Implement user authentication and authorization