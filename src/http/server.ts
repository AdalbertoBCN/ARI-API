import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { getUsersRoute } from "./routes/create-user";
import { createUserRoutes } from "./routes/get-users";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createUserRoutes);
app.register(getUsersRoute);

app.listen({
    port: 3333
}).then(() => {
    console.log("Server HTTP running!");
})