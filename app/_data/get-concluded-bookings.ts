"use server"

import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { getServerSession } from "next-auth";

export const getConcludedBookings = async () => {
    const session = await getServerSession(authOptions)
    if(!session?.user) {
        return []
    }

    return await db.booking.findMany({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (session?.user as any).id,
            date: {
                lt: new Date()
            }
        },
        include: {
            service: {
                include: {
                    barbershop: true,
                },
            },
        },
        orderBy: {
            date: "asc",
        }
    })
}