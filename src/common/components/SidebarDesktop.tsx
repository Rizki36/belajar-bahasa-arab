import { ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { menuItems } from "../constants";
import { cn, isActiveLink } from "../utils";
import Button3D from "./ui/3d-button";
import { Button } from "./ui/button";

type SidebarDesktopProps = {};

const SidebarDesktop = (props: SidebarDesktopProps) => {
	const {} = props;
	const router = useRouter();

	return (
		<div
			className={cn(
				"lg:w-[250px] lg:border-r-[8px]",
				"md:flex w-[60px] h-svh block fixed left-0 border-r-primary-dark1 flex-col",
				"hidden bg-primary border-r-0",
			)}
		>
			<div
				className={cn(
					"text-xs flex items-center text-center justify-center my-5 text-white font-bold",
					"lg:text-2xl",
				)}
			>
				<Link href="/belajar">
					<div className="hidden lg:block">الصَّرْفُ المُيَسَّرُ</div>
					<div className=" lg:text-2xl leading-none">
						Mudah Belajar <br /> Ilmu Shorof
					</div>
				</Link>
			</div>
			<div className="flex-1 flex flex-col mt-6 space-y-1 items-center lg:items-stretch">
				{menuItems.map((item) => {
					const isActive = isActiveLink(router.pathname, item.url, item.routes);
					return (
						<Button
							key={item.id}
							variant={"ghost"}
							size="lg"
							className={cn(
								"hover:!text-primary text-white w-10 justify-center lg:w-auto lg:justify-start lg:mr-4 lg:rounded-l-none gap-3 px-0 lg:px-4",
								{
									"bg-white !text-primary": isActive,
								},
							)}
							onClick={() => {
								if (isActive) return;
								router.push(`/${item.url}`);
							}}
						>
							{item.icon}
							<span className={cn("hidden", "lg:inline-block")}>
								{item.name}
							</span>
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
				<span className="hidden lg:inline-block">Keluar</span>
				<span className="inline-block lg:hidden">
					<ExitIcon />
				</span>
			</Button3D>
		</div>
	);
};

export default SidebarDesktop;
