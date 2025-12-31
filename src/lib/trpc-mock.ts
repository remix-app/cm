import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

// Este archivo es una referencia para los tipos, 
// pero en un entorno sin backend, podríamos interceptar las llamadas aquí.
