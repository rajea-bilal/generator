import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { optimize } from 'svgo';
import type { StyleRecipe } from '~/lib/icon/types';

export interface SanitizeResult {
  ok: boolean;
  svg?: string;
  error?: string;
  warnings: string[];
}

// Allowed SVG elements and attributes for security
const ALLOWED_ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);

const ALLOWED_ATTRIBUTES = new Set([
  'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 
  'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'transform',
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points'
]);

// Dangerous patterns to reject
const DANGEROUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /url\(/i,
  /<script/i,
  /<image/i,
  /<foreignObject/i,
  /onload/i,
  /onerror/i,
  /onclick/i,
];

export async function sanitizeAndValidate(
  svgString: string, 
  style: StyleRecipe
): Promise<SanitizeResult> {
  const warnings: string[] = [];

  try {
    // Basic format validation
    const trimmed = svgString.trim();
    if (!trimmed.startsWith('<svg') || !trimmed.endsWith('</svg>')) {
      return {
        ok: false,
        error: 'Invalid SVG format: must start with <svg and end with </svg>',
        warnings,
      };
    }

    // Check for dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          ok: false,
          error: `Security violation: dangerous pattern detected`,
          warnings,
        };
      }
    }

    // Parse XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: false,
    });

    let parsed;
    try {
      parsed = parser.parse(trimmed);
    } catch (parseError) {
      return {
        ok: false,
        error: `XML parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        warnings,
      };
    }

    if (!parsed.svg) {
      return {
        ok: false,
        error: 'No SVG root element found',
        warnings,
      };
    }

    // Sanitize the parsed SVG
    const sanitized = sanitizeElement(parsed.svg, 'svg');
    if (!sanitized.ok) {
      return {
        ok: false,
        error: sanitized.error,
        warnings: [...warnings, ...sanitized.warnings],
      };
    }

    // Enforce required attributes
    const svgElement = sanitized.element!;
    
    // Set viewBox
    svgElement['@_viewBox'] = '0 0 24 24';
    
    // Set style-specific attributes
    if (style.style === 'outline') {
      svgElement['@_fill'] = 'none';
      svgElement['@_stroke'] = 'currentColor';
    }
    
    svgElement['@_stroke-width'] = style.strokeWidth.toString();
    svgElement['@_stroke-linecap'] = style.linecap;
    svgElement['@_stroke-linejoin'] = style.linejoin;

    // Remove width/height if present (let CSS control sizing)
    delete svgElement['@_width'];
    delete svgElement['@_height'];

    // Rebuild XML
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      suppressEmptyNode: true,
    });

    const rebuilt = builder.build({ svg: svgElement });
    
    // Optimize with SVGO
    const optimized = optimize(rebuilt, {
      plugins: [
        'preset-default',
        {
          name: 'removeViewBox',
          active: false, // Keep viewBox
        },
        {
          name: 'removeDimensions',
          active: true, // Remove width/height
        },
      ],
    });

    if (optimized.error) {
      warnings.push(`SVGO optimization warning: ${optimized.error}`);
    }

    return {
      ok: true,
      svg: optimized.data || rebuilt,
      warnings,
    };

  } catch (error) {
    return {
      ok: false,
      error: `Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      warnings,
    };
  }
}

interface SanitizeElementResult {
  ok: boolean;
  element?: any;
  error?: string;
  warnings: string[];
}

function sanitizeElement(element: any, tagName: string): SanitizeElementResult {
  const warnings: string[] = [];

  // Check if element is allowed
  if (!ALLOWED_ELEMENTS.has(tagName)) {
    return {
      ok: false,
      error: `Disallowed element: ${tagName}`,
      warnings,
    };
  }

  const sanitized: any = {};

  // Copy allowed attributes
  for (const [key, value] of Object.entries(element)) {
    if (key.startsWith('@_')) {
      const attrName = key.substring(2);
      if (ALLOWED_ATTRIBUTES.has(attrName)) {
        sanitized[key] = value;
      } else {
        warnings.push(`Removed disallowed attribute: ${attrName}`);
      }
    } else if (key !== '#text') {
      // Handle child elements
      if (Array.isArray(element[key])) {
        const sanitizedChildren = [];
        for (const child of element[key]) {
          const childResult = sanitizeElement(child, key);
          if (!childResult.ok) {
            return childResult;
          }
          sanitizedChildren.push(childResult.element);
          warnings.push(...childResult.warnings);
        }
        if (sanitizedChildren.length > 0) {
          sanitized[key] = sanitizedChildren;
        }
      } else {
        const childResult = sanitizeElement(element[key], key);
        if (!childResult.ok) {
          return childResult;
        }
        sanitized[key] = childResult.element;
        warnings.push(...childResult.warnings);
      }
    }
  }

  // Copy text content if present
  if (element['#text']) {
    sanitized['#text'] = element['#text'];
  }

  return {
    ok: true,
    element: sanitized,
    warnings,
  };
}