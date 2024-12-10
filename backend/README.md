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

## **References**

1. [NestJS GraphQL Quick Start](https://docs.nestjs.com/graphql/quick-start) - Official guide for integrating GraphQL in NestJS.

2. [NestJS Fundamentals - Testing](https://docs.nestjs.com/fundamentals/testing) - Official guide for writing unit tests in NestJS.
