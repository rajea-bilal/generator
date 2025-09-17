import * as React from "react";
import { generateAllAssets, getAssetForContext, renderAppIconV2 } from "../../lib/brand-kit";
import type { BrandSpecV2, BrandAssets } from "../../lib/brand-kit";

type Props = {
	// Source spec used to render the icon mark
	spec: BrandSpecV2;
};

/**
 * BrowserMockup
 * Displays the generated logo composited into a browser mockup:
 * - (a) active tab favicon
 * - (b) address bar favicon
 * - (c) large in-page preview square
 */
export function BrowserMockup({ spec }: Props) {
	// Generate all brand assets
	const assets = React.useMemo(() => {
		return generateAllAssets({ ...spec, params: { ...spec.params, padding: 8 } }, 64);
	}, [spec]);
	
	// Generate favicon with user's background styling and rounded corners for browser UI
	const faviconSvg = React.useMemo(() => {
		// Use 15% corner radius for browser favicons (more subtle than app icons)
		// Use renderAppIconV2 to preserve user's background color/gradient instead of forced white
		let s = renderAppIconV2(spec, 100, 13);
		s = s
			.replace(/width="[^"]+"/i, 'width="100%"')
			.replace(/height="[^"]+"/i, 'height="100%"')
			.replace(/preserveAspectRatio="[^"]+"/i, 'preserveAspectRatio="xMidYMid meet"');
		return s;
	}, [spec]);

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

	// Small favicon dimensions - adjusted to better match mockup placeholders
	const outerPx = 13; // 18×18 favicon to match gray placeholders

	// Positions (center ratios) measured against the browser mockup image
	// Tab favicon - gray square in the browser tab
	const tabCenter = { left: 0.250, top: 0.216 };
	// Address bar favicon - gray square next to URL in address bar
	const addrCenter = { left: 0.275, top: 0.29 };
	// Large in-page preview square - large gray square in bottom right
	const pageSquare = { left: 0.425, top: 0.45, sideRatioW: 0.14 }; // side = 16% of image width

	const renderSmallFavicon = (center: { left: number; top: number }, key: string) => {
		if (!size) return null;
		const cx = size.w * center.left;
		const cy = size.h * center.top;
		const x = Math.round(cx - outerPx / 2);
		const y = Math.round(cy - outerPx / 2);
		return (
			<div
				key={key}
				className="absolute"
				style={{
					left: `${x}px`,
					top: `${y}px`,
					width: `${outerPx}px`,
					height: `${outerPx}px`,
				}}
			>
				<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: faviconSvg }} />
			</div>
		);
	};

	const renderLargeSquare = () => {
		if (!size) return null;
		const side = Math.round(size.w * pageSquare.sideRatioW);
		const x = Math.round(size.w * pageSquare.left);
		const y = Math.round(size.h * pageSquare.top);
		return (
			<div
				className="absolute"
				style={{
					left: `${x}px`,
					top: `${y}px`,
					width: `${side}px`,
					height: `${side}px`,
				}}
			>
				<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: faviconSvg }} />
			</div>
		);
	};

	return (
		<div className="mx-auto w-full max-w-4xl">
			<div className="relative rounded-lg overflow-hidden shadow-lg">
				{/* Browser mockup background */}
				<img 
					ref={imgRef}
					src="/mockups/browser-mockup.png" 
					alt="Browser mockup"
					className="w-full h-auto"
				/>
				{/* (a) Active tab favicon */}
				{renderSmallFavicon(tabCenter, 'tab')}
				{/* (b) Address bar favicon */}
				{renderSmallFavicon(addrCenter, 'addr')}
				{/* (c) Large in-page preview square */}
				{renderLargeSquare()}
			</div>
		</div>
	);
}