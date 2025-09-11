import * as React from "react";
import { renderLockupV2 } from "../../lib/brand-kit";
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
	// Render lockup SVG for website header with proper contrast
	const websiteSpec = React.useMemo(() => {
		return {
			...spec,
			template: 'left-lockup' as const,
			colors: {
				...spec.colors,
				text: '#FFFFFF', // White text for visibility on website
				primary: spec.colors.primary || '#F97316'
			}
		};
	}, [spec]);
	
	const svg = React.useMemo(() => renderLockupV2(websiteSpec, 128), [websiteSpec]);

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