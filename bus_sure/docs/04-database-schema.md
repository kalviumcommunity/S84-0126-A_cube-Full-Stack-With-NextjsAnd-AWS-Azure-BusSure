# BusSure Database Schema Documentation

## Overview
This document describes the database schema for BusSure, an intercity bus refund system that provides transparent cancellation policies and instant refunds.

## Core Entities

### 1. User
**Purpose**: Represents customers who book bus tickets
- **Primary Key**: `id` (String, CUID)
- **Unique Constraints**: `email`
- **Key Fields**: firstName, lastName, email, phone, dateOfBirth
- **Relationships**: 
  - One-to-many with Booking
  - One-to-many with Payment
  - One-to-many with Refund

### 2. BusOperator
**Purpose**: Companies that operate bus services
- **Primary Key**: `id` (String, CUID)
- **Unique Constraints**: `name`, `email`, `licenseNo`
- **Key Fields**: name, email, phone, address, licenseNo, isActive
- **Relationships**:
  - One-to-many with Bus
  - One-to-many with Route
  - One-to-many with RefundPolicy

### 3. Route
**Purpose**: Defines bus routes between cities
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: `operatorId` → BusOperator.id
- **Unique Constraints**: `(operatorId, fromCity, toCity)`
- **Key Fields**: fromCity, toCity, distance, estimatedDuration
- **Indexes**: `(fromCity, toCity)` for search optimization
- **Relationships**:
  - Many-to-one with BusOperator
  - One-to-many with Schedule

### 4. Bus
**Purpose**: Individual buses with capacity and amenities
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: `operatorId` → BusOperator.id
- **Unique Constraints**: `busNumber`
- **Key Fields**: busNumber, model, capacity, amenities (JSON)
- **Relationships**:
  - Many-to-one with BusOperator
  - One-to-many with Schedule

### 5. Schedule
**Purpose**: Specific departure times for routes
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: 
  - `routeId` → Route.id
  - `busId` → Bus.id
- **Key Fields**: departureTime, arrivalTime, basePrice, availableSeats
- **Indexes**: 
  - `departureTime` for time-based queries
  - `(routeId, departureTime)` for route scheduling
- **Relationships**:
  - Many-to-one with Route
  - Many-to-one with Bus
  - One-to-many with Booking

### 6. Booking
**Purpose**: Customer reservations
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: 
  - `userId` → User.id
  - `scheduleId` → Schedule.id
- **Unique Constraints**: `bookingRef`
- **Key Fields**: bookingRef, totalAmount, status, passengerCount
- **Status Values**: CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- **Indexes**: `userId`, `scheduleId`, `bookingRef`
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with Schedule
  - One-to-many with Ticket
  - One-to-many with Payment
  - One-to-many with Refund

### 7. Ticket
**Purpose**: Individual tickets within a booking
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: `bookingId` → Booking.id
- **Unique Constraints**: `(bookingId, seatNumber)`
- **Key Fields**: seatNumber, passengerName, passengerAge, gender, price
- **Status Values**: ACTIVE, CANCELLED, USED
- **Gender Values**: MALE, FEMALE, OTHER
- **Relationships**:
  - Many-to-one with Booking

### 8. RefundPolicy
**Purpose**: Cancellation and refund rules for operators
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: `operatorId` → BusOperator.id
- **Key Fields**: name, hoursBeforeDeparture, refundPercentage, processingFee
- **Relationships**:
  - Many-to-one with BusOperator
  - One-to-many with Refund

### 9. Payment
**Purpose**: Payment transactions
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: 
  - `userId` → User.id
  - `bookingId` → Booking.id
- **Unique Constraints**: `transactionId`
- **Key Fields**: amount, paymentMethod, transactionId, status
- **Payment Methods**: CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET
- **Status Values**: PENDING, COMPLETED, FAILED, REFUNDED
- **Indexes**: `userId`, `bookingId`, `transactionId`
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with Booking

### 10. Refund
**Purpose**: Refund transactions
- **Primary Key**: `id` (String, CUID)
- **Foreign Keys**: 
  - `userId` → User.id
  - `bookingId` → Booking.id
  - `policyId` → RefundPolicy.id
- **Key Fields**: requestedAmount, refundAmount, processingFee, reason, status
- **Status Values**: PENDING, APPROVED, PROCESSED, REJECTED
- **Indexes**: `userId`, `bookingId`
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with Booking
  - Many-to-one with RefundPolicy

## Entity Relationship Diagram (Text Representation)

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    User     │    │ BusOperator  │    │    Bus      │
│             │    │              │    │             │
│ id (PK)     │    │ id (PK)      │    │ id (PK)     │
│ email (UQ)  │    │ name (UQ)    │    │ busNumber   │
│ firstName   │    │ email (UQ)   │    │ operatorId  │
│ lastName    │    │ licenseNo    │    │ (FK)        │
│ phone       │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │                   │ 1:N               │
       │ 1:N               └───────────────────┘
       │                           │
       │                           │ 1:N
       │                   ┌─────────────┐
       │                   │   Route     │
       │                   │             │
       │                   │ id (PK)     │
       │                   │ operatorId  │
       │                   │ (FK)        │
       │                   │ fromCity    │
       │                   │ toCity      │
       │                   └─────────────┘
       │                           │
       │                           │ 1:N
       │                   ┌─────────────┐
       │                   │  Schedule   │
       │                   │             │
       │                   │ id (PK)     │
       │                   │ routeId(FK) │
       │                   │ busId (FK)  │
       │                   │ departure   │
       │                   │ basePrice   │
       │                   └─────────────┘
       │                           │
       │ 1:N                       │ 1:N
       └───────────┐               │
                   │               │
           ┌─────────────┐         │
           │   Booking   │─────────┘
           │             │
           │ id (PK)     │
           │ userId (FK) │
           │ scheduleId  │
           │ (FK)        │
           │ bookingRef  │
           │ (UQ)        │
           └─────────────┘
                   │
                   │ 1:N
           ┌─────────────┐
           │   Ticket    │
           │             │
           │ id (PK)     │
           │ bookingId   │
           │ (FK)        │
           │ seatNumber  │
           │ passenger   │
           │ Name        │
           └─────────────┘

┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Payment    │    │RefundPolicy  │    │   Refund    │
│             │    │              │    │             │
│ id (PK)     │    │ id (PK)      │    │ id (PK)     │
│ userId (FK) │    │ operatorId   │    │ userId (FK) │
│ bookingId   │    │ (FK)         │    │ bookingId   │
│ (FK)        │    │ refund%      │    │ (FK)        │
│ amount      │    │ processFee   │    │ policyId    │
│ method      │    │              │    │ (FK)        │
└─────────────┘    └──────────────┘    └─────────────┘
```

## Key Relationships

### One-to-Many Relationships
1. **BusOperator → Bus**: One operator owns multiple buses
2. **BusOperator → Route**: One operator operates multiple routes
3. **BusOperator → RefundPolicy**: One operator has multiple refund policies
4. **Route → Schedule**: One route has multiple scheduled departures
5. **Bus → Schedule**: One bus can be scheduled for multiple trips
6. **User → Booking**: One user can make multiple bookings
7. **Schedule → Booking**: One schedule can have multiple bookings
8. **Booking → Ticket**: One booking contains multiple tickets
9. **Booking → Payment**: One booking can have multiple payments (partial payments)
10. **Booking → Refund**: One booking can have multiple refunds (partial refunds)
11. **User → Payment**: One user makes multiple payments
12. **User → Refund**: One user can request multiple refunds
13. **RefundPolicy → Refund**: One policy applies to multiple refunds

### Constraints and Business Rules

#### Primary Keys
- All entities use CUID (Collision-resistant Unique Identifier) for primary keys
- Provides better performance and security than auto-incrementing integers

#### Unique Constraints
- **User.email**: Prevents duplicate user accounts
- **BusOperator.name, email, licenseNo**: Ensures operator uniqueness
- **Bus.busNumber**: Prevents duplicate bus registrations
- **Route.(operatorId, fromCity, toCity)**: Prevents duplicate routes per operator
- **Booking.bookingRef**: Ensures unique booking references
- **Ticket.(bookingId, seatNumber)**: Prevents double-booking of seats
- **Payment.transactionId**: Ensures payment transaction uniqueness

#### Foreign Key Constraints
- **ON DELETE CASCADE**: Used for dependent entities (Route→BusOperator, Schedule→Route, etc.)
- Ensures data integrity when parent records are deleted

#### Indexes for Performance
1. **Route**: `(fromCity, toCity)` - Optimizes route search queries
2. **Schedule**: `departureTime` - Optimizes time-based queries
3. **Schedule**: `(routeId, departureTime)` - Optimizes route scheduling queries
4. **Booking**: `userId`, `scheduleId`, `bookingRef` - Optimizes user and booking queries
5. **Payment**: `userId`, `bookingId`, `transactionId` - Optimizes payment queries
6. **Refund**: `userId`, `bookingId` - Optimizes refund queries
7. **RefundPolicy**: `operatorId` - Optimizes policy lookup

## Normalization Analysis

### First Normal Form (1NF) ✅
- All tables have atomic values
- No repeating groups
- Each column contains single values

### Second Normal Form (2NF) ✅
- All non-key attributes are fully functionally dependent on primary keys
- No partial dependencies exist

### Third Normal Form (3NF) ✅
- No transitive dependencies
- All non-key attributes depend only on primary keys
- Example: Bus amenities stored as JSON in Bus table rather than separate table (acceptable for this use case)

## Query Patterns

### Common Query Scenarios
1. **Search Routes**: Find routes between cities with available schedules
2. **Book Tickets**: Create booking with multiple tickets and payment
3. **Calculate Refunds**: Apply refund policies based on cancellation timing
4. **User Dashboard**: Show user's bookings, payments, and refunds
5. **Operator Analytics**: Revenue, booking statistics per operator

### Performance Considerations
- Indexes on frequently queried columns (departure times, routes, user bookings)
- Composite indexes for multi-column searches
- JSON storage for flexible data (bus amenities) while maintaining performance

## Migration History
- **20260124094317_init_schema**: Initial schema creation with all entities and relationships

## Seed Data
The database includes sample data for testing:
- 2 Bus Operators (RedBus Express, TravelSafe Coaches)
- 2 Buses with different capacities and amenities
- 2 Routes (Mumbai-Pune, Delhi-Agra)
- 2 Scheduled departures
- 2 Users with sample bookings
- 3 Refund policies with different terms
- Sample booking with tickets, payment, and refund request