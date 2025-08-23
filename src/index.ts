import 'dotenv/config';
import app from './app.ts';
import { getEnvIntVariable } from './utils/env-utils.ts';
import {container} from "./core/dependency-container.ts";

const DEFAULT_PORT = 3000;
const port = getEnvIntVariable("PORT", DEFAULT_PORT);

const server = app.listen(port, (error) => {
    error? console.error(error): console.log(`Server started on port ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function shutdown() {
    server.close(async () => {
        console.log("Server closed");
        await container.close();
        console.log("All dependencies closed");
    });
}