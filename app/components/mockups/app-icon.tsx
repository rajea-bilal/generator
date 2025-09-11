import * as React from "react";
import { renderMarkV2, renderLockupV2 } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the icon mark
	spec: BrandSpecV2;
	// Pixel size of the mockup square (e.g. 64, 128, 192)
	size: number;
};

/**
 * AppIconMockup
 * Minimal, CSS‑only app icon frame with rounded corners and subtle elevation.
 * Renders the brand mark inside while preserving consistent padding.
 */
export function AppIconMockup({ spec, size }: Props) {
	// For app icons we want the artwork to fully cover the square.
	// - When template is mark-only: render the mark with zero padding
	// - When template has text (lockup/badge/stacked): render the lockup, and force `slice` so it fills/crops as needed
	const baseSpec = React.useMemo<BrandSpecV2>(() => ({
		...spec,
		params: { ...spec.params, padding: 0 },
	}), [spec]);

	const rawSvg = React.useMemo(() => {
		if (spec.template === "mark-only") {
			return renderMarkV2(baseSpec, size);
		}
		const lockup = renderLockupV2(baseSpec, size);
		// Ensure the lockup "covers" the square frame without letterboxing
		return lockup.replace('preserveAspectRatio="xMidYMid meet"', 'preserveAspectRatio="xMidYMid slice"');
	}, [baseSpec, size, spec.template]);

	return (
		<div
			className="relative grid place-items-center rounded-2xl overflow-hidden shadow-sm border border-neutral-200"
			style={{ width: size, height: size, background: spec.colors.background }}
		>
			{/* Artwork */}
			<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: rawSvg }} />
			{/* Subtle gloss/lighting overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_35%)]" />
		</div>
	);
}


