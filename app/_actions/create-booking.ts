"use server"

import { db } from "../_lib/prisma"
import { authOptions } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

interface CreateBookingParams {
    serviceId: string;
    date: Date;
}

export const createBooking = async (params: CreateBookingParams) => { // Função server action
    const user = await getServerSession(authOptions)
    if(!user) {
        throw new Error("Você não pode acessar essa rota, pois você precisa estar autenticado!! >:(")
    }
    await db.booking.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {...params, userId: (user.user as any).id},
    })
    revalidatePath('/barbershops/[id]')
}
