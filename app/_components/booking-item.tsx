"use client"

import Image from "next/image";
import { Badge } from "./ui/badge";
import PhoneItem from "./phone-item";
import { Button } from "./ui/button";
import { ptBR } from "date-fns/locale";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "./ui/sheet";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { deleteBooking } from "../_actions/delete-booking";
import { toast } from "sonner";
import { useState } from "react";

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
      include: {
        service: {
          include: {
            barbershop: true
          }
        }
      }
    }>
}

// TODO: receber agendamento como prop
const BookingItem = ({ booking }: BookingItemProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const {
        service: {barbershop},
    } = booking
    const isConfirmed = isFuture(booking.date)
    const handleCancelBookingClick = async () => {
        try {
            await deleteBooking(booking.id)
            setIsSheetOpen(false)
            toast.success("Reserva cancelada com sucesso! :D")
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cancelar a reserva! T-T Tente novamente.")
        }
    }
    const handleSheetOpenChange = (isOpen: boolean) => {
        setIsSheetOpen(isOpen)
    }
    return (
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger className="w-full min-w-[90%]">
                <Card className="min-w-[90%]">
                    <CardContent className="flex justify-between p-0">
                        {/* Esquerda */}
                        <div className="flex flex-col gap-2 py-5 pl-5">
                            <Badge
                                className="w-fit"
                                variant={isConfirmed ? "default" : "secondary"}
                            >
                                {isConfirmed ? "Confirmado" : "Finalizado"}
                            </Badge>
                            <h3 className="font-semibold">{booking.service.name}</h3>

                            <div className="gap-2 flex items-center">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={booking.service.barbershop.imageUrl} />
                                </Avatar>

                                <p className="text-sm">Barbearia FSW</p>
                            </div>
                        </div>
                        
                        {/* Direita */}
                        <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="text-sm">
                                {format(booking.date, "MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-2xl">
                                {format(booking.date, "dd", { locale: ptBR })}
                            </p>
                            <p className="text-sm">
                                {format(booking.date, "HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger><SheetTrigger>
                <Card className="min-w-[90%]">
                    <CardContent className="flex justify-between p-0">
                        {/* Esquerda */}
                        <div className="flex flex-col gap-2 py-5 pl-5">
                            <Badge
                                className="w-fit"
                                variant={isConfirmed ? "default" : "secondary"}
                            >
                                {isConfirmed ? "Confirmado" : "Finalizado"}
                            </Badge>
                            <h3 className="font-semibold">{booking.service.name}</h3>

                            <div className="gap-2 flex items-center">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={booking.service.barbershop.imageUrl} />
                                </Avatar>

                                <p className="text-sm">Barbearia FSW</p>
                            </div>
                        </div>
                        
                        {/* Direita */}
                        <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="text-sm">
                                {format(booking.date, "MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-2xl">
                                {format(booking.date, "dd", { locale: ptBR })}
                            </p>
                            <p className="text-sm">
                                {format(booking.date, "HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>
            <SheetContent className="w-[90%)]">
                <SheetHeader>
                    <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
                </SheetHeader>

                <div className="relative flex items-end h-[180px] w-full">
                    <Image
                        fill
                        src="/map.png"
                        className="rounded-md object-cover"
                        alt={`Mapa da Barbearia ${booking.service.barbershop.name}`}
                    />

                    <Card className="z-50 w-full mb-3 mx-3 rounded-md">
                        <CardContent className="flex items-center gap-3 px-5 py-3">
                            <Avatar>
                                <AvatarImage src={barbershop.imageUrl} />
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{barbershop.name}</h3>
                                <p className="font-xs">{barbershop.address}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6">
                    <Badge
                        className="w-fit"
                        variant={isConfirmed ? "default" : "secondary"}
                    >
                        {isConfirmed ? "Confirmado" : "Finalizado"}
                    </Badge>

                    <Card className="mt-3 mb-6">
                        <CardContent className="space-y-3 p-3">
                            <div className="flex items-center justify-between">
                                <h2>{booking.service.name}</h2>

                                <p className="text-sm text-bold">
                                    {Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Number(booking.service.price))}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <h2 className="text-sm text-gray-400">Data</h2>

                                <p className="text-sm">
                                    {format(booking.date, "d 'de' MMMM", {
                                        locale: ptBR
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <h2 className="text-sm text-gray-400">Horário</h2>

                                <p className="text-sm">
                                    {format(booking.date, "HH:mm", {
                                        locale: ptBR
                                    })}
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

                    <div className="space-y-3">
                        {barbershop.phones.map((phone, index) => (
                            <PhoneItem key={index} phone={phone} />
                        ))}
                    </div>
                </div>
                <SheetFooter className="mt-6">
                    <div className="flex items-center gap-3">
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full">Voltar</Button>
                        </SheetClose>

                        {isConfirmed && (
                            <Dialog>
                                <DialogTrigger className="w-full">
                                <Button variant="destructive" className="w-full">
                                    Cancelar Reserva
                                </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[90%]">
                                <DialogHeader>
                                    <DialogTitle>Você deseja cancelar sua reserva?</DialogTitle>
                                    <DialogDescription>
                                    Ao cancelar, você perderá sua reserva e não poderá
                                    recuperá-la. Essa ação é irreversível.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex flex-row gap-3">
                                    <DialogClose asChild>
                                        <Button variant="secondary" className="w-full">
                                            Voltar
                                        </Button>
                                    </DialogClose>
                                    <DialogClose className="w-full">
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={handleCancelBookingClick}
                                        >
                                            Confirmar
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
 
export default BookingItem;