// Shared page data for the HTML template. The FAQ feeds both the visible
// <details> list and the FAQPage JSON-LD, so the two can never drift apart.

const pkg = require('@ashwinthomas/utils/package.json');
const utils = require('@ashwinthomas/utils');

const PACKAGE = '@ashwinthomas/utils';
const NPM_URL = 'https://www.npmjs.com/package/@ashwinthomas/utils';
const REPO_URL = 'https://github.com/ashwinthomas5458/utils';
const AUTHOR_URL = 'https://github.com/ashwinthomas5458';
const AUTHOR_NPM_URL = 'https://www.npmjs.com/~ashwinthomas';

// The root entry exposes one namespace per module. Order matches the README
// and the page; the build fails if the package's modules ever differ.
const MODULES = ['math', 'random', 'motion', 'easing', 'angle', 'vector', 'geometry', 'color'];
const found = Object.keys(utils).sort().join();
if (found !== [...MODULES].sort().join()) {
  throw new Error(`site.js MODULES (${MODULES}) don't match the package's namespaces (${found})`);
}

// Counted from the installed package so the page can't go stale.
const isClass = (fn) => /^class\b/.test(Function.prototype.toString.call(fn));
const exportsList = MODULES.flatMap((ns) => Object.values(utils[ns])).filter((v) => typeof v === 'function');
const FUNCTION_COUNT = exportsList.filter((fn) => !isClass(fn)).length;
const CLASS_COUNT = exportsList.length - FUNCTION_COUNT;
const NODE_VERSION = (pkg.engines && pkg.engines.node) || '>=18';

const meta = {
  // ~60 characters so search results show it untruncated.
  title: '@ashwinthomas/utils: TypeScript Lerp, Easing & Vector Math',
  // ~155 characters.
  description: 'Zero-dependency TypeScript utilities for lerp, interpolate, easing, damping, seeded random, 2D vectors, geometry and color contrast. With live demos.',
  socialTitle: `Utils Playground: try all ${FUNCTION_COUNT} @ashwinthomas/utils functions live`,
  socialDescription: 'Drag, click and slide through pure TypeScript functions for interpolation, easing, damping, seeded randomness, 2D vectors, geometry and color.',
  siteName: 'Utils Playground',
  author: 'Ashwin Thomas',
  themeColor: '#004FB8',
  keywords: [
    'typescript utility functions',
    'lerp',
    'inverse lerp',
    'clamp',
    'interpolate',
    'easing functions',
    'damp',
    'smoothstep',
    'lerpAngle',
    'seeded random',
    '2d vector math',
    'Vector2 class',
    'line segment intersection',
    'color conversion',
    'contrast ratio',
  ].join(', '),
};

