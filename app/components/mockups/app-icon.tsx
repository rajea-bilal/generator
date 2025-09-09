import * as React from "react";
import { renderMarkV2 } from "../../lib/brand-kit";
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
	// Render a large SVG once, then scale down to the requested size for crisp edges
	const svg = React.useMemo(() => renderMarkV2(spec, 256), [spec]);
	const scale = size / 256;

	return (
		<div
			className="relative grid place-items-center rounded-2xl overflow-hidden shadow-sm border border-neutral-200"
			style={{ width: size, height: size, background: spec.colors.background }}
		>
			{/* Subtle gloss/lighting overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_35%)]" />
			{/* Scaled SVG mark centered */}
			<div
				style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
				className="w-[256px] h-[256px] grid place-items-center"
				dangerouslySetInnerHTML={{ __html: svg }}
			/>
		</div>
	);
}


