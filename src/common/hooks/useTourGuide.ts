import { useTour } from "@reactour/tour";
import { useLocalStorage } from "./useLocalStorage";

const TOUR_STORAGE_KEY = "belajar-bahasa-arab-tours";

type PageTourState = {
    hasCompletedTour: boolean;
    completedAt?: string;
};

type AllToursState = {
    [pageId: string]: PageTourState;
};

export const useTourGuide = (pageId: string = "default") => {
    const { setIsOpen: setIsOpenReactTour } = useTour();

    const [allToursState, setAllToursState] = useLocalStorage<AllToursState>(
        TOUR_STORAGE_KEY,
        {},
    );

    // Get current page tour state
    const currentPageTourState: PageTourState = allToursState[pageId] || {
        hasCompletedTour: false,
        completedAt: undefined,
    };

    const markTourAsCompleted = () => {
        setAllToursState({
            ...allToursState,
            [pageId]: {
                hasCompletedTour: true,
                completedAt: new Date().toISOString(),
            },
        });
    };

    const resetTour = () => {
        setAllToursState({
            ...allToursState,
            [pageId]: {
                hasCompletedTour: false,
                completedAt: undefined,
            },
        });
    };

    const resetAllTours = () => {
        setAllToursState({});
    };

    const shouldShowTour = () => {
        return !currentPageTourState.hasCompletedTour;
    };

    const getTourStateForPage = (targetPageId: string): PageTourState => {
        return allToursState[targetPageId] || {
            hasCompletedTour: false,
            completedAt: undefined,
        };
    };

    const getCompletedTours = (): string[] => {
        return Object.keys(allToursState).filter(
            (key) => allToursState[key]?.hasCompletedTour
        );
    };

    const getTotalCompletedTours = (): number => {
        return getCompletedTours().length;
    };

    const setIsOpen = (isOpen: boolean, delay: number = 0) => {
        if (delay > 0) {
            setTimeout(() => {
                setIsOpenReactTour(isOpen);
            }, delay);
        } else {
            setIsOpenReactTour(isOpen);
        }
    };

    return {
        // Current page state
        tourState: currentPageTourState,
        markTourAsCompleted,
        resetTour,
        shouldShowTour,

        // Multi-page utilities
        allToursState,
        resetAllTours,
        getTourStateForPage,
        getCompletedTours,
        getTotalCompletedTours,

        // Current page ID
        pageId,

        // React Tour control
        setIsOpen
    };
};