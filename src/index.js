// @ts-check
export default class PodsTooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    document.addEventListener(
      "click",
      this.closeTooltipWhenClickOutside.bind(this),
    );
    this.defer = (window.requestIdleCallback || requestAnimationFrame).bind(
      window,
    );
  }

  connectedCallback() {
    this.ariaExpanded = "false";
    this.shadowRoot.innerHTML = `
      <style>${this.constructor.css}</style>
      <div part="wrapper" class="tooltip-wrapper">
        <button 
          part="button" 
          class="tooltip-button" 
          onclick="this.getRootNode().host.toggleTooltip()"
          onfocusin="this.getRootNode().host.openTooltip()"
          >
          <svg xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span class="sr-only"></span>
        </button>
        <div slot="content" class="tooltip-content">
          ${this.innerHTML}
        </div>
      </div>
    `;
    this.tooltipContent.addEventListener("transitionend", () => {
      if (this.tooltipContent.classList.contains("visible")) {
        this.ariaExpanded = "true";
      } else {
        this.ariaExpanded = "false";
      }
    });
    this.defer(() => {
      this.innerHTML = `<!-- Original content has been moved into shadowRoot -->`;
    });
  }

  get button() {
    return this.shadowRoot.querySelector("button");
  }

  get tooltipContent() {
    return this.shadowRoot.querySelector(".tooltip-content");
  }

  closeTooltip() {
    this.tooltipContent.classList.remove("visible");
  }

  openTooltip() {
    this.tooltipContent.classList.add("visible");
  }

  toggleTooltip() {
    if (this.getAttribute("aria-expanded") === "false") {
      this.openTooltip();
    } else {
      this.closeTooltip();
    }
  }

  closeTooltipWhenClickOutside(e) {
    if (e.composedPath().includes(this)) return;
    this.closeTooltip();
  }

  static get css() {
    return `
      :host {
        display: inline-flex;
        color: #fff;
      }

      button {
        background: transparent;
        border: none;
        border-radius: 50%;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      button:is(:hover, :focus-visible, :focus) {
        outline-offset: 2px;
        outline: 1px auto #007cba;
      }

      .tooltip-wrapper {
        position: relative;
        display: inline-flex;
      }

      .tooltip-content {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        background-color: var(--tooltip-background-color, #333);
        border-radius: 4px;
        padding: 1em 1.2em;
        left: 50%;
        transform: translateX(-50%);
        transition: opacity .3s ease;
        will-change: opacity;
        bottom: calc(100% + 12px);
        width: max(25em, 350px);
        z-index: 9999;
        display: grid;
        gap: .75em;
      }

      .tooltip-content * {
        color: inherit;
        margin: 0;
      }

      .tooltip-content::before {
        --tooltip-arrow-size: 12px;
        content: '';
        position: absolute;
        bottom: calc(var(--tooltip-arrow-size) * -0.5);
        left: 0;
        border-width: 8px 8px 0;
        border-top-color: initial;
        width: var(--tooltip-arrow-size);
        height: var(--tooltip-arrow-size);
        background: var(--tooltip-background-color, #333);
        transform: rotate(45deg);
        left: calc(50% - var(--tooltip-arrow-size) / 2);
      }

      .tooltip-content.visible {
        opacity: 1;
        pointer-events: initial;
      }
    `;
  }
}

customElements.define("pods-tooltip", PodsTooltip);
