import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
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
	// For social profiles, always use social-avatar context (icon or monogram)
	const profileSpec = React.useMemo(() => {
		return {
			...spec,
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
	
	const assets = React.useMemo(() => {
		return generateAllAssets(profileSpec, 256);
	}, [profileSpec]);
	
	const svg = React.useMemo(() => {
		// Get appropriate asset for social avatar context
		let s = getAssetForContext(assets, 'social-avatar');
		s = s
			.replace(/width="[^"]+"/i, 'width="100%"')
			.replace(/height="[^"]+"/i, 'height="100%"')
			.replace(/preserveAspectRatio="[^"]+"/i, 'preserveAspectRatio="xMidYMid meet"')
			// Remove background rect to make it transparent since we're showing gradient on the container
			.replace(/<rect[^>]*fill="[^"]*"[^>]*\/?>(?:<\/rect>)?/g, '');
		return s;
	}, [assets]);

	return (
		<div className="mx-auto w-full max-w-sm">
			<p className="mb-2 text-xs text-muted-foreground">
				Note: Social profile avatars automatically show icon-only or monogram. Text-based logos will display as a monogram.
			</p>
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
						background: spec.background.type === 'solid' 
							? spec.background.color
							: `linear-gradient(${spec.background.angle}deg, ${spec.background.stops.map(s => `${s.color} ${s.at * 100}%`).join(', ')})`
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