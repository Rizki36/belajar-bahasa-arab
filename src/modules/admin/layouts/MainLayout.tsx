import type { ReactNode } from "react";

import { cn } from "@/common/utils";

import { SidebarDesktop } from "../components/SidebarDesktop";

type AdminMainLayoutProps = {
	children: ReactNode;
};

const AdminMainLayout = (props: AdminMainLayoutProps) => {
	const { children } = props;

	return (
		<div className={cn("flex")}>
			<SidebarDesktop />
			<div className="flex-1 py-6 px-10 ml-[250px]">{children}</div>
		</div>
	);
};

export default AdminMainLayout;
