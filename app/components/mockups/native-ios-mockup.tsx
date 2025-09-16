import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
import type { BrandSpecV2 } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the icon mark
	spec: BrandSpecV2;
};

/**
 * NativeIOSMockup
 * Display generated icon as app icon in iOS home screen mockup
 */
export function NativeIOSMockup({ spec }: Props) {
	// Always use app-icon context for native iOS app icon with zero padding
	const svgSpec = React.useMemo(() => {
		const primaryColor = spec.colors.primary;
		const isLightBackground = primaryColor && primaryColor !== '#000000' && primaryColor !== '#0B0B0F';
		return {
			...spec,
			colors: { ...spec.colors, text: isLightBackground ? '#000000' : '#FFFFFF' },
			params: { ...spec.params, padding: 0 },
		};
	}, [spec]);
	
	const assets = React.useMemo(() => {
		return generateAllAssets(svgSpec, 256);
	}, [svgSpec]);
	
	const svg = React.useMemo(() => {
		return getAssetForContext(assets, 'app-icon');
	}, [assets]);

	return (
		<div className="mx-auto w-full max-w-4xl">
			<div className="relative rounded-3xl overflow-hidden shadow-2xl">
				{/* iOS mockup background */}
				<img 
					src="/mockups/nativeiOS.jpg" 
					alt="Native iOS mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated icon positioned as first app icon */}
				<div 
					className="absolute rounded-[22%] overflow-hidden shadow-lg grid place-items-center"
					style={{
						top: '31%',
						left: '36.2%',
						width: '12.2%',
						height: '21.5%',
						background: spec.colors.primary || '#F97316'
					}}
				>
					{/* iOS app icon gloss overlay */}
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0)_45%)]" />
					
					<div className="w-full h-full grid place-items-center" dangerouslySetInnerHTML={{ __html: svg }} />
				</div>
			</div>
		</div>
	);
}