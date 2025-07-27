import { useMemo } from "react";

import { trpc } from "@/utils/trpc";

type Config = {
	randomizeQuestion: boolean;
	randomizeAnswer: boolean;
	defaultScore: number;
	adminManualBookUrl: string;
	studentManualBookUrl: string;
};

export const defaultConfig: Config = {
	randomizeQuestion: false,
	randomizeAnswer: false,
	defaultScore: 10,
	adminManualBookUrl: "",
	studentManualBookUrl: "",
};

export const generateConfig = (
	config: {
		value: string;
		name: string;
	}[],
) => {
	return {
		randomizeQuestion:
			(config.find((item) => item.name === "randomizeQuestion")?.value ??
				defaultConfig.randomizeQuestion.toString) === "true",
		randomizeAnswer:
			(config.find((item) => item.name === "randomizeAnswer")?.value ??
				defaultConfig.randomizeAnswer.toString()) === "true",
		defaultScore: Number(
			config.find((item) => item.name === "defaultScore")?.value ??
				defaultConfig.defaultScore,
		),
		adminManualBookUrl:
			config.find((item) => item.name === "adminManualBookUrl")?.value ??
			defaultConfig.adminManualBookUrl,
		studentManualBookUrl:
			config.find((item) => item.name === "studentManualBookUrl")?.value ??
			defaultConfig.studentManualBookUrl,
	};
};

const useSystemSetting = () => {
	const {
		data: settingData,
		isLoading,
		error,
	} = trpc.protected.list.useQuery(
		{},
		{
			// 10 minutes
			staleTime: 1000 * 60 * 10,
		},
	);
	const setting = settingData?.items;

	const config: Config = useMemo(() => {
		if (isLoading) return defaultConfig;
		return generateConfig(setting ?? []);
	}, [setting, isLoading]);

	return {
		error,
		config,
		loading: isLoading,
	};
};

export default useSystemSetting;
