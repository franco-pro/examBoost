import Competition from "@/app/hooks/services/competitions/competition.entity";


export const filterByCompetitionName = (
    value: string,
    list: Competition[]
  ) => {
    const normalizedValue = normalize(value);
  
    const finalList = list.filter(comp =>
      normalize(comp.name).includes(normalizedValue)
    );
  
    return {
      found: finalList.length > 0,
      finalList
    };
  };
  
  const normalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");


export const filterByCompetitionStatut = (statut: "CANCELLED"|"UPCOMING"|"ONGOING"|"COMPLETED",list: Competition[])=>{
    const finalList = list.filter((val => val.statut == statut));

    return {found: finalList.length!= 0, finalList: finalList}
}

export const filterByCompetitionType = (type:
    "PAID_REGISTRATION_AS_WINNER_PRICE"
    | "FREE_REGISTRATION_WITH_WINNER_PRICE"
    | "PAID_REGISTRATION_WITH_WINNER_PRICE"
    | "TOTAL_FREE_NO_PRICE_TO_WIN", list: Competition[])=>{

        const finalList = list.filter((val => val.type == type));

        return {found: finalList.length!= 0, finalList: finalList}
}

export const filterByCompetitionLang = ( language: 'ANGLAIS' | 'FRANCAIS',  list: Competition[])=>{
    const finalList = list.filter((val => val.language == language));

    return {found: finalList.length!= 0, finalList: finalList}
}