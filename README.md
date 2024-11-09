# rstride Portfolio

This is the source code for my cybersecurity portfolio website built with Next.js.

## Technologies Used

- Next.js with TypeScript
- Tailwind CSS
- PostgreSQL with Prisma ORM
- Redis for caching
- Nginx for reverse proxy and SSL termination
- Hosted on an OVH VPS

## Getting Started

### Prerequisites

- Node.js 22
- PostgreSQL
- Redis

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rstride/portfolio.git
   cd portfolio
    ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/database"
    REDIS_URL="redis://localhost:6379"
    ```

4. Run the development server:

   ```bash
   npm run dev
   ```
```
5. Deploy the website:

   ```bash
   npm run build
   npm run start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.
