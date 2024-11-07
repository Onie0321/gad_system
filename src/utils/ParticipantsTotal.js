export function calculateParticipantTotals(participants) {
    const totalCount = participants.length;
    const maleCount = participants.filter((p) => p.sex === "Male").length;
    const femaleCount = participants.filter((p) => p.sex === "Female").length;
  
    return { totalCount, maleCount, femaleCount };
  }