export interface HomeBaseCompetition{
      MAX_PARTICIPANTS: number,
      MIN_PARTICIPANTS: number,
      MAX_QUESTION_NUMBER: number,
      MIN_QUESTION_NUMBER: number,

      PERCENTAGE: number,
      MIN_WINNERPRICE_TO_USE_AI_IN_PRIVATE_COMP: number,
      MIN_WINNERPRICE_TO_USE_AI_IN_PUBLIC_COMP: number,

      CREATION_HELP: {
        GoldenA: string,
        GoldenB: string,
        GoldenC: string,
        GoldenD: string
      },

      competitionCreated: number,
      competitionLeaved: number,
      competitionFinished: number,
      competitionWin: number,
      totalPriceWin: number,
      competitionEnded: number,
      totalParticipants: number
}