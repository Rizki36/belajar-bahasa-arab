import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { cn } from "@/common/utils";

import useBab from "../../hooks/useBab";
import useSubBabList, { SubBabWithLesson } from "../../hooks/useSubBab";

type HeaderProps = {
  babNumber: number;
};

const Header: FC<HeaderProps> = ({ babNumber }) => {
  const [activeSubBab, setActiveSubBab] = useState<SubBabWithLesson | null>(
    null
  );

  const { bab } = useBab({ babNumber });
  const { subBabList } = useSubBabList({ babNumber });

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

  return (
    <div className={cn("top-0 sticky z-10")}>
      <div className={cn("bg-white h-3", "md:h-6")}></div>
      <div className="bg-[#692fce] mx-4 mb-6 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-2 bg-primary text-left text-white px-4 py-4">
          <div>
            <div className={cn("leading-none text-sm", "md:text-base")}>
              Bab {bab?.number} - Unit {activeSubBab?.number}
            </div>
            <div className={cn("text-md font-semibold", "md:text-lg")}>
              {activeSubBab?.name || "-"}
            </div>
          </div>
          <div className="shrink-0">
            <Link
              href="/list-bab"
              className="relative inline-flex items-center justify-center px-3 py-1 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white rounded-md shadow-md group"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-primary duration-300 -translate-x-full bg-white group-hover:translate-x-0 ease">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="absolute text-xs flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                List bab
              </span>
              <span className="relative invisible">List bab</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
