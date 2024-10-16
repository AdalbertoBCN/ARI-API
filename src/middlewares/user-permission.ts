import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../http/prisma";
import { z } from "zod";
import { isResponsible } from "../config/permissions";
import { FastifyReply, FastifyRequest } from "fastify";

const getPrescriptionsSchema = z.object({
    patientId: z.coerce.number(),
    userId: z.coerce.number(),
});

export const userPermission = async (
    req: FastifyRequest,
    res: FastifyReply,
    done: (err?: Error) => void
  ): Promise<void> => {
    const { patientId, userId } =  getPrescriptionsSchema.parse(req.params)

    if(userId === patientId){
        done();
    }else if(!(await isResponsible(patientId, userId))){
        return res.status(403).send({ message: 'Usuário não autorizado' });
    }

    done();
  };