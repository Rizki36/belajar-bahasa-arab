import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/common/utils";

import { SidebarDesktop } from "../components/SidebarDesktop";

type AdminMainLayoutProps = {
	children: ReactNode;
};

const AdminMainLayout = (props: AdminMainLayoutProps) => {
	const { children } = props;
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className={cn("flex min-h-screen")}>
			<SidebarDesktop isOpen={sidebarOpen} onToggle={toggleSidebar} />
			<div className="flex-1 py-6 px-4 md:px-10 md:ml-[250px] transition-all duration-300 pt-16 md:pt-6">
				{children}
			</div>
		</div>
	);
};

export default AdminMainLayout;
