import { ContentType } from "@prisma/client";
import Book from "../icons/Book";
import HomeIcon from "../icons/Home";
import LeaderBoardIcon from "../icons/Leaderboard";
import SettingIcon from "../icons/Setting";

export const menuItems = [
	{
		id: "learn",
		name: "Belajar",
		icon: <HomeIcon className="size-7" />,
		url: "/belajar",
		routes: ["/belajar", "/list-bab"],
	},
	{
		id: "ranking",
		name: "Papan Peringkat",
		icon: <LeaderBoardIcon className="size-7" />,
		url: "/papan-peringkat",
		routes: [],
	},
	{
		id: "manual",
		name: "Buku Manual",
		icon: <Book className="size-7" />,
		url: "/manual-book",
		routes: [],
	},
	{
		id: "setting",
		name: "Pengaturan",
		icon: <SettingIcon className="size-7" />,
		url: "/pengaturan",
		routes: [],
	},
];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
	[ContentType.pdf]: "PDF",
	[ContentType.video]: "Video",
	[ContentType.quiz]: "Quiz",
	[ContentType.mixed]: "Campuran",
};
