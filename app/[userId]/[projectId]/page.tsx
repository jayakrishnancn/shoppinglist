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

interface DataItem {
  id: string;
  cost: number;
  status: string;
}

interface Summary {
  total: number;
  completed: number;
  future: number;
}

interface SummaryResult {
  overall: Summary;
  selected: Summary;
}
const initialSummary: Summary = { total: 0, completed: 0, future: 0 };

const calculateSummary = (
  data: DataItem[],
  selectedRows: (string | number)[]
): SummaryResult => {
  return data.reduce(
    (prev, curr) => {
      const cost = Math.max(curr.cost, 0);
      const isCompleted = curr.status === "Completed";
      const isSelected = selectedRows.includes(curr.id);

      return {
        overall: {
          total: prev.overall.total + cost,
          completed: prev.overall.completed + (isCompleted ? cost : 0),
          future: prev.overall.future + (!isCompleted ? cost : 0),
        },
        selected: {
          total: prev.selected.total + (isSelected ? cost : 0),
          completed:
            prev.selected.completed + (isSelected && isCompleted ? cost : 0),
          future:
            prev.selected.future + (isSelected && !isCompleted ? cost : 0),
        },
      };
    },
    { overall: initialSummary, selected: initialSummary }
  );
};

export default function Dashboard({ params }: any) {
  const [data, setData] = useState<ItemType[]>([]);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
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
  }, [setIsLoading, userId]);

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

  const {
    overall: { total, completed, future },
    selected,
  } = useMemo(() => {
    if (!data || data.length === 0) {
      return { overall: initialSummary, selected: initialSummary };
    }
    return calculateSummary(data, selectedRows);
  }, [data, selectedRows]);

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

  const tableKey = useMemo(() => JSON.stringify(data), [data]);

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
        <ButtonGroup
          color="inherit"
          fullWidth
          size="small"
          aria-label="Small button group"
        >
          <Button>
            Selected Pending:{" "}
            <b>{new Intl.NumberFormat().format(selected.future)}</b>
          </Button>
          <Button>
            Selected Completed:{" "}
            <b>{new Intl.NumberFormat().format(selected.completed)}</b>
          </Button>
          <Button>
            Selected Total:{" "}
            <b>{new Intl.NumberFormat().format(selected.total)}</b>
          </Button>
        </ButtonGroup>
      </Box>
      <ListItemTable
        key={tableKey}
        rows={data}
        onDelete={handleDelete}
        onUpdate={handleUpdates}
        onSelectionChange={(items) => setSelectedRows([...items])}
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
