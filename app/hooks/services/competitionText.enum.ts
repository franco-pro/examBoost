export enum CompetitionTypeDescription {
    GOLDEN_A = "🏆 Golden A\n\nL'inscription à votre compétition est PAYANTE et une RECOMPENSE est prévue pour le vainqueur, définie par vous.\nPour utiliser l'IA dans ce type de compétition, la récompense du vainqueur doit être SUPERIEURE OU EGALE A ${price}.\n",
    
    GOLDEN_B = "🎯 Golden B\n\nL'inscription est GRATUITE, mais vous devez définir une RECOMPENSE OBLIGATOIRE pour le vainqueur.\nPour utiliser l'IA dans ce type de compétition, la récompense du vainqueur doit être SUPERIEURE OU EGALE A ${price}.\n",
    
    GOLDEN_C = "💰 Golden C\n\nLa RECOMPENSE PROVIENT DES FRAIS D'INSCRIPTION de tous les participants.\nExemple : pour 10 participants payant chacun 1 000 XAF, le vainqueur remporte 80% du montant total.\nIdéal pour les paris entre amis et les compétitions privées.\nPour utiliser l'IA, la récompense doit être SUPERIEURE OU EGALE A ${price_private}.\n",
    
    GOLDEN_D = "🆓 Golden D\n\nCompétition GRATUITE et SANS RECOMPENSE. \nDans ce type, l'utilisation de l'IA n'est PAS POSSIBLE : vous devez créer vous-même les questions et gérer le déroulement.\n",
    
    NOTE = "ℹ️ NB: En utilisant l'Intelligence Artificielle pour votre compétition, les questions, corrections et le classement final de la compétition sont gérés par cette dernière.\n\n Pour les competitions privée, vous devez inviter les participants après la creation de la compétition."
}
  