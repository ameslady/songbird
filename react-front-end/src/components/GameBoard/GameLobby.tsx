import React, { useState } from "react";

// styling
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  AlertTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// components
import GenreSelector from "./GenreSelector";

// interfaces
import { IGameLobby } from "../../Interfaces";

export const GameLobby = (props: IGameLobby) => {
  const [rounds, setRounds] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  const handleOnAdd = (): void => {
    if (rounds < 10) {
      setRounds(rounds + 1);
    }
  };

  const handleOnSubtract = (): void => {
    if (rounds > 1) {
      setRounds(rounds - 1);
    }
  };

  const handleCopyClick = (): void => {
    navigator.clipboard.writeText(`http://localhost:3000/?${props.roomId}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Box
      sx={{
        margin: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: 3, 
        height: '98vh'
      }}
    >
      <GenreSelector selectGenre={props.selectGenre} />
      <Typography component="h3" variant="h5" m={2}>
        Rounds
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <RemoveIcon fontSize="large" onClick={handleOnSubtract} />
        <Typography component="h3" variant="h5" m={2}>
          {rounds}
        </Typography>
        <AddIcon fontSize="large" onClick={handleOnAdd} />
      </Box>
      <Typography>Share the room code to invite people to join</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: 2,
        }}
      >
        <TextField id="room-id" label={props.roomId} size="small" disabled />
        <Button sx={{ marginLeft: 1 }} variant="contained" size="large" onClick={handleCopyClick}>
          Copy
        </Button>
      </Box>
      {copied && (
        <Alert severity="success">
          <AlertTitle>Link Copied</AlertTitle>
        </Alert>
      )}
      <Button variant="contained" size="large" onClick={props.startGame}>
        Start Game
      </Button>
    </Box>
  );
};
