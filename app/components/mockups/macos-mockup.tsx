import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the app icon in macOS dock
	spec: BrandSpecV2;
};

/**
 * MacOSMockup
 * Display generated icon as app icon in macOS dock mockup
 */
export function MacOSMockup({ spec }: Props) {
	// Always use app-icon context for macOS dock icon with zero padding
	const iconSpec = React.useMemo(() => {
		return {
			...spec,
			params: { ...spec.params, padding: 2.2 },
		};
	}, [spec]);
	
	const assets = React.useMemo(() => {
		return generateAllAssets(iconSpec, 29); // Slightly larger size for better dock presence
	}, [iconSpec]);
	
	const dockIconSvg = React.useMemo(() => {
		return getAssetForContext(assets, 'app-icon');
	}, [assets]);

	return (
		<div className="mx-auto w-full max-w-md ">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* macOS mockup background */}
				<img 
					src="/mockups/macos-mockup.png" 
					alt="macOS desktop mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated logo positioned in dock - sized to match dock icons */}
				<div 
					className="absolute rounded-lg overflow-hidden grid place-items-center"
					style={{
						// Positioned for the empty dock icon slot (5th position from left)
						left: '60.00%',   // Position over the empty/gray dock icon
						bottom: '5.7%', // Dock bottom position
						width: '9.0%',  // Match dock icon width
						height: '9.1%', // Match dock icon height  
						transform: 'translateX(-37.5%)', // Center horizontally
						background: 'transparent'
					}}
				>
					<div 
						className="w-full h-full rounded-lg overflow-hidden"
						style={{
							background: spec.background.type === 'solid' 
								? spec.background.color
								: `linear-gradient(${spec.background.angle}deg, ${spec.background.stops.map(s => `${s.color} ${s.at * 100}%`).join(', ')})`,
							padding: '6px', // Add padding to create more background space around the icon
						}}
					>
						<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: dockIconSvg }} />
					</div>
				</div>
			</div>
		</div>
	);
}