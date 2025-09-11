import * as React from "react";
import { renderMarkV2 } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the icon mark
	spec: BrandSpecV2;
};

/**
 * BrowserMockup
 * Display generated icon as favicon in browser tab mockup
 */
export function BrowserMockup({ spec }: Props) {
	// Render a small SVG for favicon
	const svg = React.useMemo(() => renderMarkV2(spec, 64), [spec]);

	return (
		<div className="mx-auto w-full max-w-4xl">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* Browser mockup background */}
				<img 
					src="/mockups/browser-mockup.png" 
					alt="Browser mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated icon positioned as favicon */}
				<div 
					className="absolute grid place-items-center rounded-sm overflow-hidden"
					style={{
						top: '18.5%',
						left: '18.2%',
						width: '2.8%',
						height: '5.2%',
						background: spec.colors.background || '#ffffff'
					}}
				>
					<div
						className="w-full h-full grid place-items-center"
						style={{ transform: 'scale(0.8)' }}
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				</div>
			</div>
		</div>
	);
}