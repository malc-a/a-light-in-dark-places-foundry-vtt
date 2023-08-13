/**
 * Extend the basic Dialog to add a system-specific class entry
 * @extends {Dialog}
 */
export class ALiDPDialog extends Dialog {
    /** @override */
    constructor(dialogData = {}, options = {}) {
        super(dialogData, options);
        this.options.classes.unshift("a-light-in-dark-places");
    }
}
