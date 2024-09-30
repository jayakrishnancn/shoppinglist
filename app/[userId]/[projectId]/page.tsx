"use client";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ListItemTable from "../../listItems";
import Form from "../../Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteItems,
  getItems,
  getProjects,
  ItemType,
  ProjectType,
  saveItem,
  updateItems,
} from "../../item-service";
import { useMetadata } from "../../contexts/metadata";
import { toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";

export default function Dashboard({ params }: any) {
  const [data, setData] = useState<ItemType[]>([]);
  const { setIsLoading } = useMetadata();
  const { userId, projectId } = params;
  const [projects, setProjects] = useState([] as ProjectType[]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    getProjects(userId)
      .then(setProjects)
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  const getItemsFromServer = useCallback(
    (userId: string, projectId: string) => {
      if (!userId || !projectId) {
        return;
      }
      setIsLoading(true);
      getItems(userId, projectId)
        .then(setData)
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setIsLoading]
  );

  useEffect(
    () => getItemsFromServer(userId, projectId),
    [userId, getItemsFromServer, projectId]
  );
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
    return saveItem(userId, projectId, [item])
      .then(() => getItemsFromServer(userId, projectId))
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
    return deleteItems(userId, projectId, ids)
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

  const handleUpdates = async (newData: any[]) => {
    setIsLoading(true);
    return updateItems(userId, projectId, newData)
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

  const handleCopy = async ({
    targetProjectId,
    sourceProjectId,
    items,
  }: {
    targetProjectId: string;
    items: ItemType[];
    sourceProjectId: string;
  }) => {
    setIsLoading(true);
    return saveItem(userId, targetProjectId, items)
      .then(() =>
        deleteItems(
          userId,
          sourceProjectId,
          items.map((i) => i.id)
        )
      )
      .then(() => getItemsFromServer(userId, projectId))
      .then(() => {
        toast.success("Successfully copied items");
      })
      .catch((error) => {
        toast.error("Error: " + error?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const CopyButton = ({
    hasRowSelection,
    selectedRowValues,
  }: {
    hasRowSelection: boolean;
    selectedRowValues: ItemType[];
  }) => {
    return (
      projects?.length > 0 && (
        <FormControl size="small">
          <InputLabel id="demo-simple-select-Move">Move to Project</InputLabel>
          <Select
            disabled={!hasRowSelection}
            labelId="demo-simple-select-Move"
            label="Move to Project"
            value={projectId}
            onChange={(event: SelectChangeEvent) => {
              if (!hasRowSelection) {
                return;
              }
              handleCopy({
                targetProjectId: event.target.value,
                items: selectedRowValues,
                sourceProjectId: projectId,
              });
            }}
            size="small"
          >
            {projects.map((project) => (
              <MenuItem key={project.id as string} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    );
  };

  return (
    <Box
      display="flex"
      maxWidth="lg"
      mx="auto"
      flexDirection="column"
      gap={1}
      mb="100px"
    >
      <Box my={1} gap={1} display="flex" flexDirection="column">
        <div>
          <Button href="/" variant="contained" startIcon={<ArrowBack />}>
            Back
          </Button>
        </div>
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
        buttons={{
          enableStatusChange: true,
          customButtons: CopyButton,
        }}
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
