import { Box, Button, colors, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { LanguageVersion } from '../CodingConstant';

const languages = Object.entries(LanguageVersion);

const LanguageSelector = ({ language, onSelect }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box mb={1} ml={2} >
            <div style={{display: "flex", gap: "7px"}}>
                <Typography mb={1} color='White' fontSize="large">
                <b>Language:</b>
            </Typography>
            <Button
                variant="contained"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ color: "white", bgcolor: "gray", paddingTop: "1px", paddingBottom: "1px"}}
            >
                {language}
            </Button>
            </div>

            <Menu
                bg="#110c1b"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 220,
                        bgcolor: "#3a3838",
                        color: "white",
                        borderRadius: 2,
                        overflow: "visible"   // 🔥 CUT FIX
                    }
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {languages.map(([lang, version]) => (
                    <MenuItem key={lang}
                        sx={{
                            display: "flex",
                            bgcolor: lang === language ? "#4b5563" : "transparent",
                            color: lang === language ? "#60a5fa" : "white",
                            "&:hover": {
                                bgcolor: "#374151",
                            },
                        }}
                        onClick={() => { onSelect(lang); handleClose(); }}
                    >
                        <Typography fontSize="16px">
                            {lang}
                        </Typography>
                        <Typography ml={1} fontSize="12px" color="gray">
                            ({version})
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default LanguageSelector;
