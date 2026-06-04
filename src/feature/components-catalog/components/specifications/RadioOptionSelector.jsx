import { Box, Radio, Stack, Typography } from "@mui/material";

function RadioOptionSelector({
  radioButtonsValues,
  radioButtonValue,
  setRadioButtonValue,
}) {
  return (
    <Stack
      direction={"row"}
      padding={2}
      sx={{
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {radioButtonsValues.map((item, index) => (
        <Stack key={index} direction={"row"} alignItems="center">
          <Box
            component="label"
            sx={{
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Radio
              checked={item === radioButtonValue}
              onChange={(e) => {
                setRadioButtonValue(e.target.value);
              }}
              value={item}
              name="radio-buttons"
              inputProps={{ "aria-label": item }}
              // name={item}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default RadioOptionSelector;
