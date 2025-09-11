import * as React from "react";
import { renderMarkV2 } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the profile avatar
	spec: BrandSpecV2;
};

/**
 * IPhoneMockup
 * Display generated logo as profile avatar in iPhone X profile mockup
 */
export function IPhoneMockup({ spec }: Props) {
	// For social profiles, use mark-only with contrasting colors and proper sizing
	const profileSpec = React.useMemo(() => {
		return {
			...spec,
			template: 'mark-only' as const,
			colors: {
				...spec.colors,
				// Use current primary for mark; use background from spec (do NOT match primary)
				primary: spec.colors.primary || '#F97316',
				background: spec.colors.background || '#0B0B0F',
			},
			// Balanced padding so the mark fills well without clipping
			params: { ...spec.params, padding: 6 }
		};
	}, [spec]);
	
	const svg = React.useMemo(() => {
		// Render high-res, then make the SVG responsive to fit the circle naturally
		let s = renderMarkV2(profileSpec, 256);
		s = s
			.replace(/width="[^"]+"/i, 'width="100%"')
			.replace(/height="[^"]+"/i, 'height="100%"')
			.replace(/preserveAspectRatio="[^"]+"/i, 'preserveAspectRatio="xMidYMid meet"');
		return s;
	}, [profileSpec]);

	return (
		<div className="mx-auto w-full max-w-sm">
			<div className="relative rounded-3xl overflow-hidden shadow-2xl">
				{/* iPhone mockup background */}
				<img 
					src="/mockups/iphone-x-profile.jpg" 
					alt="iPhone X profile mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated logo positioned as profile avatar */}
				<div 
					className="absolute rounded-full overflow-hidden border-0 shadow-lg grid place-items-center"
					style={{
						// Positioned to exactly overlay the X profile avatar circle
						top: '13.7%',
						left: '8.4%',
						width: '15.5%',
						height: '8.1%',
						background: profileSpec.colors.background
					}}
				>
					{/* Inner box ~94% so the logo appears larger while staying inside the circle */}
					<div className="w-[70%] h-[70%]">
						<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
					</div>
				</div>
			</div>
		</div>
	);
}