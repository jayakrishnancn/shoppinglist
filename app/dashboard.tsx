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
import { toast } from "react-toastify";

export default function Dashboard() {
  const [data, setData] = useState<ItemType[]>([]);
  const { setIsLoading } = useMetadata();
  const { user } = useAuth();
  const userId = user?.uid ?? "";

  const getItemsFromServer = (userId: string) => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    getItems(userId)
      .then(setData)
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
      .then(setData)
      .then(() => toast.info("Added new item to list."))
      .catch((error) => {
        console.error(error);
        toast.error("Error saving item to database.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = async (ids: string[]) => {
    console.log(ids);
    setIsLoading(true);
    return deleteItems(userId, ids)
      .then(setData)
      .then(() => 
        toast.info("Deleted items from list."))
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting list to database.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdates = async (newData: ItemType[]) => {
    setIsLoading(true);
    return updateItems(userId, newData)
      .then(setData)
      .then((res) => 
        toast.info("Updated items of the list."))
      .catch((error) => {
        console.error(error);
        toast.error("Error updating items to database.");
      })
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
        <ListItem
          rows={data}
          onDelete={handleDelete}
          onUpdate={handleUpdates}
        />
      </Box>
    </Container>
  );
}
