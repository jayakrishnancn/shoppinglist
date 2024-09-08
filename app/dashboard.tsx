"use client";
import { Box, Container } from "@mui/material";
import ListItem from "./listItems";
import Form from "./Form";
import { useEffect, useMemo, useState } from "react";
import { deleteItems, getItems, ItemType, saveItem } from "./item-service";

const userId = "id-1";

export default function Dashboard() {
  console.log("rendering Home");
  const [data, setData] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const getItemsFromServer = (userId: string) => {
    setLoading(true);
    getItems(userId)
      .then((res) => setData(res?.data ?? []))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => () => getItemsFromServer(userId), []);
  const total = useMemo(
    () =>
      data && data.length > 0
        ? data.reduce((sum, curr) => (curr.cost > 0 ? sum + curr.cost : sum), 0)
        : 0,
    [data],
  );

  const handleSubmit = (item: ItemType) => {
    setLoading(true);
    saveItem(userId, item)
      .then((_) => getItemsFromServer(userId))
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDelete = (ids: string[]) => {
    console.log(ids);
    setLoading(true);
    deleteItems(userId, ids)
      .then(() => getItemsFromServer(userId))
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Form onSubmit={handleSubmit} />
        <div>Total: {total}</div>
        <ListItem rows={data} onDelete={handleDelete} />
      </Box>
    </Container>
  );
}
