import * as React from "react";
import { generateAllAssets, getAssetForContext, renderAppIconV2 } from "../../lib/brand-kit";
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
			params: { ...spec.params, padding: 4 },
		};
	}, [spec]);
	
	const assets = React.useMemo(() => {
		return generateAllAssets(iconSpec, 30); // Slightly larger size for better dock presence
	}, [iconSpec]);
	
	const dockIconSvg = React.useMemo(() => {
		// Generate app icon with macOS-style rounded corners (18% radius)
		return renderAppIconV2(iconSpec, 34, 19);
	}, [iconSpec]);

	// Measure the mockup image for pixel-accurate placement
	const imgRef = React.useRef<HTMLImageElement | null>(null);
	const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

	React.useEffect(() => {
		const img = imgRef.current;
		if (!img) return;
		const onResize = () => {
			const r = img.getBoundingClientRect();
			setSize({ w: r.width, h: r.height });
		};
		if (img.complete) onResize();
		img.addEventListener('load', onResize);
		window.addEventListener('resize', onResize, { passive: true } as any);
		return () => {
			img.removeEventListener('load', onResize);
			window.removeEventListener('resize', onResize as any);
		};
	}, []);

	// Dock icon positioning based on measured image dimensions
	const renderDockIcon = () => {
		if (!size) return null;
		
		// Dock icon position (centered on the empty dock slot)
		const dockCenter = { left: 0.618, bottom: 0.0994 }; // 61% from left, 4.2% from bottom
		const iconSize = Math.round(size.w * 0.09); // 9% of image width
		
		const x = Math.round(size.w * dockCenter.left - iconSize / 2);
		const y = Math.round(size.h * (1 - dockCenter.bottom) - iconSize / 2);
		
		return (
			<div
				className="absolute"
				style={{
					left: `${x}px`,
					top: `${y}px`,
					width: `${iconSize}px`,
					height: `${iconSize}px`,
				}}
			>
				<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: dockIconSvg }} />
			</div>
		);
	};

	return (
		<div className="mx-auto w-full max-w-md ">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* macOS mockup background */}
				<img 
					ref={imgRef}
					src="/mockups/macos-mockup.png" 
					alt="macOS desktop mockup"
					className="w-full h-auto"
				/>
				
				{/* Generated logo positioned in dock */}
				{renderDockIcon()}
			</div>
		</div>
	);
}