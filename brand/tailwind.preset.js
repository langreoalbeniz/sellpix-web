/* SellPix — preset de Tailwind. Requiere cargar brand/tokens.css (las variables viven allí). */
/** @type {import('tailwindcss').Config} */
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "ink": "var(--color-ink)",
        "paper": "var(--color-paper)",
        "lime": "var(--color-lime)",
        "lime-hover": "var(--color-lime-hover)",
        "on-lime": "var(--color-on-lime)",
        "surface": "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        "surface-raised": "var(--color-surface-raised)",
        "surface-inverse": "var(--color-surface-inverse)",
        "text": "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-inverse": "var(--color-text-inverse)",
        "line": "var(--color-line)",
        "line-strong": "var(--color-line-strong)",
        "focus-ring": "var(--color-focus-ring)",
        "success": "var(--color-success)",
        "warning": "var(--color-warning)",
        "error": "var(--color-error)",
        "gray-50": "#F7F7F5",
        "gray-100": "#EDEDEA",
        "gray-200": "#DCDCD8",
        "gray-300": "#C4C4BF",
        "gray-400": "#9A9A95",
        "gray-500": "#737370",
        "gray-600": "#5A5A57",
        "gray-700": "#3D3D3B",
        "gray-800": "#242423",
        "gray-900": "#161616"
      },
      "fontFamily": {
        "display": [
          "\"Bricolage Grotesque\", \"Helvetica Neue\", Arial, sans-serif"
        ],
        "sans": [
          "\"Inter\", system-ui, -apple-system, \"Segoe UI\", sans-serif"
        ],
        "pixel": [
          "\"Pixelify Sans\", ui-monospace, \"SF Mono\", Menlo, monospace"
        ]
      },
      "fontSize": {
        "display": [
          "var(--text-display-size)",
          {
            "lineHeight": "var(--text-display-line)",
            "letterSpacing": "-0.035em",
            "fontWeight": "800"
          }
        ],
        "h1": [
          "var(--text-h1-size)",
          {
            "lineHeight": "var(--text-h1-line)",
            "letterSpacing": "-0.03em",
            "fontWeight": "700"
          }
        ],
        "h2": [
          "var(--text-h2-size)",
          {
            "lineHeight": "var(--text-h2-line)",
            "letterSpacing": "-0.025em",
            "fontWeight": "700"
          }
        ],
        "h3": [
          "var(--text-h3-size)",
          {
            "lineHeight": "var(--text-h3-line)",
            "letterSpacing": "-0.015em",
            "fontWeight": "600"
          }
        ],
        "h4": [
          "var(--text-h4-size)",
          {
            "lineHeight": "var(--text-h4-line)",
            "letterSpacing": "0",
            "fontWeight": "600"
          }
        ],
        "lead": [
          "var(--text-lead-size)",
          {
            "lineHeight": "var(--text-lead-line)",
            "letterSpacing": "0",
            "fontWeight": "400"
          }
        ],
        "body": [
          "var(--text-body-size)",
          {
            "lineHeight": "var(--text-body-line)",
            "letterSpacing": "0",
            "fontWeight": "400"
          }
        ],
        "small": [
          "var(--text-small-size)",
          {
            "lineHeight": "var(--text-small-line)",
            "letterSpacing": "0",
            "fontWeight": "400"
          }
        ],
        "caption": [
          "var(--text-caption-size)",
          {
            "lineHeight": "var(--text-caption-line)",
            "letterSpacing": "0.01em",
            "fontWeight": "500"
          }
        ],
        "eyebrow": [
          "var(--text-eyebrow-size)",
          {
            "lineHeight": "var(--text-eyebrow-line)",
            "letterSpacing": "0.08em",
            "fontWeight": "500"
          }
        ],
        "stat": [
          "var(--text-stat-size)",
          {
            "lineHeight": "var(--text-stat-line)",
            "letterSpacing": "-0.03em",
            "fontWeight": "800"
          }
        ],
        "button": [
          "var(--text-button-size)",
          {
            "lineHeight": "var(--text-button-line)",
            "letterSpacing": "0",
            "fontWeight": "600"
          }
        ]
      },
      "spacing": {
        "s1": "4px",
        "s2": "8px",
        "s3": "12px",
        "s4": "16px",
        "s5": "24px",
        "s6": "32px",
        "s7": "48px",
        "s8": "64px",
        "s9": "96px",
        "s10": "128px"
      },
      "borderRadius": {
        "sm": "4px",
        "md": "8px",
        "lg": "12px",
        "xl": "20px",
        "full": "9999px"
      },
      "boxShadow": {
        "sm": "0 1px 2px rgba(10,10,10,0.06)",
        "md": "0 8px 24px rgba(10,10,10,0.10)"
      },
      "maxWidth": {
        "container": "1200px",
        "container-wide": "1360px"
      },
      "transitionTimingFunction": {
        "brand": "cubic-bezier(0.2, 0.8, 0.2, 1)"
      }
    }
  }
};
