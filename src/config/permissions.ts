import { prisma } from "../http/prisma";

export enum Roles {
    PATIENT = "PATIENT",
    RESPONSIBLE = "RESPONSIBLE"
}

export async function isResponsible(patientId: number, userId: number): Promise<boolean> {
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
