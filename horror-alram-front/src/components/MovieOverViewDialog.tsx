import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export default function MovieOverViewDialog({ open, selectedMovie, handleClose }) {
      return (
     <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedMovie?.title}</DialogTitle>
        <DialogContent>
          {selectedMovie?.overview}
        </DialogContent>
     </Dialog>
      );
    }