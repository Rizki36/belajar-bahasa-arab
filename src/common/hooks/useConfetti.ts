import confetti from "canvas-confetti";
import { useCallback } from "react";

export const useConfetti = () => {
	const fireConfetti = useCallback(() => {
		// Basic confetti burst
		confetti({
			particleCount: 150,
			spread: 70,
			origin: { y: 0.6 },
			zIndex: 100,
			colors: [
				"#ff0000",
				"#00ff00",
				"#0000ff",
				"#ffff00",
				"#ff00ff",
				"#00ffff",
				"#ffa500",
			],
		});
	}, []);

	const fireSuccessConfetti = useCallback(() => {
		// More celebratory confetti for correct answers
		const count = 200;
		const defaults = {
			origin: { y: 0.7 },
			zIndex: 100,
		};

		function fire(particleRatio: number, opts: confetti.Options) {
			confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio),
				colors: ["#26d0ce", "#1d4ed8", "#059669", "#dc2626", "#ca8a04"],
			});
		}

		fire(0.25, {
			spread: 26,
			startVelocity: 55,
		});

		fire(0.2, {
			spread: 60,
		});

		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}, []);

	const fireCelebrationConfetti = useCallback(() => {
		// Multiple bursts for big celebrations (like completing lesson)
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	}, []);

	return {
		fireConfetti,
		fireSuccessConfetti,
		fireCelebrationConfetti,
	};
};
