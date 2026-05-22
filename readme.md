# a2---devpulse

A secure and efficient issue tracking REST API backend built to log, categorize, and prioritize software development issues like bug reports and feature requests.

- **Live Deployment URL:** [https://your-deployed-app-link.com](https://your-deployed-app-link.com) *(Update with your production link)*
- **Local Host URL:** `http://localhost:3000`

---

## 🚀 Features

- **Dynamic Issue Lifecycle Management:** Log, update, filter, and track development requests cleanly across distinct operational states (`open`, `in_progress`, `resolved`).
- **Granular Role-Based Resource Access:** Strict protection barriers defining who can manage issues using `contributor` vs. `maintainer` privilege logic.
- **Robust Query Filtering & Sorting:** Fetch records dynamically with multi-parameter combinations (`type`, `status`, `sort`) in a single SQL operation.
- **Advanced Batch Data Merging:** Efficient multi-query profile fetching using custom data joins in the application layers to eliminate complex database structural overhead.
- **Centralized Production Exception Interceptor:** Comprehensive database error transformation converting cryptic raw PostgreSQL logs into clear, human-readable error contracts.

---

## 🛠️ Tech Stack & Dependencies

### Core Architecture
- **Runtime Environment:** Node.js (v18+ recommended)
- **Language Layer:** TypeScript (v6.0+)
- **Application Routing Engine:** Express (v5.2+)
- **Database Engine:** PostgreSQL (v8.21+)

### Third-Party Libraries
- `jsonwebtoken`: Secure state management through signed auth verification strings.
- `bcryptjs`: Secure cryptographic hashing algorithms for user security.
- `dotenv`: Isolation management for secure database configuration strings.
- `tsx`: Fast, native TypeScript compilation execution watch pipelines.
- `cors`: Secure Cross-Origin Request configuration setups.

---

## 📊 Database Schema Summary

The relational layout consists of two linked entities featuring strict operational checks to safeguard integrity within PostgreSQL:

### 1. `users` Table
| Column Name  | Data Type   | Constraints / Validation Rules |
|--------------|-------------|--------------------------------|
| `id`         | `SERIAL`    | `PRIMARY KEY`                  |
| `name`       | `VARCHAR`   | `NOT NULL`                     |
| `email`      | `VARCHAR`   | `UNIQUE`, `NOT NULL`           |
| `password`   | `VARCHAR`   | `NOT NULL` (Hashed via bcrypt) |
| `role`       | `VARCHAR`   | `CHECK (role IN ('contributor', 'maintainer'))` |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()`                |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()`                |

### 2. `issues` Table
| Column Name   | Data Type   | Constraints / Validation Rules |
|---------------|-------------|--------------------------------|
| `id`          | `SERIAL`    | `PRIMARY KEY`                  |
| `title`       | `VARCHAR`   | `NOT NULL`                     |
| `description` | `TEXT`      | `NOT NULL`                     |
| `type`        | `VARCHAR`   | `CHECK (type IN ('bug', 'feature_request'))` |
| `status`      | `VARCHAR`   | `DEFAULT 'open'` |
| `reported_id` | `INTEGER`   | `FOREIGN KEY REFERENCES users(id)` |
| `created_at`  | `TIMESTAMP` | `DEFAULT NOW()`                |
| `updated_at`  | `TIMESTAMP` | `DEFAULT NOW()`                |

---

## 🔑 API Endpoints Reference

### Authentication Module (`/api/auth`)
- `POST /api/auth/register` - Create a new user profile (`contributor` or `maintainer`).
- `POST /api/auth/login` - Authenticate account profiles and fetch signed Bearer Tokens.

### Issues Tracking Module (`/api/issues`)
- `POST /api/issues` - Log a new development ticket. *(Access: Contributor, Maintainer)*
- `GET /api/issues` - Fetch all saved records. Highly supports optional filters. *(Access: Public)*
  - **Query Options:** `?sort=newest|oldest`, `?type=bug|feature_request`, `?status=open|in_progress|resolved`
- `GET /api/issues/:id` - Fetch single ticket records. *(Access: Public)*
- `PATCH /api/issues/:id` - Edit properties. Contributors can only modify their open tickets; Maintainers can update anything. *(Access: Protected)*
- `DELETE /api/issues/:id` - Completely remove data from tracking modules. *(Access: Maintainer Only)*

---

## ⚙️ Local Machine Setup Steps

Follow these steps to run the tracking engine locally on your machine:

### 1. Clone & Extract Project Files
Clone the code workspace repository or extract your zipped project source directly into your destination development workspace.

### 2. Install Development Modules
Open a terminal instance inside your root workspace directory and run the package installer:
```bash
npm install