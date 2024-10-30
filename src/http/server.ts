// src/http/server.ts

import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { setupSwagger } from "../config/swagger"; // Importando a configuração do Swagger

import { createUserRoutes } from "@/user/create-user";
import { getUsersRoutes } from "@/user/get-users";
import { deleteUserRoutes } from "@/user/delete-user";
import { updateUserRoutes } from "@/user/update-user";

import { createMedicineRoutes } from "./routes/medicines/create-medicine";
import { getMedicineRoutes } from "./routes/medicines/get-medicines";
import { deleteMedicineRoutes } from "./routes/medicines/delete-medicine";
import { updateMedicineRoutes } from "./routes/medicines/update-medicine";

import { createPrescriptionRoutes } from "./routes/prescriptions/create-prescription";
import { getPrescriptionsRoutes } from "./routes/prescriptions/get-prescriptions";
import { deletePrescriptionRoutes } from "./routes/prescriptions/delete-prescription";
import { updatePrescriptionRoutes } from "./routes/prescriptions/update-prescription";

import { createHistoryRoutes } from "./routes/history/create-history";
import { getHistoryRoutes } from "./routes/history/get-history";
import { deleteHistoryRoutes } from "./routes/history/delete-history";

import { createLogRoutes } from "./routes/logs/create-log";
import { getLogsRoutes } from "./routes/logs/get-log";

import { loginUserRoutes } from "./routes/auth/login";
import { logoutUserRoutes } from "./routes/auth/logout";
import { createResponsibleRoutes } from "./routes/responsibles/create-responsible";
import { deleteResponsibleRoutes } from "./routes/responsibles/delete-responsible";
import { getResponsiblesRoutes } from "./routes/responsibles/get-responsibles";
import { logedUserRoutes } from "@/auth/loged";
import cors from '@fastify/cors'
import { getUserRoutes } from "@/user/get-user";
import { getAllHistoryRoutes } from "@/history/get-all-history";


const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configurando Swagger
setupSwagger(app);

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// Registro das rotas

// Users
app.register(createUserRoutes);
app.register(getUsersRoutes);
app.register(deleteUserRoutes);
app.register(updateUserRoutes);
app.register(logedUserRoutes);
app.register(getUserRoutes);

// Responsibles
app.register(getResponsiblesRoutes);
app.register(createResponsibleRoutes);
app.register(deleteResponsibleRoutes);

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
app.register(getAllHistoryRoutes);

// Logs
app.register(createLogRoutes);
app.register(getLogsRoutes);

// Autenticação

app.register(loginUserRoutes);
app.register(logoutUserRoutes)

// Inicializando o servidor
app.listen({
    port: 3333
}).then(() => {
    console.log("Server HTTP running at http://localhost:3333");
    console.log("Documentation running at http://localhost:3333/documentation");
});


