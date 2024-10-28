import { z } from "zod";
import { isResponsible } from "../config/permissions";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../config/jwt";
import { StatusCodes } from "http-status-codes";

const getPrescriptionsSchema = z.object({
    patientId: z.coerce.number().or(z.undefined()),
});

export const userPermission = async (
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> => {
    const token = req.headers["authorization"]?.split(" ")[1] as string;

    const { 
        success:successBody,
        data: dataBody,
    } = getPrescriptionsSchema.safeParse(req.body);

    const {
        success:successParams,
        data: dataParams,
    } = getPrescriptionsSchema.safeParse(req.params);

    const {
        success:successQuery,
        data: dataQuery,
    } = getPrescriptionsSchema.safeParse(req.query);
    
    const verifyPatientBody = successBody && dataBody.patientId;
    const verifyPatientParams = successParams && dataParams.patientId;
    const verifyPatientQuery = successQuery && dataQuery.patientId;

    const patientId = verifyPatientBody || verifyPatientParams || verifyPatientQuery;

    if(patientId === false) return res.status(StatusCodes.UNAUTHORIZED)

    const { id } = verifyToken(token);

    if (patientId === undefined || id === patientId || await isResponsible(patientId, id)) {
        return; 
    }

    return res.status(401).send({ message: 'Usuário não autorizado' });
};
