import { db } from "../_lib/prisma";
import { authOptions } from "@/app/_lib/auth"
import Header from "../_components/header";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import BookingItem from "../_components/booking-item";

const Bookings = async () => {
    const session = await getServerSession(authOptions)
    if(!session?.user){
        return notFound()
    }
    const confirmedBookings = await db.booking.findMany({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (session?.user as any).id,
            date: {
                gte: new Date()
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
    const concludedBookings = await db.booking.findMany({
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

    return (
        <>
            <Header />
            <div className="space-y-3 p-5">
                <h1 className="text-xl font-bold">Agendamentos</h1>

                {confirmedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 ml-1 text-xs font-bold uppercase text-gray-400">
                            Confirmados
                        </h2>
                        {confirmedBookings.map((booking) =>
                            <BookingItem key={booking.id} booking={booking} />
                        )}
                    </>
                )}

                {concludedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 ml-1 text-xs font-bold uppercase text-gray-400">
                            Finalizados
                        </h2>
                        {concludedBookings.map((booking) =>
                            <BookingItem key={booking.id} booking={booking} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
 
export default Bookings;
