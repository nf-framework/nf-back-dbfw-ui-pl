import { PlElement, css } from "polylib";
import { requestData } from "@nfjs/front-pl/lib/RequestServer.js";

class PlAccess extends PlElement {
    static get properties() {
        return {
            endpoint: {
                type: String
            },
            executed: {
                type: Boolean,
                value: false
            },
            data: {
                type: Object
            },
            noAutoExecute: {
                type: Boolean,
                value: false
            }
        }
    }

    static get css() {
        return css`
            :host {
                display: none;
            }
		`;
    }

    connectedCallback(){
        super.connectedCallback();
        this.executed = new Promise((resolve) => this._resolveAccess = resolve);
        if (!this.noAutoExecute) this.execute();
    }

    async execute() {
        let url = this.endpoint;
        if (!url) {
            // значение по умолчанию это fse(formServerEndpoint)
            const formName = this.parentNode.host.localName.replace('pl-form-','');
            url = `/@nfjs/front-pl/fse/${formName}/access/${this.id}`;
        }
        const req = await requestData(url, { method: 'POST' });
        this.data = await req.json();
        this._resolveAccess(true);
        return this.data;
    }
}

customElements.define('pl-access', PlAccess);
