"use client";
import { Box, Container } from "@mui/material";
import ListItem from "./listItems";
import Form from "./Form";
import { useEffect, useState } from "react";
import { getItems, ItemType, saveItem } from "./item-service";

const userId = "id-1";

export default function Home() {
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

  const handleSubmit = (item: ItemType) => {
    saveItem(userId, item).then((_) => {
      getItemsFromServer(userId);
    });
  };

  return (
    <Container sx={{ mt: 1 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Form onSubmit={handleSubmit} />
        <ListItem rows={data} />
      </Box>
    </Container>
  );
}
