import { z } from "zod";
import { isResponsible } from "../config/permissions";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../config/jwt";

const getPrescriptionsSchema = z.object({
    patientId: z.coerce.number(),
});

export const userPermission = async (
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> => {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const { patientId } = getPrescriptionsSchema.parse(req.params);
    const { id } = verifyToken(token);

    if (id === patientId || await isResponsible(patientId, id)) {
        return; 
    }

    return res.status(403).send({ message: 'Usuário não autorizado' });
};
