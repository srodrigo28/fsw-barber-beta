"use client"

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ptBR } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import SignInDialog from "./sign-in-dialog";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { getBookings } from "../_actions/get-bookings";
import { format, isPast, isToday, set } from "date-fns";
import { createBooking } from "../_actions/create-booking";
import {Barbershop, BarbershopService, Booking } from "@prisma/client";
import {
    Sheet,
    SheetTitle,
    SheetFooter,
    SheetHeader,
    SheetContent,
} from "./ui/sheet";

interface ServiceItemProps {
    service: BarbershopService
    barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
]

interface GetTimeListProps {
    bookings: Booking[]
    selectedDay: Date
}

const getTimeList = ({bookings, selectedDay}: GetTimeListProps) => {
    return TIME_LIST.filter(time => {
        const hour = Number(time.split(":")[0])
        const minutes = Number(time.split(":")[1])
        
        const timeIsOnThePast = isPast(set(new Date, {hours: hour, minutes: minutes}))
        if(timeIsOnThePast && isToday(selectedDay)){
            return false
        }

        const hasBookingOnCurrentTime = bookings.some(
            (booking) => booking.date.getHours() === hour &&
            booking.date.getMinutes() === minutes,
        )
        if(hasBookingOnCurrentTime) {
            return false
        }
        return true
    })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
    const {data} = useSession()
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(
        undefined
    )
    const [dayBookings, setDayBookings] = useState<Booking[]>([])
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            if(!selectedDay) return;
            const bookings = await getBookings({ date: selectedDay, serviceId: service.id })

            setDayBookings(bookings)
        }
        fetch()
    }, [selectedDay, service.id])

    const handleBookingClick = () => {
        if(data?.user){
            return setBookingSheetIsOpen(true)
        }

        return setSignInDialogIsOpen(true)
    }

    const handleBookingSheetOpenChange = () => {
        setSelectedDay(undefined)
        setSelectedTime(undefined)
        setDayBookings([])
        setBookingSheetIsOpen(false)
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleCreateBooking = async () => {
        try {
            if(!selectedDay || !selectedTime) return;
            // ["09": "00"]
            const hour    = Number(selectedTime?.split(":")[0])
            const minute  = Number(selectedTime?.split(":")[1])
            const newDate = set(selectedDay, {
                minutes: minute,
                hours: hour,
            })

            await createBooking({
                serviceId: service.id,
                date: newDate,
            })
            setBookingSheetIsOpen(false)
            toast.success("Reserva criada com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao criar a reserva!")
        }
    }

    const timeList = useMemo(() => {
        if(!selectedDay) return []
        return getTimeList({
            bookings: dayBookings,
            selectedDay
        })
    }, [dayBookings, selectedDay])

    return (
        <>
            <Card>
                <CardContent className="flex items-center gap-3 p-3">
                    {/* Imagem */}
                    <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
                        <Image src={service.imageUrl} alt={`Imagem do Serviço: ${service.name}`} fill className="rounded-lg object-cover" />
                    </div>

                    {/* Direita */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-400">{service.description}</p>
                        
                        {/* Preço e Botão */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-primary">
                                {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(Number(service.price))}
                            </p>

                            <Sheet
                                open={bookingSheetIsOpen}
                                onOpenChange={handleBookingSheetOpenChange}
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleBookingClick}
                                >
                                    Reservar
                                </Button>
                                <SheetContent className="px-0">
                                    <SheetHeader>
                                        <SheetTitle>Faça sua Reserva</SheetTitle>
                                    </SheetHeader>

                                        <div className="border-b border-solid py-5">
                                            <Calendar
                                                mode="single"
                                                locale={ptBR}
                                                selected={selectedDay}
                                                onSelect={handleDateSelect}
                                                fromDate={new Date()}
                                                styles={{
                                                    head_cell: {
                                                        width: "100%",
                                                        textTransform: "capitalize",
                                                    },
                                                    cell: {
                                                        width: "100%",
                                                    },
                                                    button: {
                                                        width: "100%",
                                                    },
                                                    nav_button_previous: {
                                                        width: "32px",
                                                        height: "32px",
                                                    },
                                                    nav_button_next: {
                                                        width: "32px",
                                                        height: "32px",
                                                    },
                                                    caption: {
                                                        textTransform: "capitalize",
                                                    },
                                                }}
                                            />
                                        </div>

                                        {selectedDay && (
                                            <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                                                {timeList.length > 0 ? timeList?.map((time) => (
                                                    <Button
                                                        key={time}
                                                        variant={selectedTime === time ? "default" : "outline"}
                                                        className="rounded-full"
                                                        onClick={() => handleTimeSelect(time)}
                                                    >
                                                        {time}
                                                    </Button>
                                                )) : (
                                                    <p className="text-xs">
                                                        😯 Não há horários diponíveis para este dia.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {selectedTime && selectedDay && (
                                            <div className="p-5">
                                                <Card>
                                                    <CardContent className="space-y-3 p-3">
                                                        <div className="flex items-center justify-between">
                                                            <h2>{service.name}</h2>

                                                            <p className="text-sm text-bold">
                                                                {Intl.NumberFormat("pt-BR", {
                                                                    style: "currency",
                                                                    currency: "BRL",
                                                                }).format(Number(service.price))}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <h2 className="text-sm text-gray-400">Data</h2>

                                                            <p className="text-sm">
                                                                {format(selectedDay, "d 'de' MMMM", {
                                                                    locale: ptBR
                                                                })}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <h2 className="text-sm text-gray-400">Horário</h2>

                                                            <p className="text-sm">
                                                                {selectedTime}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <h2 className="text-sm text-gray-400">Barbearia</h2>

                                                            <p className="text-sm">
                                                                {barbershop.name}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}
                                        <SheetFooter className="mt-5 px-5">
                                            <Button
                                                type="submit"
                                                onClick={handleCreateBooking}
                                                disabled={!selectedDay || !selectedTime}
                                            >
                                                    Confirmar
                                            </Button>
                                        </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={signInDialogIsOpen}
                onOpenChange={(open) => setSignInDialogIsOpen(open)}
            >
                <DialogContent className="w-[90%]">
                    <SignInDialog />
                </DialogContent>
            </Dialog>
        </>
    );
}
 
export default ServiceItem;