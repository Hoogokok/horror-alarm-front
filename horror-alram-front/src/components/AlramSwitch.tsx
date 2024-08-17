import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

const LabelText = styled('span')({
    color: 'white', // 원하는 색깔로 변경
    textAlign: 'center',
});

export default function AlramSwitch({ checked, handleSwitch, message }) {
    return (<FormControlLabel control={<Switch
        checked={checked}
        onChange={handleSwitch}
        inputProps={{ 'aria-label': 'controlled' }}
    />} label={checked ? <LabelText>{message.onMessage}</LabelText> :
        <LabelText>{message.offMessage}</LabelText>}
    />)
}