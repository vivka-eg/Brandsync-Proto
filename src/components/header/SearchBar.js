import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  return (
    <TextField
      variant="outlined"
      placeholder="Search"
      size="small"
      sx={{
        borderRadius: 3,
        bgcolor: 'background.paper',
        minWidth: 320,
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
} 