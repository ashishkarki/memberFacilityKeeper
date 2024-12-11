# **Fitness Passport Backend**

This is a **NestJS-based backend** that serves as the foundation for a fitness membership management application. The backend exposes a **GraphQL API** to query member data, including membership details, visit history, and supports pagination and filtering.

**Note**: Currently, this project only includes a backend. A frontend, potentially using React or Vue, will be added later to interact with these APIs.

---

## **Tech Stack**

- **TypeScript**: Strongly typed language for scalability and maintainability.
- **NestJS**: Modular framework for building efficient server-side applications.
- **GraphQL**: Query language for the API.
- **Postman**: For testing and publishing APIs.
- **Jest**: Test framework for unit testing.

---

## **System Design Diagram**

To better understand the backend architecture of this project, refer to the system design diagram below: [System Design Diagram](./memberFacilityKeeper-SystemDesign-Backend.png)

The diagram outlines:

1.  **Load Balancer (Future)**: Distributes incoming requests to multiple API instances.
2.  **GraphQL API (NestJS)**: Handles queries (`getAllMembers`, `getMemberByEmail`) and mutations (planned for future updates).
3.  **Data Layer**: Hardcoded data in `member.data.ts` (to be replaced with PostgreSQL in the future).
4.  **Redis Cache (Future)**: Planned for optimizing frequently accessed queries.
5.  **Logging & Monitoring**: Tracks errors and logs system performance.

The file `SystemDesign-MembershipBackend.png` is saved in the root of the `backend` folder, alongside this README file.

---

## System Design Decisions and their Reasoning

For more information on design choices and architectural decisions, refer to the [Design and Decisions](./DESIGN_DECISIONS.md) document.

---

## **How to Run**

1. Clone the repository:

```
git clone <your-repo-url>

cd FitnessPassportCodingChallenge-Dec2024/memberFacilityKeeper/backend
```

2. Install dependencies

```
 yarn install
```

3. Start the development server

```
  yarn start:dev
```

4. Test the API

Import the provided Postman collection located at: `backend/memberFacilityKeeper.postman_collection.json`

5. Run the tests

```
  yarn test
```

## **Redis Caching**

This project includes Redis caching to improve performance for read-heavy GraphQL queries. Here’s how it works:

1.  **Implementation**:

    • The getAllMembers query caches filtered and paginated member results in Redis.

    • A unique key is generated for each query using the pattern: members:<membershipType>:<limit>:<offset>.

    • Cached data is retrieved first before querying the data source (currently members.data.ts).

    • Data is cached with a Time-To-Live (TTL) of 60 seconds.

2.  **Setup**:

    • Redis is running locally via **OrbStack** (or any other Dockerized Redis instance).

    • To start Redis:

    ```
    docker run redis
    ```

3.  **Configuration**:

    • The Redis module configuration is in src/cache/cache.module.ts.

    • Retry strategy ensures reconnections in case of Redis connection failures.

4.  **How to Test**:

    • Use Postman or any GraphQL client to query getAllMembers.

    • Verify caching in the Redis CLI:

```
  redis-cli

  keys *

  get members:ALL:10:0
```

**Load Balancing**

This project uses **Nginx** to demonstrate load balancing between multiple NestJS servers.

1.  **Implementation**:

    • Two instances of the NestJS API run on ports 3000 and 3001.

    • Nginx is configured to distribute traffic between these instances using a round-robin strategy.

2.  **Setup**:

    • Install Nginx via Homebrew:

    ```
      brew install nginx
    ```

    • Start Nginx using the included configuration:

    ```
    yarn nginx:start
    ```

3.  **Nginx Configuration**:

    • The Nginx configuration file (/opt/homebrew/etc/nginx/nginx.conf) includes:

    ```
        upstream mybackendserver {
          server 127.0.0.1:3000;
          server 127.0.0.1:3001;
        }

        server {

        listen 8080;

        location / {
          proxy_pass http://mybackendserver;
        }

    }
    ```

4.  **Testing**:

    • Start the servers with:

    ```
      yarn start:multi
    ```

    • Access the load balancer at [http://localhost:8080/graphql](http://localhost:8080/graphql).

    • Observe the server logs to verify round-robin request distribution:

    ```
      [0] [NestJS Server: 3000] Handling request: POST /graphql

      [1] [NestJS Server: 3001] Handling request: POST /graphql
    ```

5.  **Scripts for Nginx Management**:

• Restart Nginx:
`     yarn nginx:restart
    `

• View Nginx logs:

```
yarn nginx:logs
```

## **References**

1. [NestJS GraphQL Quick Start](https://docs.nestjs.com/graphql/quick-start) - Official guide for integrating GraphQL in NestJS.

2. [NestJS Fundamentals - Testing](https://docs.nestjs.com/fundamentals/testing) - Official guide for writing unit tests in NestJS.
