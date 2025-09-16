import * as React from "react";
import { generateAllAssets, getAssetForContext } from "../../lib/brand-kit";
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
		return generateAllAssets({ ...spec, params: { ...spec.params, padding: 6 } }, 64);
	}, [spec]);
	
	// Get the appropriate asset for favicon context
	const faviconSvg = React.useMemo(() => {
		let s = getAssetForContext(assets, 'favicon');
		s = s
			.replace(/width="[^"]+"/i, 'width="100%"')
			.replace(/height="[^"]+"/i, 'height="100%"')
			.replace(/preserveAspectRatio="[^"]+"/i, 'preserveAspectRatio="xMidYMid meet"');
		return s;
	}, [assets]);

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

	// Keyline rule for light backgrounds
	const bg = spec.colors.background || '#FFFFFF';
	const toRGB = (c: string) => {
		const v = c.replace('#', '');
		const n = v.length === 3 ? v.split('').map(x => x + x).join('') : v;
		const r = parseInt(n.slice(0, 2), 16);
		const g = parseInt(n.slice(2, 4), 16);
		const b = parseInt(n.slice(4, 6), 16);
		return { r, g, b };
	};
	const luminance = (c: string) => {
		const { r, g, b } = toRGB(c);
		return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	};
	const needKeyline = luminance(bg) > 0.86; // very light backgrounds
	const keylineColor = '#D1D5DB';

	// Small favicon dimensions - adjusted to better match mockup placeholders
	const outerPx = 18; // 18×18 favicon to match gray placeholders
	const innerPx = 16; // safe-zone
	const radiusPx = 3; // 3 px rounded corners
	const padPx = Math.round((outerPx - innerPx) / 2);

	// Large in-page preview square (measured ratios)
	const largeRadiusPx = 12; // approximate corner radius to match mock
	const largePadPx = 7; // 6–8 px padding rule

	// Positions (center ratios) measured against the browser mockup image
	// Tab favicon - gray square in the browser tab
	const tabCenter = { left: 0.250, top: 0.220 };
	// Address bar favicon - gray square next to URL in address bar
	const addrCenter = { left: 0.275, top: 0.29 };
	// Large in-page preview square - large gray square in bottom right
	const pageSquare = { left: 0.425, top: 0.45, sideRatioW: 0.16 }; // side = 16% of image width

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
					borderRadius: `${radiusPx}px`,
					background: bg,
					border: needKeyline ? `1px solid ${keylineColor}` : 'none',
					boxSizing: 'border-box',
				}}
			>
				<div style={{ width: `${innerPx}px`, height: `${innerPx}px`, margin: `${padPx}px` }}>
					<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: faviconSvg }} />
				</div>
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
					borderRadius: `${largeRadiusPx}px`,
					background: bg,
					border: needKeyline ? `1px solid ${keylineColor}` : 'none',
					boxSizing: 'border-box',
				}}
			>
				<div style={{ width: `${side - largePadPx * 2}px`, height: `${side - largePadPx * 2}px`, margin: `${largePadPx}px` }}>
					<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: faviconSvg }} />
				</div>
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