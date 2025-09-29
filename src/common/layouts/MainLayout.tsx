import Link from "next/link";
import type { ReactNode } from "react";

import SidebarDesktop from "../components/SidebarDesktop";
import { menuItems } from "../constants";
import { cn } from "../utils";

type ClientMainLayoutProps = {
	children: ReactNode;
};

const ClientMainLayout = (props: ClientMainLayoutProps) => {
	const { children } = props;

	return (
		<div
			className={cn(
				"flex relative bg-gradient-to-b from-white to-primary/5 min-h-screen",
				"md:pl-[60px]",
				"lg:pl-[250px]",
			)}
		>
			<SidebarDesktop />
			<div className="flex-1 pb-[53px] md:pb-0">{children}</div>
			<div className="flex py-3 justify-center gap-x-16 md:hidden border-t shadow-lg bg-white fixed bottom-0 inset-x-0 z-50">
				{menuItems.map((menu) => {
					return (
						<Link key={menu.id} href={menu.url}>
							{menu.icon}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default ClientMainLayout;
