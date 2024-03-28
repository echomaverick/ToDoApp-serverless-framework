import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectChip({
  value,
  onChange,
  availableUsers,
  availableTasks,
}) {
  const theme = useTheme();
  const [userSelection, setUserSelection] = React.useState(value.users);
  const [taskSelection, setTaskSelection] = React.useState(value.tasks);

  const handleUserChange = (event) => {
    const { value } = event.target;
    setUserSelection(value);
    onChange({ users: value, tasks: taskSelection });
  };

  const handleTaskChange = (event) => {
    const { value } = event.target;
    setTaskSelection(value);
    onChange({ users: userSelection, tasks: value });
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Select Users:</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={userSelection}
          onChange={handleUserChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Select Users" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {availableUsers.map((user) => (
            <MenuItem
              key={user}
              value={user}
              style={getStyles(user, userSelection, theme)}
            >
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label-tasks">
          Select Tasks:
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label-tasks"
          id="demo-multiple-chip-tasks"
          multiple
          value={taskSelection}
          onChange={handleTaskChange}
          input={
            <OutlinedInput
              id="select-multiple-chip-tasks"
              label="Select Tasks"
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {availableTasks.map((task) => (
            <MenuItem
              key={task}
              value={task}
              style={getStyles(task, taskSelection, theme)}
            >
              {task}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function getStyles(name, selection, theme) {
  return {
    fontWeight:
      selection.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
