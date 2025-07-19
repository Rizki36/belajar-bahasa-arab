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
		id: "setting",
		name: "Pengaturan",
		icon: <SettingIcon className="size-7" />,
		url: "/pengaturan",
		routes: [],
	},
];
