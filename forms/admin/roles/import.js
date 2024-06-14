import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class RoleImport extends PlForm {
    static properties =  {
        formTitle: { type: String, value: 'Импорт ролей' },
        files: { type: Array, values: () => [], observer: '_filesObserver' }
    }

    static template = html`
        <pl-flex-layout stretch>
            <pl-file-upload
                files="{{files}}"
                accept=".json"
                endpoint="/@nfjs/back-dbfw/api/roles/importRoleUnitPrivs/upload"
                hint="Перетащите файл или нажмите здесь, чтобы загрузить"
                stretch
            ></pl-file-upload>
        </pl-flex-layout>
    `;

    _filesObserver() {
        if (this.files[0]?.id) {
            this.close(true);
        }
    }
}