import 'dotenv/config';
import app from './app.ts';
import { getEnvIntVariable } from './utils/env-utils.ts';
import { getPersistableServices } from './service/services.ts';

const DEFAULT_PORT = 3000;
const port = getEnvIntVariable("PORT", DEFAULT_PORT);

const server = app.listen(port, (error) => {
    error? console.error(error): console.log(`Server started on port ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    server.close(() => {
        console.log("Server closed");
        getPersistableServices().forEach(
            (service) => {service.save();}
        );
    });
}