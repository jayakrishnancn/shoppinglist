import React, { useState, ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface ConfirmationBoxProps {
  title: string;
  description: string | ReactNode;
  onConfirm: (e: React.MouseEvent<HTMLElement>) => void;
  button: (handleOpen: () => void) => ReactNode;
}

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  title,
  description,
  onConfirm,
  button,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = (e: React.MouseEvent<HTMLElement>) => {
    onConfirm(e);
    setOpen(false);
  };

  return (
    <div>
      {button(handleOpen)}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined"  onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="outlined"  onClick={handleConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationBox;
