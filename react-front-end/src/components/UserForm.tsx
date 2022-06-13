import React, { useState } from 'react';
import { IUserFormProps } from '../interfaces/UserFormInterfaces';
import { Container, CssBaseline, Box, Avatar, Typography, TextField, Button } from '@mui/material';
import bird from '../assets/bird_1.png'

const UserForm = (props: IUserFormProps) => {  
  const[user, setUser] = useState({
    username: "",
    roomId: "",
    score: 0
  });


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (user.username === '') {
      return;
    }
    props.createSocket(user);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar src={bird} sx={{ width:100, height:100 }} />
        <Typography component="h1" variant="h5">
          Songbird
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={e => setUser({...user, username: e.target.value})}
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            name="room-id"
            label="Enter Room ID (Optional)"
            type="room-id"
            id="room-id"
            autoComplete="room-id"
            onChange={e => setUser({...user, roomId: e.target.value})}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Start Game
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UserForm