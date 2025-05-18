import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-background/70 backdrop-blur-md"
    >
      <NavbarContent className="basis-1/5 sm:basis-full">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <p className="font-bold text-primary">🌶️</p>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2"></ul>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <NavbarBrand as="li" className="max-w-fit">
          <p className="font-bold">
            <span className="text-primary">Chilli</span>
            <span className="text-secondary">Chops</span>
          </p>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2"></ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
    </HeroUINavbar>
  );
};
