import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the logo lockup
	spec: BrandSpecV2;
};

/**
 * WebsiteMockup
 * Display generated logo lockup in website navigation bar mockup
 */
export function WebsiteMockup({ spec }: Props) {
	// Website headers use context-aware selection (lockup preferred, wordmark fallback)
	const websiteSpec = React.useMemo(() => {
		return {
			...spec,
			colors: {
				...spec.colors,
				text: '#FFFFFF', // White text for visibility on website
				primary: spec.colors.primary || '#F97316'
			}
		};
	}, [spec]);
	
	const assets = React.useMemo(() => {
		return generateAllAssets(websiteSpec, 128);
	}, [websiteSpec]);
	
	const svg = React.useMemo(() => {
		return getAssetForContext(assets, 'website-header');
	}, [assets]);

	return (
		<div className="mx-auto w-full max-w-4xl">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* Website mockup background */}
				<img 
					src="/mockups/website-mockup.png" 
					alt="Website mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated logo positioned exactly over gray logo box */}
				<div 
					className="absolute grid place-items-center"
					style={{
						top: '2.8%',
						left: '3.2%',
						width: '8.5%',
						height: '4.2%'
					}}
				>
					<div
						className="w-full h-full grid place-items-center"
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				</div>
			</div>
		</div>
	);
}