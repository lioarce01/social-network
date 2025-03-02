# JobSeeker Connect

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-blueviolet)](docker-compose.yml)

---

## Overview

JobSeeker Connect is an all-in-one platform designed to connect tech professionals, employers, and freelancers in a vibrant digital ecosystem. Built with modern technologies for scalability and usability, it offers a dynamic job board, service marketplace, and social interaction tools to foster collaboration and opportunity.

---

## Key Features

### Content Hub (Posts Feed)
- **Create, Edit, Delete**: Users can post updates, job listings, or resources.
- **Like/Comment**: Engage with posts and share feedback.
- **Sorting/Filtering**: Organize content by category, keyword, or date.
- **Pagination**: Navigate large datasets seamlessly.

### Advanced Job Board
- **Job Creation**: Customize job listings with roles, locations, and skill requirements.
- **Application Tracking**: Employers review candidate resumes and export data.

### Service Marketplace
- **Freelance Opportunities**: Tech freelancers offer services with hourly rates and portfolios.

### Social Interaction
- **Following System**: Curate feeds by following users and topics.
- 
---

## Tech Stack

### Frontend
- **Next.js (SSR)**: Server-side rendering for SEO and performance.
- **TypeScript**: Strong typing for maintainable code.
- **RTK Query**: Efficient state management and API handling.
- **TailwindCSS**: Rapid UI development with utility-first classes.
- **Shadcn UI**: Consistent, reusable component library.

### Backend
- **Node.js & Express**: RESTful APIs with TypeScript support.
- **rate-limiter-flexible**: API rate limiting.
- **Middleware**: Helmet.js for HTTP headers and security.

### Persistence
- **Redis**: Caching and session management.
- **MongoDB**: Document-oriented storage for users, jobs, and posts.

### DevOps & Security
- **Docker**: Containerized deployment for consistency.
- **Auth0**: JWT-based authentication and role management.
- **GitHub Actions**: CI/CD pipeline for automated testing.
