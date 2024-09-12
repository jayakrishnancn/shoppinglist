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
  order: "ASC" | "DESC" = "ASC",
): ItemType[] {
  return items.sort((a, b) => {
    let comparison = 0;

    if (key === "status") {
      comparison = STATUS.indexOf(a.status) - STATUS.indexOf(b.status);
    } else if (key === "cost") {
      comparison = a.cost - b.cost;
    } else {
      comparison = a[key].localeCompare(b[key]);
    }

    return order === "ASC" ? comparison : -comparison;
  });
}
