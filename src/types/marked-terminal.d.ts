declare module "marked-terminal" {
  import { Renderer as MarkedRenderer } from "marked";

  interface TerminalRendererOptions {
    /**
     * Function for styling code blocks
     *
     * @default chalk.yellow
     */
    code?: Function;
    /**
     * Function for styling blockquotes
     *
     * @default chalk.gray.italic
     */
    blockquote?: Function;
    /**
     * Function for styling HTML
     *
     * @default chalk.gray
     */
    html?: Function;
    /**
     * Function for styling headings
     *
     * @default chalk.green.bold
     */
    heading?: Function;
    /**
     * Function for styling first heading
     *
     * @default chalk.magenta.underline.bold
     */
    firstHeading?: Function;
    /**
     * Function for styling horizontal rules
     *
     * @default chalk.reset
     */
    hr?: Function;
    /**
     * Function for styling list items
     *
     * @default chalk.reset
     */
    listitem?: Function;
    /**
     * Function for styling lists
     *
     * @default list function
     */
    list?: Function;
    /**
     * Function for styling tables
     *
     * @default chalk.reset
     */
    table?: Function;
    /**
     * Function for styling paragraphs
     *
     * @default chalk.reset
     */
    paragraph?: Function;
    /**
     * Function for styling strong text
     *
     * @default chalk.bold
     */
    strong?: Function;
    /**
     * Function for styling emphasized text
     *
     * @default chalk.italic
     */
    em?: Function;
    /**
     * Function for styling code spans
     *
     * @default chalk.yellow
     */
    codespan?: Function;
    /**
     * Function for styling deleted text
     *
     * @default chalk.dim.gray.strikethrough
     */
    del?: Function;
    /**
     * Function for styling links
     *
     * @default chalk.blue
     */
    link?: Function;
    /**
     * Function for styling href attributes
     *
     * @default chalk.blue.underline
     */
    href?: Function;
    /**
     * Function for styling text
     *
     * @default identity function
     */
    text?: Function;
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
    [key: string]: any;
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
