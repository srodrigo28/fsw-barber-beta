import Link from "next/link";
import { Card, CardContent } from "./ui/card";

const Footer = () => {
    return (
        <footer>
            <Card>
                <Link href="https://wa.me/5562998579084" className="font-bold">
                    <CardContent className="px-5 py-6">
                        <p className="text-sm text-gray-400">Contato rápido
                            Treina-Dev </p>
                    </CardContent>
                </Link>
            </Card>
        </footer>
    );
}
 
export default Footer;