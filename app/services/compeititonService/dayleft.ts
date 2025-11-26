function getDateCameroun() {
    // Formatter pour Africa/Douala (GMT+1)
    const formatter = new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Africa/Douala",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const parts = formatter.formatToParts(new Date());
    const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));

    // Construire une vraie date locale Cameroun
    return new Date(
        `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}+01:00`
    );
}

export function tempsRestant(dateISO: any) {
    const cible = new Date(dateISO);
    const nowCM = getDateCameroun();

    const diff = cible.getTime() - nowCM.getTime();

    if (diff <= 0) return { jours: 0, heures: 0, minute: 0, valid: false };
    
    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {day: jours, hours: heures, minutes: minute, valid: (diff > 0)};
}

// Exemple d’utilisation