const faq = [
  {
    group: 'Package',
    items: [
      {
        q: 'What is @ashwinthomas/utils?',
        a: `@ashwinthomas/utils is a small TypeScript library of ${FUNCTION_COUNT} utility functions for math, randomness (including seeded), motion, easing, angles, 2D vectors, geometry and colors. It has no runtime dependencies and works with ES modules, CommonJS and TypeScript.`,
      },
      {
        q: 'How do I install and import it?',
        a: `Run <code>npm i @ashwinthomas/utils</code>. Importing from the package root gives you one object per module, so <code>import { math } from '@ashwinthomas/utils'</code> lets you call <code>math.clamp</code>. To import functions by name, use a module path instead: <code>import { clamp } from '@ashwinthomas/utils/math'</code>. CommonJS <code>require</code> works the same way.`,
      },
      {
        q: 'Does it work in the browser and in Node.js?',
        a: `Yes. It only uses standard JavaScript and <code>Math</code>, so it runs in any modern browser and in Node.js 18 or later, with either <code>import</code> or <code>require</code>.`,
      },
      {
        q: 'Is it tree-shakeable?',
        a: `Yes. Importing the package doesn't run any code by itself, and every module has its own path, such as <code>@ashwinthomas/utils/math</code>. Importing from those paths keeps bundles smallest. Bundlers like webpack 5 also drop unused functions when you import a module object from the root.`,
      },
      {
        q: 'Does it include TypeScript types?',
        a: `Yes. Type definitions are included for both ESM and CommonJS, including the <code>Vec2</code> and <code>EasingFn</code> types, so your editor shows signatures and autocomplete without installing anything else.`,
      },
      {
        q: 'Can I use it in commercial projects?',
        a: `Yes. It's released under the MIT license, which lets you use, change and share it in commercial and closed-source projects, as long as you keep the copyright and license notice.`,
      },
      {
        q: 'Can I seed the random functions?',
        a: `Yes. <code>withSeed(seed)</code> returns a generator that gives the same sequence every time for the same seed. It's based on the mulberry32 algorithm and has <code>value</code>, <code>range</code> and <code>rangeFloor</code>. The seed can be a number or a string; leave it out for a random seed, then read <code>rng.seed</code> to save it and replay the sequence later. Don't use it for anything security-related.`,
      },
    ],
  },
  {
    group: 'Concepts',
    items: [
      {
        q: 'What is the difference between lerp and invlerp?',
        a: `<code>lerp(start, end, t)</code> gives the value a fraction <code>t</code> of the way from start to end, so <code>lerp(0, 200, 0.25)</code> is <code>50</code>. <code>invlerp(start, end, value)</code> goes the other way and gives you the fraction, so <code>invlerp(0, 200, 50)</code> is <code>0.25</code>. To go from one range straight to another, use <code>interpolate</code>.`,
      },
      {
        q: 'How is damp different from lerp?',
        a: `Calling <code>lerp(a, b, t)</code> every frame moves a fixed share each frame, so the motion speeds up on faster screens. <code>damp(current, target, lambda, deltaTime)</code> takes the time since the last frame into account, so it moves the same at 30, 60 or 144 fps.`,
      },
      {
        q: 'What is smoothstep used for?',
        a: `<code>smoothstep(edge0, edge1, x)</code> returns 0 below <code>edge0</code>, 1 above <code>edge1</code>, and a smooth S-curve in between. It's a common way to soften a hard cut-off, like fading something in over a scroll range or softening the edge of a mask.`,
      },
      {
        q: 'Which easing function should I use?',
        a: `For most interface motion, <code>easeOutCubic</code>: it starts quickly and slows down gently, which feels responsive. Use the InOut versions for movement between two resting points, Expo for sharper, more dramatic moves, and Back when a small overshoot suits the feel.`,
      },
      {
        q: 'How does mod differ from the % operator?',
        a: `JavaScript's <code>%</code> can return a negative number: <code>-1 % 5</code> is <code>-1</code>. <code>mod(n, d)</code> always takes the sign of <code>d</code>, so <code>mod(-1, 5)</code> is <code>4</code>. That's usually what you want when wrapping an index or position around a loop.`,
      },
      {
        q: 'What does interpolate do with values outside the input range?',
        a: `By default (<code>'extend'</code>) it keeps going in the same direction, so <code>interpolate(150, [0, 100], [0, 1])</code> is <code>1.5</code>. <code>'clamp'</code> stops at the ends of the output range, and <code>'identity'</code> returns the input value unchanged.`,
      },
      {
        q: 'How do I interpolate between two angles the short way?',
        a: `Use <code>lerpAngle(a, b, t)</code>. It always turns the shorter way, so going from 170° to −170° passes through 180° instead of turning 340° the other way. Angles are in radians; convert with <code>degToRad</code> first.`,
      },
      {
        q: 'Why are angles in radians?',
        a: `Radians are what <code>Math.sin</code>, <code>Math.cos</code> and <code>Math.atan2</code> use, so sticking with them avoids converting back and forth. Use <code>degToRad</code> and <code>radToDeg</code> when you need degrees, for example for user input. The one exception is color hue, which is in degrees, like CSS.`,
      },
      {
        q: 'How do I find where two line segments intersect?',
        a: `Call <code>intersection(a1, a2, b1, b2)</code> with the end points of both segments as <code>{ x, y }</code> objects. It returns the point where they cross, or <code>null</code> if they don't cross, including when they're parallel or lie along the same line.`,
      },
      {
        q: 'Should I use Vector2 or the vector functions?',
        a: `Either: both use the same <code>{ x, y }</code> shape. The functions work on plain objects you already have. <code>Vector2</code> puts the same math in a class you can chain, like <code>new Vector2(3, 4).add({ x: 1, y: 1 }).scale(2)</code>, and every method returns a new <code>Vector2</code>. Instances work with the functions too, so you can mix them.`,
      },
      {
        q: 'How do I check color contrast for accessibility?',
        a: `Turn both colors into RGB with <code>hexToRgb</code>, then call <code>contrastRatio(a, b)</code>. It returns a number from 1 to 21. WCAG level AA asks for at least 4.5 for normal text and 3 for large text; level AAA asks for 7. White on black is 21.`,
      },
    ],
  },
];

const stripTags = (html) => html.replace(/<[^>]+>/g, '');

function jsonLd(siteUrl) {
  const author = {
    '@type': 'Person',
    '@id': `${siteUrl}#author`,
    name: meta.author,
    url: AUTHOR_URL,
    sameAs: [AUTHOR_URL, AUTHOR_NPM_URL],
  };

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: meta.siteName,
      inLanguage: 'en',
      publisher: { '@id': `${siteUrl}#author` },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}#webpage`,
      url: siteUrl,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#software` },
      author: { '@id': `${siteUrl}#author` },
      inLanguage: 'en',
    },
    author,
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${siteUrl}#software`,
      name: PACKAGE,
      description: `${pkg.description} ${FUNCTION_COUNT} pure TypeScript functions and a Vector2 class across ${MODULES.length} modules (${MODULES.join(', ')}), with zero runtime dependencies.`,
      url: NPM_URL,
      codeRepository: REPO_URL,
      programmingLanguage: { '@type': 'ComputerLanguage', name: 'TypeScript' },
      runtimePlatform: [`Node.js ${NODE_VERSION}`, 'Web browsers'],
      version: pkg.version,
      license: 'https://opensource.org/licenses/MIT',
      isAccessibleForFree: true,
      keywords: pkg.keywords,
      author: { '@id': `${siteUrl}#author` },
    },
    {
      '@type': 'HowTo',
      '@id': `${siteUrl}#install`,
      name: `How to install and import ${PACKAGE}`,
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Install', text: `Run npm i ${PACKAGE}.` },
        { '@type': 'HowToStep', position: 2, name: 'Import from the root', text: `import { math, easing } from '${PACKAGE}';` },
        { '@type': 'HowToStep', position: 3, name: 'Or import flat names from a module subpath', text: `import { lerp } from '${PACKAGE}/math';` },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}#faq`,
      mainEntity: faq.flatMap(({ items }) =>
        items.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
        })),
      ),
    },
  ];
  // Escape "<" so the JSON can never close its <script> element early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

module.exports = {
  PACKAGE,
  NPM_URL,
  REPO_URL,
  AUTHOR_URL,
  VERSION: pkg.version,
  FUNCTION_COUNT,
  CLASS_COUNT,
  MODULES,
  NODE_VERSION,
  meta,
  faq,
  jsonLd,
};
