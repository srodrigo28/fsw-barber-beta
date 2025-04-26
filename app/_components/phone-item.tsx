"use client"

import { toast } from "sonner";
import { Button } from "./ui/button";
import { SmartphoneIcon } from "lucide-react";

interface IPhoneItemProp {
    phone: string
}

const PhoneItem = ({phone}: IPhoneItemProp) => {
    
    const handleCopyPhoneClick = (phone: string) => {
        navigator.clipboard.writeText(phone)
        toast.success("Telefone copiado com sucesso!")
    }

    return (
        <div className="flex justify-between" key={phone}>
            {/* Esquerda */}
            <div className="flex items-center gap-2">
                <SmartphoneIcon />
                <p className="text-sm">{phone}</p>
            </div>
            {/* Direita */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyPhoneClick(phone)}
            >
                Copiar
            </Button>
        </div>
    );
}
 
export default PhoneItem;