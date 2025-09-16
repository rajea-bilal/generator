import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
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
	// For app icons, always use the icon/mark asset (context-aware selection)
	const baseSpec = React.useMemo<BrandSpecV2>(() => ({
		...spec,
		params: { ...spec.params, padding: 0 },
	}), [spec]);

	const assets = React.useMemo(() => {
		return generateAllAssets(baseSpec, size);
	}, [baseSpec, size]);

	const appIconSvg = React.useMemo(() => {
		// App icons should always use icon-only context
		const svg = getAssetForContext(assets, 'app-icon');
		// Ensure it covers the square frame without letterboxing
		return svg.replace('preserveAspectRatio="xMidYMid meet"', 'preserveAspectRatio="xMidYMid slice"');
	}, [assets]);

	return (
		<div
			className="relative grid place-items-center rounded-2xl overflow-hidden shadow-sm border border-neutral-200"
			style={{ width: size, height: size, background: spec.colors.background }}
		>
			{/* Artwork */}
			<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: appIconSvg }} />
			{/* Subtle gloss/lighting overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_35%)]" />
		</div>
	);
}


