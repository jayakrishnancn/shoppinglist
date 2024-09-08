"use client";
import { Box, Container } from "@mui/material";
import ListItem from "./listItems";
import Form from "./Form";
import { useEffect, useMemo, useState } from "react";
import {
  deleteItems,
  getItems,
  ItemType,
  Response,
  saveItem,
  updateItems,
} from "./item-service";
import useAuth from "./firebase/useAuth";
import { useMetadata } from "./contexts/metadata";

export default function Dashboard() {
  const [data, setData] = useState<ItemType[]>([]);
  const { setIsLoading } = useMetadata();
  const { user } = useAuth();
  const userId = user?.uid ?? "";

  const setDataItemFromRes = (res: Response<ItemType[] | null> | null) => {
    setData(res?.data ?? []);
  };
  const getItemsFromServer = (userId: string) => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    getItems(userId)
      .then(setDataItemFromRes)
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => getItemsFromServer(userId), [userId]);
  const total = useMemo(
    () =>
      data && data.length > 0
        ? data.reduce((sum, curr) => (curr.cost > 0 ? sum + curr.cost : sum), 0)
        : 0,
    [data],
  );

  const handleSubmit = async (item: ItemType) => {
    setIsLoading(true);
    return saveItem(userId, item)
      .then(setDataItemFromRes)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = async (ids: string[]) => {
    console.log(ids);
    setIsLoading(true);
    return deleteItems(userId, ids)
      .then(setDataItemFromRes)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdate = async (newData: ItemType) => {
    console.log(newData);
    setIsLoading(true);
    return updateItems(userId, newData)
      .then(() => getItemsFromServer(userId))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Form onSubmit={handleSubmit} />
        <Box my={1}>
          Total: <b>{new Intl.NumberFormat().format(total)}</b>
        </Box>
        <ListItem rows={data} onDelete={handleDelete} onUpdate={handleUpdate} />
      </Box>
    </Container>
  );
}
