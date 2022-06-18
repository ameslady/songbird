import React from "react";
import { IEndOfRoundProps, IUser } from "../../Interfaces";

// material UI
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

export const EndOfRound = (props: IEndOfRoundProps) => {
  const sortedUsers = props.users.sort(
    (a: IUser, b: IUser): number => b.roundScore - a.roundScore
  );

  // displays per round scoreboard
  const users = sortedUsers.map((user, i) => {
    const bgc = i === 0 && user.roundScore !== 0 ? "#3EA4B4" : "#F4F4FF";
    const tc = i === 0 && user.roundScore !== 0 ? "white" : "green";
    return (
      <Box
        sx={{
          backgroundColor: bgc,
          width: "35vw",
          borderRadius: 2,
          margin: 2,
        }}
        key={i}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={user.avatar}
              sx={{ padding: 1, width: 50, height: 50 }}
            />
          </ListItemAvatar>
          {i === 0 && user.roundScore !== 0 ? (
            <ListItemText
              sx={{ padding: 1, width: "10vw" }}
              primary={
                <Typography variant="h6" style={{ color: tc }}>
                  {user.username}
                </Typography>
              }
            />
          ) : (
            <ListItemText
              sx={{ padding: 1, width: "10vw", color: "black" }}
              primary={user.username}
            />
          )}

          <ListItemText
            sx={{ padding: 1 }}
            primary={
              <Typography variant="h6" style={{ color: tc }}>
                Score: + {user.roundScore}
              </Typography>
            }
          />
        </ListItem>
      </Box>
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "93vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            marginRight: 4,
            height: 200,
            width: 200,
            border: 3,
            borderRadius: 2,
          }}
          src={props.track.album.images[0].url}
        />

        <ListItemText
          sx={{ fontSize: 20, padding: 2 }}
          primary={"The song title was:"}
          secondary={props.track.name}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {users}
      </Box>
    </Box>
  );
};
