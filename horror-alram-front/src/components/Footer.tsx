import Box from '@mui/material/Box';



export default function Footer() {
    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: '#2F4F4F',
            textAlign: 'center',
            color: 'white',
            padding: 1,
        }}>
            © 2024 by 스푸키.
        </Box>
    );
}
