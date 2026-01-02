export enum CompetitionTypeDescription {
    GOLDEN_A = "🏆 Golden A\n\nL'inscription à votre compétition est PAYANTE et une RECOMPENSE est prévue pour le vainqueur, définie par vous.\nPour utiliser l'IA dans ce type de compétition, la récompense du vainqueur doit être SUPERIEURE OU EGALE A ${price}.\n",
    
    GOLDEN_B = "🎯 Golden B\n\nL'inscription est GRATUITE, mais vous devez définir une RECOMPENSE OBLIGATOIRE pour le vainqueur.\nPour utiliser l'IA dans ce type de compétition, la récompense du vainqueur doit être SUPERIEURE OU EGALE A ${price}.\n",
    
    GOLDEN_C = "💰 Golden C\n\nLa RECOMPENSE PROVIENT DES FRAIS D'INSCRIPTION de tous les participants.\nExemple : pour 10 participants payant chacun 1 000 XAF, le vainqueur remporte ${percentage} du montant total.\nIdéal pour les paris entre amis et les compétitions privées.\nPour utiliser l'IA, la récompense doit être SUPERIEURE OU EGALE A ${price_private}.\n",
    
    GOLDEN_D = "🆓 Golden D\n\nCompétition GRATUITE et SANS RECOMPENSE. \nDans ce type, l'utilisation de l'IA n'est PAS POSSIBLE : vous devez créer vous-même les questions et gérer le déroulement.\n",
    
    NOTE = "ℹ️ NB: En utilisant l'Intelligence Artificielle pour votre compétition, les questions, corrections et le classement final de la compétition sont gérés par cette dernière.\n\n Pour les competitions privée, vous devez inviter les participants après la creation de la compétition.",

    GOLDEN_A_EN = "🏆 Golden A\n\nRegistration for your competition is PAID and a REWARD is planned for the winner, defined by you.\nTo use AI in this type of competition, the winner's reward must be GREATER THAN OR EQUAL TO ${price}.\n",
    
    GOLDEN_B_EN = "🎯 Golden B\n\nRegistration is FREE, but you must define a MANDATORY REWARD for the winner.\nTo use AI in this type of competition, the winner's reward must be GREATER THAN OR EQUAL TO ${price}.\n",
    
    GOLDEN_C_EN = "💰 Golden C\n\nThe REWARD COMES FROM THE REGISTRATION FEES of all participants.\nExample: for 10 participants each paying 1,000 XAF, the winner receives ${percentage} of the total amount.\nIdeal for betting between friends and private competitions.\nTo use AI, the reward must be GREATER THAN OR EQUAL TO ${price_private}.\n",
    
    GOLDEN_D_EN = "🆓 Golden D\n\nFREE competition with NO REWARDS. \nIn this type, the use of AI is NOT POSSIBLE: you must create the questions yourself and manage the flow.\n",
    
    NOTE_EN = "ℹ️ NB: When using Artificial Intelligence for your competition, the questions, corrections, and final ranking of the competition are managed by the AI.\n\n For private competitions, you must invite participants after the competition has been created."
}
  