// src/http/server.ts

import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { setupSwagger } from "../config/swagger"; // Importando a configuração do Swagger

import { createUserRoutes } from "./routes/user/create-user";
import { getUsersRoutes } from "./routes/user/get-users";
import { deleteUserRoutes } from "./routes/user/delete-user";
import { updateUserRoutes } from "./routes/user/update-user";
import { getMedicineRoutes } from "./routes/medicines/get-medicines";
import { deleteMedicineRoutes } from "./routes/medicines/delete-medicine";
import { createMedicineRoutes } from "./routes/medicines/create-medicine";
import { updateMedicineRoutes } from "./routes/medicines/update-medicine";
import { createPrescriptionRoutes } from "./routes/prescriptions/create-prescription";
import { getPrescriptionsRoutes } from "./routes/prescriptions/get-prescription";
import { deletePrescriptionRoutes } from "./routes/prescriptions/delete-prescription";
import { updatePrescriptionRoutes } from "./routes/prescriptions/update-prescription";
import { createHistoryRoutes } from "./routes/history/create-history";
import { deleteHistoryRoutes } from "./routes/history/delete-history";
import { createLogRoutes } from "./routes/logs/create-log";
import { getHistoryRoutes } from "./routes/history/get-history";
import { getLogsRoutes } from "./routes/logs/get-log";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configurando Swagger
setupSwagger(app);

// Registro das rotas

// Users
app.register(createUserRoutes);
app.register(getUsersRoutes);
app.register(deleteUserRoutes);
app.register(updateUserRoutes);

// Medicines
app.register(createMedicineRoutes);
app.register(getMedicineRoutes);
app.register(deleteMedicineRoutes);
app.register(updateMedicineRoutes);

// Prescriptions
app.register(createPrescriptionRoutes);
app.register(getPrescriptionsRoutes);
app.register(deletePrescriptionRoutes);
app.register(updatePrescriptionRoutes);

// History
app.register(createHistoryRoutes);
app.register(getHistoryRoutes);
app.register(deleteHistoryRoutes);

// Logs
app.register(createLogRoutes);
app.register(getLogsRoutes);

// Inicializando o servidor
app.listen({
    port: 3333
}).then(() => {
    console.log("Server HTTP running at http://localhost:3333");
    console.log("Documentation running at http://localhost:3333/documentation");
});
