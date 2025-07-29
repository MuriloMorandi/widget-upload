#  UPLOAD IMAGENS SERVER

## Prerequisites


- [Node.js](https://nodejs.org/) installed
- [pnpm](https://pnpm.io/) installed
- [Docker](https://www.docker.com/) installed

## Commands

- **Install Dependencies:**
    ```bash
    pnpm install
    ```

- **Start Server:**
    ```bash
    pnpm dev
    ```

- **Run Tests:**
    ```bash
    pnpm test
    ```

- **Run Tests( wathing mode ):**
    ```bash
    pnpm test:watch
    ```

### Database Commands

- **Generate SQL migrations :**
    ```bash
    pnpm db:generate
    ```

- **Apply SQL migrations:**
    ```bash 
    pnpm db:migrate
    ```

- **Launch Drizzle Studio:**
    ```bash 
    pnpm db:studio
    ```


###  Docker Commands

- **Build and start the containers:**
    ```bash
    docker-compose up --build
    ```
- **Start the containers (without rebuilding):**
    ```bash
    docker-compose up
    ```
- **Stop the containers:**
    ```bash
    docker-compose stop
    ```
