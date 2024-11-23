import PerformantSelect, { Option } from "@/PerformantSelect";
import { faker } from "@faker-js/faker";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";

export default function Home() {
  const [value, setValue] = useState<Option | Option[]>();
  const options = useMemo(() => {
    return Array.from({ length: 10000 }).map(() => ({
      value: faker.string.uuid(),
      label: faker.person.fullName(),
    }));
  }, []);
  return (
    <Box
      sx={{
        margin: "200px",
      }}
    >
      <PerformantSelect
        multiple
        value={value}
        options={options}
        onChange={(item) => setValue(item)}
      />
    </Box>
  );
}
