declare module "marked-terminal" {
  import { Renderer as MarkedRenderer } from "marked";

  interface TerminalRendererOptions {
    /**
     * Function for styling code blocks
     *
     * @default chalk.yellow
     */
    code?: (text: string) => string;
    /**
     * Function for styling blockquotes
     *
     * @default chalk.gray.italic
     */
    blockquote?: (text: string) => string;
    /**
     * Function for styling HTML
     *
     * @default chalk.gray
     */
    html?: (text: string) => string;
    /**
     * Function for styling headings
     *
     * @default chalk.green.bold
     */
    heading?: (text: string) => string;
    /**
     * Function for styling first heading
     *
     * @default chalk.magenta.underline.bold
     */
    firstHeading?: (text: string) => string;
    /**
     * Function for styling horizontal rules
     *
     * @default chalk.reset
     */
    hr?: (text: string) => string;
    /**
     * Function for styling list items
     *
     * @default chalk.reset
     */
    listitem?: (text: string) => string;
    /**
     * Function for styling lists
     *
     * @default list function
     */
    list?: (body: string, ordered: boolean, indent: string) => string;
    /**
     * Function for styling tables
     *
     * @default chalk.reset
     */
    table?: (text: string) => string;
    /**
     * Function for styling paragraphs
     *
     * @default chalk.reset
     */
    paragraph?: (text: string) => string;
    /**
     * Function for styling strong text
     *
     * @default chalk.bold
     */
    strong?: (text: string) => string;
    /**
     * Function for styling emphasized text
     *
     * @default chalk.italic
     */
    em?: (text: string) => string;
    /**
     * Function for styling code spans
     *
     * @default chalk.yellow
     */
    codespan?: (text: string) => string;
    /**
     * Function for styling deleted text
     *
     * @default chalk.dim.gray.strikethrough
     */
    del?: (text: string) => string;
    /**
     * Function for styling links
     *
     * @default chalk.blue
     */
    link?: (text: string) => string;
    /**
     * Function for styling href attributes
     *
     * @default chalk.blue.underline
     */
    href?: (text: string) => string;
    /**
     * Function for styling text
     *
     * @default identity function
     */
    text?: (text: string) => string;
    /**
     * Whether to unescape entities
     *
     * @default true
     */
    unescape?: boolean;
    /**
     * Whether to convert emoji text to unicode
     *
     * @default true
     */
    emoji?: boolean;
    /**
     * Terminal width
     *
     * @default 80
     */
    width?: number;
    /**
     * Whether to show section prefixes
     *
     * @default true
     */
    showSectionPrefix?: boolean;
    /**
     * Whether to reflow text
     *
     * @default false
     */
    reflowText?: boolean;
    /**
     * Tab size
     *
     * @default 4
     */
    tab?: number;
    /**
     * Options for cli-table3
     *
     * @default { }
     */
    tableOptions?: object;
  }

  interface HighlightOptions {
    /** Options for syntax highlighting */
    [key: string]: unknown;
  }

  /** Terminal renderer for marked */
  export default class TerminalRenderer extends MarkedRenderer {
    /**
     * Create a new terminal renderer
     *
     * @param options - Options for the renderer
     * @param highlightOptions - Options for syntax highlighting
     */
    constructor(
      options?: TerminalRendererOptions,
      highlightOptions?: HighlightOptions,
    );
  }
}
