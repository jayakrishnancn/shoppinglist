"use client";

import { useFormik } from "formik";
import { ItemType } from "./item-service";
import { Alert, Box, Button, TextField } from "@mui/material";

export type FormProps = {
  onSubmit: (value: ItemType) => void;
};

export default function Form({ onSubmit }: FormProps) {
  console.log("rendering Form");
  const formik = useFormik({
    initialValues: {
      name: "",
      cost: 0,
      id: "",
    },
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box gap={1} display="flex">
        <TextField
          value={formik.values.name}
          autoFocus
          required
          onChange={formik.handleChange}
          name="name"
        />
        {formik.errors.name && <Alert severity="error">Invalid Name</Alert>}

        <TextField
          value={formik.values.cost}
          type="number"
          autoFocus
          required
          onChange={formik.handleChange}
          name="cost"
        />
        {formik.errors.name && <Alert severity="error">Invalid Cost</Alert>}

        <Button variant="contained" type="submit" color="success">
          ADD
        </Button>
      </Box>
    </form>
  );
}
