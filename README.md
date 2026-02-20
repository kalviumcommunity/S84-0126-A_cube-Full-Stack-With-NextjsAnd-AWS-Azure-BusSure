Deployed link Vercel - https://s84-0126-a-cube-full-stack-with-nextjs-and-aws-azure-gkymffxmz.vercel.app


Intercity Bus Refund Transparency System

This project aims to bring transparency and accountability to intercity bus ticket cancellations and refunds.

Transparency Goal

The system clearly shows cancellation rules, refund timelines, and real-time status tracking for users, reducing confusion and improving trust in the refund process.

🔹 PHASE 1 — Next.js Core (Days 1–5)

Focus: Frontend + Backend in one framework

Day 1 – Big Picture + Setup

What is full-stack architecture

React vs Next.js (SSR, SSG, App Router)

Create Next.js app with TypeScript

Project structure overview

✅ Outcome: App runs locally

Day 2 – Routing & UI

App Router (app/ folder)

Pages, layouts, navigation

Create basic pages (Home, About)

✅ Outcome: Multi-page app

Day 3 – Server & Client Components

Server vs Client components

Data fetching on server

Passing data to client components

✅ Outcome: Performance & SEO understanding

Day 4 – API Routes

API routes in Next.js

GET & POST requests

Call APIs from frontend

✅ Outcome: Frontend + backend connected

Day 5 – Mini Integration

Form → API → response

TypeScript practice

Revision

🎯 Phase 1 Result:
You understand why Next.js is a full-stack framework

🔹 PHASE 2 — Database Layer (Days 6–10)

Focus: PostgreSQL + Prisma

Day 6 – PostgreSQL Basics

Relational DB concepts

Tables, rows, keys

Install PostgreSQL

Basic SQL commands

Day 7 – Prisma Setup

What is ORM

Prisma installation

Connect Prisma to PostgreSQL

First migration

Day 8 – Schema Design

Data modeling

Relations (1–many)

Update Prisma schema

Migrate DB

Day 9 – CRUD APIs

Create, Read, Update, Delete

Prisma Client usage

Error handling

Day 10 – Frontend + DB

Connect forms to DB

Display DB data

Loading & error states

🎯 Phase 2 Result:
You now have a real full-stack CRUD application with a persistent database and API-driven data flow.

🔹 Rendering Strategies Used (Next.js App Router)

To optimize performance, scalability, and data freshness, this project uses multiple rendering strategies provided by the Next.js App Router.

Static Rendering (SSG)

Pages: Home, About
Why:
These pages contain informational content that does not change frequently.
They are pre-rendered at build time and served as static HTML, resulting in very fast load times and excellent scalability with minimal server cost.

Dynamic Rendering (SSR)

Pages: Refund Status Dashboard
Why:
This page displays real-time, user-specific data such as refund status and request history.
It is rendered on every request to ensure the data is always fresh and accurate, even though it has a higher server cost.

Hybrid Rendering (ISR)

Pages: Cancellation Rules, Refund Policy
Why:
These pages are mostly static but may change occasionally due to policy updates.
Incremental Static Regeneration (ISR) allows the app to stay fast while automatically refreshing content at intervals without a full rebuild.

Performance & Scalability Trade-offs

Static Rendering → Best performance and scalability, but data can become stale

Dynamic Rendering → Always fresh data, but higher server cost

Hybrid Rendering → Balanced approach, combining speed with controlled freshness

Choosing the right rendering strategy per page ensures the application remains fast, scalable, and cost-efficient as usage grows.

🔹 PHASE 3 — Production Ready (Days 11–20)

Focus: Redis + Docker + Cloud + CI/CD

Day 11 – Redis Basics

Why caching is needed

Redis concepts (key, TTL) 

Install Redis

Simple cache logic

Day 12 – Redis Integration

Cache API responses

Cache-first → DB fallback

Improve performance

Day 13 – Docker Fundamentals

Containers vs VMs

Dockerfile for Next.js

Build & run container

Day 14 – Docker Compose

Dockerize Next.js, PostgreSQL, Redis

Environment variables

Day 15 – Cloud Basics

AWS or Azure overview

Compute, networking, storage

Choose deployment strategy

Day 16 – Production Configuration

Environment variables

Security basics

Production builds

Day 17 – CI/CD with GitHub Actions

What is CI/CD

Build pipeline

Docker image automation

Day 18 – Deployment

Deploy containers to cloud

Connect cloud DB

Test live app

Day 19 – Debug & Optimize

Fix bugs

Improve API performance

Clean code & UI

Day 20 – Final Review

Architecture explanation

Revise all tools

Write README

Push final code

🎯 Phase 3 Result:
A fully deployed, industry-grade full-stack application

## Environment-Aware Builds & Secrets Management

This project is configured to support multiple environments to ensure safe and reliable deployments.

### Environments
- Development
- Staging
- Production

Separate environment files are used:
- .env.development
- .env.staging
- .env.production

Only `.env.example` is committed to the repository. Actual environment files are ignored using `.gitignore` to prevent exposing sensitive information.

### Secrets Management
Sensitive values such as API URLs and environment identifiers are stored using environment variables and are never hardcoded in the application. In production, these values can be securely managed using tools like GitHub Secrets or cloud secret managers.

### Why This Matters
Using environment-aware builds ensures that:
- Development, staging, and production behave independently
- Secrets are never exposed in version control
- CI/CD pipelines are safer and more reliable

This setup mirrors real-world DevOps practices used in production systems.


## Understanding Cloud Deployments: Docker → CI/CD → AWS/Azure

This project explores the complete journey of deploying a full-stack application from a local environment to the cloud using modern DevOps practices.

### Docker Containerization
The application is containerized using Docker. A Dockerfile is used to define the runtime environment, install dependencies, build the Next.js application, and run it in a production-ready container. This ensures consistency across development, staging, and production environments.

### CI/CD Pipeline
A CI pipeline is configured using GitHub Actions. On every push or pull request to the main branch, the workflow automatically installs dependencies, builds the application, and validates that the Docker image can be created successfully. This automation improves reliability and reduces human error.

### Cloud Deployment Understanding
In a real-world setup, the Docker image generated by the CI pipeline can be deployed to cloud platforms such as AWS or Azure using services like AWS EC2, Elastic Beanstalk, or Azure App Service. Environment variables and secrets are managed securely using GitHub Secrets or cloud-native secret managers.

### Secrets & Configuration
No sensitive data is committed to the repository. Environment variables are used for configuration, and secrets are intended to be stored securely in CI/CD tools or cloud services.

### Reflection
The most challenging part was understanding how multiple tools connect together in a deployment pipeline. Docker provided consistency, while CI/CD automation improved confidence in builds. In future deployments, adding automated tests and environment-specific deployments would further improve reliability.


