
# Momento

A video streaming platform built by a team of four. Users can sign up, create profiles, upload and browse videos and photos, and watch videos with adaptive-quality playback.

> **Content policy:** Only upload content you own or have the rights to use.

## Features

- Sign up and sign in with email or Google
- Multiple profiles per account
- Browse title rows, search content, and view title details
- Adaptive-quality video playback and resume watching
- Subscription plans with a payment gateway
- Admin panel to upload videos and images

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Java 21, Spring Boot 3 |
| Database | PostgreSQL |
| Cache (planned) | Redis |
| Video Storage | AWS S3, CloudFront |
| Events (planned) | Apache Kafka |
| Containers | Docker, Docker Compose |
| Cloud | AWS |
| CI/CD | GitHub Actions |

## Project Structure

```text
Momento/
├── frontend/           # React application
├── backend/            # Spring Boot API
├── infra/              # Docker Compose, Terraform, scripts
├── docs/                # Architecture notes and decisions
└── .github/workflows/   # CI/CD workflows
```

## Getting Started

### Prerequisites

Install the following tools:

- Git
- Docker and Docker Compose
- Java 21
- Node.js 20 or newer

### Installation

```bash
git clone https://github.com/vedlearns/Momento.git
cd Momento
docker compose up --build
```

Once the services are configured and running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080

> These URLs will work once the frontend and backend services are implemented and configured.

### Environment Variables

Copy `.env.example` to `.env` and configure your local settings.

**Never commit real API keys, credentials, or passwords.**

## Roadmap

| Phase | Focus |
|---|---|
| 0 | Foundations: repository, Docker, Spring Boot and React skeletons |
| 1 | Accounts: login, Google sign-in and profiles |
| 2 | Video: upload, streaming, browsing and player |
| 3 | Payments and launch on AWS |
| 4 | Events: Kafka, recommendations and load testing |

## Team

- Ved
- Shreya
- Bhawesh
- Saroj

---

Built collaboratively by the Momento team.
