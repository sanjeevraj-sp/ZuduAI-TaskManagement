import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/authHandler";

export const worker = setupWorker(...authHandlers);
