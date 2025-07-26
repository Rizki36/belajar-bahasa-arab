import { useEffect, useState } from "react";
import { SubBabWithLesson } from "./useSubBab";

export const useActiveSubBab = (subBabList: SubBabWithLesson[] | undefined) => {
	const [activeSubBab, setActiveSubBab] = useState<SubBabWithLesson | null>(
		null,
	);

	useEffect(() => {
		if (!activeSubBab && subBabList?.length) {
			setActiveSubBab(subBabList[0]);
		}
	}, [activeSubBab, subBabList]);

	useEffect(() => {
		const handleScroll = () => {
			if (!subBabList) return;

			const items = subBabList.map((subBab) => {
				const subBabElement = document.getElementById(subBab.id);
				if (!subBabElement) {
					return null;
				}

				return {
					id: subBab.id,
					top: subBabElement.getBoundingClientRect().top,
					item: subBab,
				};
			});

			// find the closest item to the top
			let closestItem = items[0];

			items.forEach((item) => {
				if (item && item.top < 0) {
					closestItem = item;
				}
			});

			if (closestItem?.item) setActiveSubBab(closestItem?.item);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [subBabList]);

	return { activeSubBab };
};

export default useActiveSubBab;
