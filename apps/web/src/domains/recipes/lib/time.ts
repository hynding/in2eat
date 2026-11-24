/** 95 → "1 h 35 min" */
export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return [hours > 0 && `${hours} h`, (minutes > 0 || hours === 0) && `${minutes} min`].filter(Boolean).join(" ");
}

export const totalMinutes = (time: { prep: number; cook: number }): number => time.prep + time.cook;
