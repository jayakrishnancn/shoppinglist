"use client";

import { useFormik } from "formik";
import { ItemType } from "./item-service";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useRef } from "react";
import { STATUS } from "./utils/sortItem";

export type FormProps = {
  onSubmit: (value: ItemType) => Promise<any>;
};

export default function Form({ onSubmit }: FormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      cost: 0,
      id: "",
      status: STATUS[0],
    },
    onSubmit: (values, { resetForm }) => {
      onSubmit(values).then(() => {
        resetForm();
        inputRef.current?.focus();
      });
    },
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
          inputRef={inputRef}
        />
        {formik.errors.name && <Alert severity="error">Invalid Name</Alert>}

        <TextField
          value={formik.values.cost}
          type="number"
          required
          onChange={formik.handleChange}
          name="cost"
        />
        {formik.errors.name && <Alert severity="error">Invalid Cost</Alert>}

        <FormControl size="small">
        <InputLabel id="change-status-form-label">Status</InputLabel>
        <Select
          labelId="change-status-form-label"
          label="Status"
          value={formik.values.status}
          name="status"
          onChange={formik.handleChange}
          size="medium"
        >
          {STATUS.map((value) => (
            <MenuItem key={value as string} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

        <Button variant="contained" type="submit" color="success">
          ADD
        </Button>
      </Box>
    </form>
  );
}
