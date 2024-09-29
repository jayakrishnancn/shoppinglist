"use client";

import { useFormik } from "formik";
import { ProjectType } from "./item-service";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useRef } from "react";

export type FormProps = {
  onSubmit: (value: ProjectType) => Promise<any>;
};

export default function FormProject({ onSubmit }: FormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
      sharedWith: [],
    } as ProjectType,
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
          placeholder="Project name"
        />
        {formik.errors.name && <Alert severity="error">Invalid Name</Alert>}
        <Button variant="contained" type="submit" color="success">
          ADD
        </Button>
      </Box>
    </form>
  );
}
