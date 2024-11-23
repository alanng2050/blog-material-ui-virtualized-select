import Popover from "@mui/material/Popover";
import { CSSProperties, MouseEvent, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import {
  Box,
  Checkbox,
  colors,
  FormControl,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Clear from "@mui/icons-material/Clear";

export type Option = { value: string | number; label: string };
type Props = {
  options: Option[];
  onChange: (item: Option | Option[]) => void;
  value?: Option | Option[];
  multiple?: boolean;
};

type ItemData = {
  options: Props["options"];
  onChange: (item: Option) => void;
  selectedValues: Option["value"][];
  multiple?: boolean;
};

const Row = ({
  index,
  style,
  data,
}: {
  index: number;
  style: CSSProperties;
  data: ItemData;
}) => {
  const item = data.options[index];
  const isSelected = data.selectedValues.includes(item.value);

  return (
    <Box
      onClick={() => data.onChange(item)}
      style={style}
      sx={{
        background: isSelected ? colors.blue[100] : "white",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          background: colors.blue[100],
        },
      }}
    >
      {data.multiple && <Checkbox checked={isSelected} />}
      <Typography>{item.label}</Typography>
    </Box>
  );
};

export default function PerformantSelect({
  options,
  onChange,
  value,
  multiple,
}: Props) {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const _onChange = (item: Option) => {
    if (multiple) {
      let _value = Array.isArray(value) ? [...value] : [];
      const index = _value.findIndex((i) => i.value === item.value);
      if (index !== -1) {
        _value.splice(index, 1);
      } else {
        _value.push(item);
      }
      onChange(_value);
    } else {
      onChange(item);
    }

    handleClose();
  };

  const selectedValues = Array.isArray(value)
    ? value.map((item) => item.value)
    : [value?.value || ""];

  const list = useMemo(() => {
    if (search)
      return options.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
    return options;
  }, [search, options]);

  const itemData: ItemData = {
    options: list,
    onChange: _onChange,
    selectedValues,
    multiple,
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <FormControl onClick={handleClick} sx={{ marginLeft: 50, marginTop: 10 }}>
        <InputLabel
          sx={{ paddingLeft: 1, paddingRight: 1, background: "white" }}
          shrink={open || !!value}
        >
          Select
        </InputLabel>
        <TextField
          id="component-simple"
          sx={{
            "& .MuiInputBase-input": {
              opacity: 0,
              width: 0,
              paddingRight: 0,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Box
                  sx={{
                    width: 200,
                    cursor: "pointer",
                    lineHeight: "40px",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "stretch",
                  }}
                >
                  {Array.isArray(value)
                    ? `${value.length} selected`
                    : value?.label}
                </Box>
              ),
              endAdornment: (
                <InputAdornment sx={{ cursor: "pointer" }} position="start">
                  <ExpandMoreIcon
                    sx={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ minWidth: 300, width: "100%" }}>
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "grey.200",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={search}
              placeholder="Search"
              onChange={(evt) => setSearch(evt.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "grey.400" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment
                      onClick={() => setSearch("")}
                      sx={{ cursor: "pointer" }}
                      position="start"
                    >
                      <Clear sx={{ color: "grey.400" }} fontSize="small" />
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              size="small"
            />
          </Box>

          <FixedSizeList
            itemData={itemData}
            height={240}
            itemCount={list.length}
            itemSize={40}
            width={"100%"}
            itemKey={(index, _data) => _data.options[index].value}
          >
            {Row}
          </FixedSizeList>
        </Box>
      </Popover>
    </div>
  );
}
