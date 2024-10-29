import { AppShell, Burger, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import style from "./layout.module.css";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      classNames={{
        header: style.header,
        navbar: style.nav,
        main: style.main,
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Image
          radius="xs"
          src="/avatar.jpg"
          height={50}
          classNames={{
            root: style.img,
          }}
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar closeNavbar={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
