"use client";

import Table from "@/components/Table";
import { Box, Button, TextField } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "./constants";
import { deleteItem, post } from "./services/request";
import { ShoppingListItemType } from "./v1/api/shopping-list/shoppingListService";

export default function Home() {
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [rows, setRows] = useState<ShoppingListItemType[]>([]);

  const handleAdd = () => {
    post<ShoppingListItemType, ShoppingListItemType[]>(ROUTES.SHOPPING_LIST, {
      id: "tmp-" + Math.random(),
      name: itemName,
      price: Number(cost) || 0,
    }).then(({ data }) => {
      setRows(data);
    });
  };

  useEffect(() => {
    fetch("/v1/api/shopping-list")
      .then((res) => res.json())
      .then((res) => setRows(res.data));
  }, []);

  const columns: GridColDef[] = [
    { field: "name", headerName: "name" },
    {
      field: "price",
      headerName: "Price",
      editable: true,
    },
    {
      field: "id",
      headerName: "Action",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          if (!params.value) {
            return;
          }
          deleteItem<{ id: string }, ShoppingListItemType[]>(
            ROUTES.SHOPPING_LIST + "/" + params.value
          ).then((res) => {
            setRows(res.data);
          });
        };
        return (
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        );
      },
    },
  ];

  const total = useMemo(
    () =>
      rows && rows.length > 0
        ? rows.reduce(
            (sum, curr) => (curr.price > 0 ? sum + curr.price : sum),
            0
          )
        : 0,
    [rows]
  );

  return (
    <main className=" flex flex-col p-4">
      <Box my={1} gap={1} display="flex">
        <TextField
          size="small"
          label="Item"
          autoFocus
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
          size="small"
          type="number"
          label="Price"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <Button onClick={handleAdd} size="small" variant="contained">
          ADD
        </Button>
      </Box>
      <Table rows={rows} columns={columns} />
      <div>Total: {total}</div>
    </main>
  );
}
