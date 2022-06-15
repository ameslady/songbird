import React, { useState, useEffect } from "react";
import { IPlayGameProps } from "../../Interfaces";
import { Box, Slider, Stack, Typography, LinearProgress } from "@mui/material";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeDown from "@mui/icons-material/VolumeDown";

export const PlayGame = (props: IPlayGameProps) => {
  const [blur, setBlur] = useState<number>(20);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number | string | Array<number | string>>(
    30,
  );

  // reveals album art 
  useEffect(() => {
    blur > 0 && setTimeout(() => setBlur(blur - 0.25), 430);
  }, [blur]);

  // updates progress bar 
  useEffect(() => {
    progress < 100 && setTimeout(() => setProgress(progress + 1), 290);
  }, [progress]);

  useEffect(() => {
    props.audio.src = props.track.preview_url;
    props.audio.volume = 0.30; // default volume 
    props.audio.play();
    props.audio.onended = () => {
      props.endOfRound();
    };
  }, []);

  // volume adjustments
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue);
    const volumeConversion = Number(newValue) / 100;

    if (volumeConversion === 0.00) {
      props.audio.volume = 0;
    }
    
    props.audio.volume = volumeConversion;
  };

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
      <Typography variant="h4" component="h4">
        GUESS THE SONG - ROUND 1
      </Typography>

      <Box
        component="img"
        sx={{
          height: 300,
          width: 300,
          border: 3,
          borderRadius: 2,
          filter: `blur(${blur}px)`,
        }}
        alt="The house from the offer."
        src={props.track.album.images[0].url}
      />

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 20, width: "45vh" }}
      />

      <Stack spacing={2} direction="row">
        <VolumeDown />
        <Slider
          aria-label="Volume"
          valueLabelDisplay="auto"
          value={typeof volume === "number" ? volume : 0}
          onChange={handleVolumeChange}
          sx={{ width: "20vh" }}
        />
        <VolumeUp />
      </Stack>
    </Box>
  );
};
