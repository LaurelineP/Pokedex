import process from "node:process";

/* -------------------------------------------------------------------------- */
/*                         IMPORT PHASE ENV RESOLUTION                        */
/* -------------------------------------------------------------------------- */
/** Allows the file to be loaded on the import phase */
if (typeof (process as any).loadEnvFile === "function") {
  (process as any).loadEnvFile();
}