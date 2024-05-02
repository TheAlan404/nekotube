export const getInitials = (name: string) => name
    .toUpperCase()
    .split(" ")
    .filter(x => x)
    .map(x => x[0])
    .join("")
    .slice(0, 2);
