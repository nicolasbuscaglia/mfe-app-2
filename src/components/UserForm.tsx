import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Controller, useForm } from "react-hook-form";
import { Emitter } from "nanoevents";

interface UserInterface {
  name?: string;
  surname?: string;
  email?: string;
}

interface EventEmitterInterface {
  emitter?: Emitter;
}

const UserForm = ({ emitter }: EventEmitterInterface) => {
  const [user, setUser] = useState<UserInterface>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unbindUpdateUser = emitter?.on(
      "updateUser",
      (user: UserInterface) => {
        setUser(user);
      }
    );
    const unbindLoggedIn = emitter?.on("userLoggedIn", (value: boolean) => {
      setIsLoggedIn(value);
    });
    return () => {
      unbindUpdateUser && unbindUpdateUser();
      unbindLoggedIn && unbindLoggedIn();
    };
  }, [emitter]);

  const { handleSubmit, control } = useForm({
    values: {
      name: user?.name || "",
      surname: user?.surname || "",
      email: user?.email || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setUser((prevState) => ({
        ...prevState,
        ...data,
      }));
      const payload = {
        ...user,
        ...data,
      };
      emitter?.emit("saveUser", payload);
    } catch (err) {
      console.error(err);
    }
  });

  const handleLogoutClick = () => {
    emitter?.emit("saveUser", {});
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed grey" }}>
      <Typography variant="h6" gutterBottom>
        Microfrontend 2
      </Typography>
      <form onSubmit={onSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="user-name"
                    label="Name"
                    InputLabelProps={{ shrink: true }}
                    disabled={isLoggedIn}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="surname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="user-surname"
                    label="Surname"
                    InputLabelProps={{ shrink: true }}
                    disabled={isLoggedIn}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="user-email"
                    label="Email"
                    InputLabelProps={{ shrink: true }}
                    disabled={isLoggedIn}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              endIcon={<LoginIcon />}
              type="submit"
              sx={{ minWidth: "8rem" }}
              disabled={isLoggedIn}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              endIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{ minWidth: "8rem" }}
              disabled={!isLoggedIn}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;
