import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/authHandler";
import { userHandlers } from "./handlers/userHandler";
import { taskHandlers } from "./handlers/taskHandler";

export const worker = setupWorker(...authHandlers, ...userHandlers, ...taskHandlers);