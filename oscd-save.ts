import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

function formatXml(xml: string, tab?: string): string {
  let formatted = '';
  let indent = '';

  // eslint-disable-next-line no-param-reassign
  if (!tab) tab = '\t';
  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) indent = indent.substring(tab!.length);
    formatted += `${indent}<${node}>\r\n`;
    if (node.match(/^<?\w[^>]*[^/]$/)) indent += tab;
  });
  return formatted.substring(1, formatted.length - 3);
}

export default class OscdSave extends LitElement {
  @property() doc!: XMLDocument;

  @property() docName!: string;

  async run() {
    if (this.doc) {
      const blob = new Blob(
        [formatXml(new XMLSerializer().serializeToString(this.doc))],
        {
          type: 'application/xml',
        }
      );

      const a = document.createElement('a');
      a.download = this.docName;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = ['application/xml', a.download, a.href].join(':');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 5000); // TODO(ca-d): discuss revoke timeout length
    }
  }

  render() {
    return html`<button @click=${() => this.run()}>Save project</button>`;
  }
}
