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
				text: '#000000', // Dark text for visibility on light website header
				primary: spec.colors.primary || '#F97316'
			}
		};
	}, [spec]);
	
	const assets = React.useMemo(() => {
		return generateAllAssets(websiteSpec, 128);
	}, [websiteSpec]);
	
	const svg = React.useMemo(() => {
		let result = getAssetForContext(assets, 'website-header');
		// Modify SVG to scale properly like other mockups
		result = result
			.replace(/width="[^"]+"/i, 'width="100%"')
			.replace(/height="[^"]+"/i, 'height="100%"')
			.replace(/preserveAspectRatio="[^"]+"/i, 'preserveAspectRatio="xMidYMid meet"');
		return result;
	}, [assets]);

	return (
		<div className="mx-auto w-full max-w-4xl ">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* Website mockup background */}
				<img 
					src="/mockups/website-mockup.png" 
					alt="Website mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated logo positioned exactly over gray logo box */}
				<div 
					className="absolute rounded-lg overflow-hidden "
					style={{
						top: '-0.05%',
						left: '5.0%',
						width: '7%',
						height: '10%',
						backgroundColor: 'rgba(255, 255, 255, 0.95)',
						backdropFilter: 'blur(8px)',
						boxSizing: 'border-box'
					}}
				>
					<div 
						className="w-full h-full grid place-items-center "
						style={{ 
							padding: '5px',
							boxSizing: 'border-box'
						}}
					>
						<div 
							className="w-full h-full" 
							dangerouslySetInnerHTML={{ __html: svg }} 
						/>
					</div>
				</div>
			</div>
		</div>
	);
}