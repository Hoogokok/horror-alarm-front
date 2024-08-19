import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { MovieResponse } from '../type/movie';

interface MovieOverViewDialogProps {
  open: boolean;
  selectedMovie: MovieResponse;
  handleClose: () => void;
}

export default function MovieOverViewDialog({ open, selectedMovie, handleClose }: MovieOverViewDialogProps): JSX.Element {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{selectedMovie?.title}</DialogTitle>
      <DialogContent>
        {selectedMovie?.overview}
      </DialogContent>
    </Dialog>
  );
}