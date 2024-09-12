import { ItemType, StatusType } from "../item-service";
export const STATUS: StatusType[] = [
  "TODO - Distant future",
  "TODO - Near future",
  "IN PROGRESS",
  "COMPLETED",
  "UNKNOWN",
];

export function sortItems(
  items: ItemType[],
  key: keyof ItemType,
  order: "ASC" | "DESC" = "ASC"
): ItemType[] {
  return items.sort((a, b) => {
    let comparison = 0;

    if (key === "status") {
      comparison = STATUS.indexOf(a.status) - STATUS.indexOf(b.status);
    } else if (key === "cost") {
      comparison = a.cost - b.cost;
    } else if (typeof a[key] === "number" && typeof b[key] === "number") {
      comparison = a[key] - b[key]; // Numeric comparison
    } else if (typeof a[key] === "string" && typeof b[key] === "string") {
      comparison = a[key].localeCompare(b[key]); // String comparison
    } else if (typeof a === "number") {
      comparison = -1; // Numbers come before strings
    } else {
      comparison = 1; // Strings come after numbers
    }

    return order === "ASC" ? comparison : -comparison;
  });
}
