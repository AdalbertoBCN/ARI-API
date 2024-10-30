import { prisma } from "../http/prisma";

export enum Roles {
    PATIENT = "PATIENT",
    RESPONSIBLE = "RESPONSIBLE"
}

async function getResponsible(userId: number, patientId: number): Promise<boolean> {
    const response = await prisma.patients_responsibles.findUnique({
        where: {
            patientId_responsibleId: {
                patientId,
                responsibleId: userId
            }
        }
    });

    return response !== null;
}

export async function isResponsible(userId: number, patientId: number): Promise<boolean> {
    return await getResponsible(patientId, userId) || userId === patientId;
}
