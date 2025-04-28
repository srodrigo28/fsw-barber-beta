import Header from "../_components/header";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import BookingItem from "../_components/booking-item";
import { getConcludedBookings } from "../_data/get-concluded-bookings";
import { getConfirmedBookings } from "../_data/get-confirmed-bookings";

const Bookings = async () => {
    const session = await getServerSession(authOptions)
    if(!session?.user){
        // TODO: mostrar pop-up login
        return notFound()
    }

    const confirmedBookings = await getConfirmedBookings()
    const concludedBookings = await getConcludedBookings()

    return (
        <>
            <Header />
            <div className="space-y-3 p-5">
                <h1 className="text-xl font-bold">Agendamentos</h1>
                {confirmedBookings.length === 0 && concludedBookings.length === 0 && (
                    <p className="text-gray-400">Você não tem agendamentos.</p>
                )}

                {confirmedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 ml-1 text-xs font-bold uppercase text-gray-400">
                            Confirmados
                        </h2>
                        {confirmedBookings.map((booking) =>
                            <BookingItem
                                key={booking.id}
                                booking={JSON.parse(JSON.stringify(booking))}
                            />
                        )}
                    </>
                )}

                {concludedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 ml-1 text-xs font-bold uppercase text-gray-400">
                            Finalizados
                        </h2>
                        {concludedBookings.map((booking) =>
                            <BookingItem
                                key={booking.id}
                                booking={JSON.parse(JSON.stringify(booking))}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
 
export default Bookings;