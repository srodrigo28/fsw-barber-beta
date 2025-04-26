import Image from "next/image";
import { Button } from "./ui/button";
import SidebarSheet from "./sidebar-sheet";
import { MenuIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

const Header = () => {
  return(
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image alt="Barbearia FSW" src="/logo.png" width={120} height={18} />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default Header