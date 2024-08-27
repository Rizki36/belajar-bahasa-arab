import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import * as React from "react";

import { Button } from "@/common/components/ui/button";
import { isActiveLink } from "@/common/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
  },
  {
    title: "Bab",
    url: "/admin/bab",
    routes: ["/admin/bab", "/admin/sub-bab", "/admin/lesson"],
  },
  {
    title: "Siswa",
    url: "/admin/siswa",
    routes: ["/admin/siswa"],
  },
  {
    title: "Pengaturan",
    url: "/admin/setting",
  },
];

export const SidebarDesktop = () => {
  const router = useRouter();

  return (
    <div className="w-[250px] flex flex-col fixed h-screen left-0 top-0 bottom-0 overflow-x-hidden overflow-y-auto border-r">
      <div className="flex justify-center mt-6 mb-8">
        <Link
          href="/admin"
          className="mx-2 text-primary leading-none font-semibold text-xl text-center"
        >
          Belajar <br /> Bahasa Arab
          <span className="block text-sm">تعلم اللغة العربية</span>
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        {menuItems.map((item) => (
          <Link key={item.url} href={item.url} className="mx-2">
            <Button
              className="w-full justify-between"
              variant={
                isActiveLink(router.pathname, item.url, item.routes)
                  ? "default"
                  : "ghost"
              }
            >
              {item.title}
            </Button>
          </Link>
        ))}
      </div>

      <div>
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            signOut();
          }}
        >
          Keluar
        </Button>
      </div>
    </div>
  );
};
