# **Design and Decisions**

This document outlines the design choices made for the **Fitness Passport Backend** project. It explains the tech stack, architecture decisions, and specific components such as Redis caching and Nginx load balancing.

## **Tech Stack and Why**

### **Backend**

• **NestJS**: A progressive Node.js framework that promotes modularity and scalability. Perfect for building efficient server-side applications with a strong focus on maintainability and developer productivity.

• **TypeScript**: Ensures type safety, reducing runtime errors and improving code reliability.

### **Database (Planned)**

• **PostgreSQL (Planned)**: Chosen for its ACID compliance and ability to handle complex queries efficiently. Planned integration for persistent data storage.

• **Prisma ORM (Planned)**: Simplifies database access and schema migrations.

### **API**

• **GraphQL**:

    • Enables efficient querying by allowing clients to specify required fields, preventing over-fetching or under-fetching of data.
    • Well-suited for dynamic frontends and provides flexibility for future scalability.

### **Caching**

• **Redis**:

    • In-memory data store for optimizing read-heavy operations.
    • Significantly reduces database load by caching frequent queries.
    • TTL (Time-To-Live) mechanism ensures stale data is automatically cleared.

### **Load Balancing**

• **Nginx**:

• A lightweight, high-performance reverse proxy and load balancer.

• Ensures even distribution of traffic across multiple instances, improving availability and reliability.

## **Key Features and Design Decisions**

### **1. Redis Caching**

• **Why Redis?**

• Fast in-memory data store.

• Ideal for use cases requiring frequent reads and minimal latency.

• Supports advanced features such as Pub/Sub and TTL-based eviction.

• **Implementation**:

• Cached query results for getAllMembers.

• Cache key format: members:<membershipType>:<limit>:<offset>.

• TTL ensures stale data is cleared, and fresh data is fetched periodically.

• **Benefit**:

• Improved query response times.

• Reduced computation and memory usage by offloading repeated queries.

### **2. Load Balancing with Nginx**

• **Why Load Balancing?**

• Handles increased traffic by distributing requests across multiple API instances.

• Provides fault tolerance and improves system reliability.

• **Implementation**:

• Configured to distribute requests between two NestJS instances (ports 3000 and 3001) using a round-robin algorithm.

• Logs and monitoring integrated for better observability.

• **Benefits**:

• Improved availability and reliability.

• Prevents single points of failure by distributing traffic.

### **Future Enhancements**

**1. Persistent Database**

• Replace the current hardcoded data (member.data.ts) with PostgreSQL.

• Use Prisma ORM to manage schema migrations and queries efficiently.

**2. Advanced Caching**

• Introduce hierarchical caching:

• Query layer (Redis) for API-level caching.

• Database query caching for expensive operations.

**3. Horizontal Scaling**

• Add more API instances and integrate advanced load balancing algorithms (e.g., least connections, IP hash).
