import React from "react";
import {Toolbar, Typography, Box, AppBar, List, ListItem,TextField, Button, IconButton, Grid} from "@mui/material";
import variables from "../assets/App.scss";

function Footer() {
    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor:variables.mainColor }}>
                <Grid container spacing={2} sx={{p: 2}}>
                    <Grid item xs={6}>
                        <List>
                            <ListItem><Typography>Privacy Policy</Typography></ListItem>
                            <ListItem><Typography>Terms</Typography></ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={6}>
                        <List>
                            <ListItem><Typography>About Todo</Typography></ListItem>
                            <ListItem><Typography>Wish it's good!</Typography></ListItem>
                        </List>
                    </Grid>
                </Grid>
            </AppBar>
        </Box>

    )
}

export default Footer;