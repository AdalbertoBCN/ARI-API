import { FastifyReply } from "fastify";
import { isResponsible } from "../permissions";
import { prisma } from "../../http/prisma";
import { StatusCodes } from "http-status-codes";

interface ValidatePrescriptions {
    method: string;
    userId: number;
    prescriptionId: number;
    res: FastifyReply;
}

export async function validatePrescriptions({ method, userId, prescriptionId, res }: ValidatePrescriptions) {
    switch (method) {
        case "GET":
            const user = await prisma.prescriptions.findUnique({
                where: {
                    id: prescriptionId
                },
                select: {
                    userId: true
                }
            });

            if(!user) return res.status(StatusCodes.NOT_FOUND).send({ message: "Prescrição não encontrada" });

            if (await isResponsible(userId, user.userId)) {
                return;
            }

            return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
        case "POST":
            
        case "PUT":
            return true;
        case "DELETE":
            return true;
        default:
            return false;
    }
    
}