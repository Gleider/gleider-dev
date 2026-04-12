import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-white" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-8 mb-3 text-2xl font-semibold text-white" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold text-white" {...props} />
  ),
  p: (props) => (
    <p className="my-4 leading-relaxed text-gray-300" {...props} />
  ),
  a: (props) => (
    <a
      className="text-blue-400 underline decoration-blue-400/30 underline-offset-2 transition-colors hover:text-blue-300 hover:decoration-blue-300/50"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-4 list-disc space-y-1 pl-6 text-gray-300" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-1 pl-6 text-gray-300" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-white" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-gray-700 pl-4 italic text-gray-400"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-gray-800" />,
};
