import { AppShell, Burger, Image, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom, useSetAtom } from "jotai";
import { isAuthenticatedAtom, tokenAtom } from "@/store/authAtom";
import style from "./layout.module.css";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import LoginModal from "./login/LoginModal";
import ThemeSwitcher from "@/components/themeswitcher/ThemeSwitcher";

const AppLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const [loginModalOpened, { open: openLoginModal, close: closeLoginModal }] =
    useDisclosure(false);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(tokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <>
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

          {isAuthenticated ? (
            <Menu
              shadow="md"
              width={70}
              trigger="hover"
              classNames={{
                item: style.menuItem,
              }}
            >
              <Menu.Target>
                <Image
                  radius="xs"
                  src="/avatar.jpg"
                  height={50}
                  classNames={{
                    root: style.img,
                  }}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleLogout} c="red">
                  登出
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Image
              radius="xs"
              src="/avatar.jpg"
              height={50}
              onClick={openLoginModal}
              style={{ cursor: "pointer" }}
              classNames={{
                root: style.img,
              }}
            />
          )}

          <ThemeSwitcher />
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Sidebar closeNavbar={close} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>

      <LoginModal opened={loginModalOpened} onClose={closeLoginModal} />
    </>
  );
};

export default AppLayout;
