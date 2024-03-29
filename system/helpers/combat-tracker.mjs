// Define our own Combat Tracker Class
export class ALiDPCombatTracker extends CombatTracker {
    get template() {
        return "systems/a-light-in-dark-places/templates/chat/combat-tracker.html";
    }

    async _onCombatControl(event) {
        super._onCombatControl(event);
        const btn = event.currentTarget;
        const combat = this.viewed;
        switch (btn.dataset.control) {
        case "resetActions":
            return combat.turns.forEach((c) => { c.actor.updateActions(1); });
        }
    }

    async _onCombatantControl(event) {
        super._onCombatantControl(event);
        const btn = event.currentTarget;
        const li = btn.closest(".combatant");
        const combat = this.viewed;
        const c = combat.combatants.get(li.dataset.combatantId);
        switch (btn.dataset.control) {
        case "addAction":
            c.actor.updateActions(c.actor.system.actions + 1);
            break;
        case "removeAction":
            c.actor.updateActions(c.actor.system.actions - 1);
            break;
        }
    }
}

// Define our own Combat Class
export class ALiDPCombat extends Combat {
    _sortCombatants(a, b) {
        const s = b.initiative - a.initiative;
        return (s == 0 && !a.isNPC && b.isNPC) ? -1 : (s == 0 && a.isNPC && !b.isNPC) ? 1 : s;
    }

    async beginCombat() {
        this.turns.forEach((c) => { c.actor.updateActions(1); });
        return super.beginCombat();
    }

    async nextRound() {
        this.turns.forEach((c) => { c.actor.updateActions(1); });
        return super.nextRound();
    }
}
