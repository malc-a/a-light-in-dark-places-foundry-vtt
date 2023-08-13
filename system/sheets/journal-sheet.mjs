/**
 * Extend the basic JournalSheet to add a system-specific class entry
 * @extends {JournalSheet}
 */
export class ALiDPJournalSheet extends JournalSheet {
    /** @override */
    static get defaultOptions() {
        let options = super.defaultOptions;
        options.classes.unshift("a-light-in-dark-places");
        return options;
    }
}
