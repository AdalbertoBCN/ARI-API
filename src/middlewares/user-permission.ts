import { z } from "zod";
import { isResponsible } from "../config/permissions";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../config/jwt";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../http/prisma";

const patientIdSchema = z.object({
    patientId: z.coerce.number(),
});

const prescriptionIdSchema = z.object({
    prescriptionId: z.coerce.number(),
});

const historyIdSchema = z.object({
    historyId: z.coerce.number(),
});


export const userPermission = async (
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> => {
    function checkRoute(route: string, method: string): boolean {
        return req.routeOptions.url === route && req.method === method;
    }
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    const { id } = verifyToken(token);

    if (checkRoute("/prescriptions/:patientId", "GET")) {
        {
            const { patientId } = patientIdSchema.parse(req.params);
            
            if (await isResponsible(id, patientId)) {
                return;
            }

            return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
        }
    }

    if (checkRoute("/history/:prescriptionId", "GET")) {
        const { prescriptionId } = prescriptionIdSchema.parse(req.params);
        
        const user = await prisma.prescriptions.findUnique({
            where: {
                id: prescriptionId
            },
            select: {
                userId: true
            }
        });

        if(!user) return res.status(StatusCodes.NOT_FOUND).send({ message: "Prescrição não encontrada" });

        if (await isResponsible(id, user.userId)) {
            return;
        }

        return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
    }

    if (checkRoute("/responsibles/:patientId", "GET")) {
        const { patientId } = patientIdSchema.parse(req.params);

        if (await isResponsible(id, patientId)) {
            return;
        }

        return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
    }

    if (checkRoute("/history/:prescriptionId", "GET")) {
        const { prescriptionId } = prescriptionIdSchema.parse(req.params);
        
        const user = await prisma.prescriptions.findUnique({
            where: {
                id: prescriptionId
            },
            select: {
                userId: true
            }
        });

        if(!user) return res.status(StatusCodes.NOT_FOUND).send({ message: "Prescrição não encontrada" });

        if (await isResponsible(id, user.userId)) {
            return;
        }

        return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
    }

    if (checkRoute("/logs/:historyId", "GET")) {
        const { historyId } = historyIdSchema.parse(req.params);

        const user = await prisma.history.findUnique({
            where: {
                id: historyId
            },
            select: {
                prescription: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if(!user) return res.status(StatusCodes.NOT_FOUND).send({ message: "Histórico não encontrado" });

        if (await isResponsible(id, user.prescription.userId)) {
            return;
        }

        return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });

    }

    if (checkRoute("/users/:id", "GET")) {
        const { id: userId } = z.object({
            id: z.coerce.number()
        }).parse(req.params);

        if (await isResponsible(id, userId)) {
            return;
        }

        return res.status(StatusCodes.FORBIDDEN).send({ message: "Rota não permitida" });
    }

    return;
};
