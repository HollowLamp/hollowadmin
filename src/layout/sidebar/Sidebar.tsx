import { useState } from "react";
import { NavLink } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import style from "./sidebar.module.css";

type NavItem = {
  label: string;
  path: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "首页", path: "/" },
  { label: "分类", path: "/category" },
  {
    label: "内容",
    path: "/content",
    children: [
      { label: "创建内容", path: "/content/create" },
      { label: "查看内容", path: "/content/view" },
    ],
  },
  { label: "评论", path: "/comment" },
];

type SidebarItemProps = {
  label: string;
  path: string;
  children?: NavItem[];
  closeNavbar: () => void;
};

const Sidebar = ({ closeNavbar }: { closeNavbar: () => void }) => {
  return (
    <div className={style.sidebar}>
      {navItems.map((item) => (
        <SidebarItem key={item.path} {...item} closeNavbar={closeNavbar} />
      ))}
    </div>
  );
};

const SidebarItem = ({
  label,
  path,
  children,
  closeNavbar,
}: SidebarItemProps) => {
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  const location = useLocation();

  const handleClick = () => {
    if (children) {
      setOpened(!opened);
    } else if (isMobile) {
      closeNavbar();
    }
  };

  return (
    <>
      <NavLink
        label={label}
        component={Link}
        to={path}
        onClick={handleClick}
        childrenOffset={children ? 20 : 0}
        active={location.pathname === path}
      >
        {children &&
          children.map((child) => (
            <NavLink
              key={child.path}
              label={child.label}
              component={Link}
              to={child.path}
              onClick={isMobile ? closeNavbar : undefined}
              active={location.pathname === child.path}
            />
          ))}
      </NavLink>
    </>
  );
};

export default Sidebar;
