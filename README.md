# omelet-slide-generator

Generate `.pptx` slide decks from a TypeScript content file. Themes, code highlighting (Shiki), native math (KaTeX → OMML), images, and 25+ built-in layouts.

```bash
npx github:maycuatroi1/omelet-slide-generator slides/index.ts deck.pptx --theme=minimalism
```

## Install

This package is distributed via **GitHub** (not npm registry). Install directly from the repo.

### One-shot via `npx` (no install)

```bash
# Latest from main
npx github:maycuatroi1/omelet-slide-generator <content-file> <output.pptx> [options]

# Pinned to a release tag (recommended for reproducible builds)
npx github:maycuatroi1/omelet-slide-generator#v0.1.0 <content-file> <output.pptx> [options]
```

### As a project dev dependency

```bash
npm install --save-dev github:maycuatroi1/omelet-slide-generator
# or pin: npm install --save-dev github:maycuatroi1/omelet-slide-generator#v0.1.0
npx omelet-slide slides/index.ts deck.pptx
```

In `package.json`:

```json
{
  "devDependencies": {
    "omelet-slide-generator": "github:maycuatroi1/omelet-slide-generator#v0.1.0"
  }
}
```

### Global install

```bash
npm install -g github:maycuatroi1/omelet-slide-generator
omelet-slide slides/index.ts deck.pptx
```

> Requires Node.js 18+. The package builds itself on install via a `prepare` script — first install takes ~30s while TypeScript compiles.

## CLI

```
omelet-slide <content-file> <output.pptx> [options]

Options:
  --theme=<name>     Theme: n8n | minimalism | midnight   (default: n8n)
  --no-notes         Build student variant (omit speaker notes)
  -h, --help         Show help
```

The content file can be **TypeScript** (`.ts`) or **JavaScript** (`.js`). TS is loaded directly via [`jiti`](https://github.com/unjs/jiti) — no build step required.

Examples:

```bash
omelet-slide slides/index.ts deck.pptx                       # instructor deck, default theme
omelet-slide slides/index.ts deck.pptx --theme=minimalism    # minimalism theme
omelet-slide slides/index.ts handout.pptx --no-notes         # student variant
```

## Writing a content file

A content file exports a single `ContentModule` as `default`.

`slides/index.ts`:

```ts
import type { ContentModule } from 'omelet-slide-generator';

const content: ContentModule = {
  courseLabel: 'CS101 — Algorithms',
  meta: {
    title: 'Sorting in Linear Time',
    author: 'Jane Doe',
    subject: 'Lecture 7',
  },
  slides: [
    {
      layout: 'title',
      title: 'Sorting in Linear Time',
      subtitle: 'Counting, Radix, Bucket',
      author: 'Jane Doe',
      date: '2026-05-05',
    },
    {
      layout: 'objectives',
      title: 'Today',
      items: [
        'Understand counting sort',
        'Analyze radix sort complexity',
        'Compare with comparison-based sorts',
      ],
    },
    {
      layout: 'codeBlock',
      title: 'Counting sort',
      code: `function countingSort(arr, k) {
  const count = new Array(k + 1).fill(0);
  for (const x of arr) count[x]++;
  // ...
}`,
      language: 'js',
      notes: 'Highlight that counting sort is stable and O(n+k).',
    },
    {
      layout: 'math',
      title: 'Average-case bound',
      formula: 'T(n) = \\Theta(n + k)',
    },
  ],
};

export default content;
```

Run:

```bash
npx github:maycuatroi1/omelet-slide-generator slides/index.ts lecture7.pptx --theme=minimalism
```

### Splitting content across multiple files

```ts
// slides/index.ts
import type { ContentModule } from 'omelet-slide-generator';
import intro from './intro';
import section1 from './section1';
import section2 from './section2';

const content: ContentModule = {
  courseLabel: 'CS101',
  meta: { title: 'Lecture 7', author: 'Jane Doe' },
  slides: [...intro, ...section1, ...section2],
};

export default content;
```

```ts
// slides/intro.ts
import type { SlideData } from 'omelet-slide-generator';

const slides: SlideData[] = [
  { layout: 'title', title: 'Lecture 7', subtitle: 'Sorting' },
  { layout: 'agenda', title: 'Agenda', items: [
    { time: '00:00', label: 'Intro', type: 'lecture' },
    { time: '00:15', label: 'Counting sort', type: 'lecture' },
    { time: '00:45', label: 'Lab', type: 'lab' },
  ]},
];

export default slides;
```

## Layouts

Set `layout: '<name>'` on each slide. Available:

| Layout              | Use for                                         |
| ------------------- | ----------------------------------------------- |
| `title`             | Cover slide                                     |
| `sectionDivider`    | Big colored break between sections              |
| `objectives`        | Lecture goals                                   |
| `agenda`            | Time-stamped schedule                           |
| `bullets`           | Plain bullet list                               |
| `twoColumn`         | Two parallel bullet lists                       |
| `threeColumn`       | Three parallel bullet lists                     |
| `comparison`        | Side-by-side pros/cons style                    |
| `iconGrid`          | Grid of icon + label tiles (uses lucide icons)  |
| `numberedCards`     | Numbered card grid                              |
| `processFlow`       | Sequential steps                                |
| `imageProcessFlow`  | Steps with images                               |
| `timeline`          | Horizontal timeline                             |
| `stats`             | Big-number statistics                           |
| `table`             | Plain table                                     |
| `imageTable`        | Table with image cells                          |
| `codeBlock`         | Syntax-highlighted code (Shiki)                 |
| `math`              | Native PowerPoint math (KaTeX → OMML)           |
| `image`             | Single image                                    |
| `imageText`         | Image + text                                    |
| `quote`             | Pull quote                                      |
| `highlight`         | Big callout                                     |
| `summary` / `recap` | End-of-section recap                            |
| `labExercise`       | Lab brief (objective, steps, deliverables)      |
| `demo`              | Live demo placeholder                           |
| `qna`               | Q&A close                                       |

Every slide accepts `title`, `subtitle`, and `notes`. Notes become PowerPoint speaker notes (omitted when you pass `--no-notes`).

## Themes

Three built-in themes:

- **`n8n`** — vibrant orange/purple (default)
- **`minimalism`** — light, neutral, lots of whitespace
- **`midnight`** — dark mode

Pick one with `--theme=<name>`.

## Math

The `math` layout (and inline `$...$` in text) is rendered as **native PowerPoint OMML** — fully editable in PowerPoint, not an image. Powered by KaTeX + a post-processing pass that injects OMML XML into the generated `.pptx`.

```ts
{ layout: 'math', title: 'Master theorem', formula: 'T(n) = aT(n/b) + f(n)' }
```

## Code highlighting

`codeBlock` uses [Shiki](https://shiki.style/) with the same themes shipped with VS Code. Pass `language` (e.g. `'ts'`, `'py'`, `'rust'`) and `code` as a string.

## Images

Place images alongside your content file (or in subfolders). Reference them by path relative to the content file:

```ts
{ layout: 'image', title: 'Architecture', image: 'assets/arch.png' }
```

The CLI sets `CONTENT_DIR` to the content file's directory, so relative paths resolve from there.

## Programmatic API

```ts
import { PresentationBuilder, getTheme } from 'omelet-slide-generator';
import content from './slides';

const builder = new PresentationBuilder(getTheme('minimalism'), __dirname);
const pptx = await builder.build(content, { noNotes: false, contentDir: __dirname });
await pptx.writeFile({ fileName: 'out.pptx' });
```

## License

MIT
