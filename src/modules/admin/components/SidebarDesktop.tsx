import { ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import { cn, isActiveLink } from "@/common/utils";

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
		title: "Manual Book",
		url: "/admin/manual-book",
	},
	{
		title: "Pengaturan",
		url: "/admin/setting",
	},
];

type SidebarDesktopProps = {
	isOpen?: boolean;
	onToggle?: () => void;
};

export const SidebarDesktop = (props: SidebarDesktopProps) => {
	const { isOpen = true, onToggle } = props;
	const router = useRouter();

	return (
		<>
			{/* Toggle Button for Mobile */}
			<Button
				className="fixed top-4 left-4 z-[60] md:hidden bg-primary text-white hover:bg-primary/90"
				size="sm"
				onClick={onToggle}
			>
				<HamburgerMenuIcon />
			</Button>

			{/* Overlay for Mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden"
					onClick={onToggle}
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					// Base styles
					"fixed left-0 top-0 h-full z-50 bg-primary flex flex-col transition-transform duration-300 ease-in-out",
					// Desktop styles
					"md:translate-x-0 md:w-[250px] md:border-r-[8px] md:border-r-primary-dark1",
					// Mobile styles
					"w-[280px] shadow-lg",
					// Conditional transform for mobile
					isOpen ? "translate-x-0" : "-translate-x-full",
					// Always show on desktop
					"md:flex",
				)}
			>
				<div
					className={cn(
						"flex items-center text-center justify-center my-5 text-white font-bold",
						"text-sm md:text-lg lg:text-xl",
					)}
				>
					<Link href="/admin">
						<div className="hidden md:block">الصَّرْفُ المُيَسَّرُ</div>
						<div className="text-lg md:text-xl lg:text-2xl leading-none">
							Mudah Belajar <br /> Ilmu Shorof
						</div>
					</Link>
				</div>
				<div className="flex-1 flex flex-col mt-6 space-y-1 px-2">
					{menuItems.map((item) => {
						const isActive = isActiveLink(
							router.pathname,
							item.url,
							item.routes,
						);
						return (
							<Button
								key={item.url}
								variant={"ghost"}
								size="lg"
								className={cn(
									"hover:!text-primary text-white w-full justify-start gap-3 px-4",
									{
										"bg-white !text-primary": isActive,
									},
								)}
								onClick={() => {
									if (isActive) return;
									router.push(item.url);
									// Close sidebar on mobile after navigation
									if (window.innerWidth < 768 && onToggle) {
										onToggle();
									}
								}}
							>
								<span>{item.title}</span>
							</Button>
						);
					})}
				</div>
				<Button3D
					variant="white"
					className="mb-3 mx-2"
					onClick={async () => {
						await signOut({
							callbackUrl: "/",
							redirect: true,
						});
					}}
				>
					<span className="hidden md:inline-block">Keluar</span>
					<span className="inline-block md:hidden">
						<ExitIcon />
					</span>
				</Button3D>
			</div>
		</>
	);
};
