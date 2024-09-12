"use client";
import { Box, Button, ButtonGroup } from "@mui/material";
import ListItemTable from "./listItems";
import Form from "./Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteItems,
  getItems,
  ItemType,
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

  const getItemsFromServer = useCallback(
    (userId: string) => {
      if (!userId) {
        return;
      }
      setIsLoading(true);
      getItems(userId)
        .then(setData)
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setIsLoading]
  );

  useEffect(() => getItemsFromServer(userId), [userId, getItemsFromServer]);
  const { total, completed, future } = useMemo(
    () =>
      data && data.length > 0
        ? data.reduce(
            (prev, curr) => ({
              total: prev.total + Math.max(curr.cost, 0),
              completed:
                prev.completed + (curr.status === "Completed" ? curr.cost : 0),
              future:
                prev.future + (curr.status !== "Completed" ? curr.cost : 0),
            }),
            { total: 0, completed: 0, future: 0 }
          )
        : { total: 0, completed: 0, future: 0 },
    [data]
  );

  const handleSubmit = async (item: ItemType) => {
    setIsLoading(true);
    return saveItem(userId, item)
      .then(() => getItemsFromServer(userId))
      .then(() =>
        toast.success("Added new item to list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error saving item to database.", { theme: "colored" });
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
        toast.success("Deleted items from list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting list to database.", { theme: "colored" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdates = async (newData: ItemType[]) => {
    setIsLoading(true);
    return updateItems(userId, newData)
      .then(setData)
      .then(() =>
        toast.success("Updated items of the list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error updating items to database.", { theme: "colored" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} mb="100px">
      <Box my={1}>
        <ButtonGroup
          color="inherit"
          fullWidth
          size="small"
          aria-label="Small button group"
        >
          <Button>
            Pending: <b>{new Intl.NumberFormat().format(future)}</b>
          </Button>
          <Button>
            Completed: <b>{new Intl.NumberFormat().format(completed)}</b>
          </Button>
          <Button>
            Total: <b>{new Intl.NumberFormat().format(total)}</b>
          </Button>
        </ButtonGroup>
      </Box>
      <ListItemTable
        rows={data}
        onDelete={handleDelete}
        onUpdate={handleUpdates}
      />
      <Box
        position="fixed"
        bottom={0}
        right={0}
        left={0}
        bgcolor="#cbe5cc"
        zIndex={10}
        p={2}
        display="flex"
        justifyContent="center"
      >
        <Form onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
}
