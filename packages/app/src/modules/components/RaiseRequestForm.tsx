import React from 'react';
import { TextField, Button, Stack, Box, Typography, Paper, Divider } from '@mui/material';

export type NewRequestInput = { title: string; prLink: string; description: string };
const emptyForm: NewRequestInput = { title: '', prLink: '', description: '' };

// explicit colors so contrast doesn't depend on theme tokens that may be identical
const fieldSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: 1.5 },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d6dae0' },
  '& .MuiInputLabel-root': { color: '#5b6470' },
};

export const RaiseRequestForm = ({
  apiName, requestedBy, onSubmit, onCancel,
}: {
  apiName: string;
  requestedBy: string;
  onSubmit: (input: NewRequestInput) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = React.useState<NewRequestInput>(emptyForm);

  const update =
    (field: keyof NewRequestInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: event.target.value }));

  const titleEmpty = form.title.trim() === '';
  const prInvalid = !/^https?:\/\//.test(form.prLink.trim());
  const isValid = !titleEmpty && !prInvalid;
  const titleShowError = form.title !== '' && titleEmpty;
  const prShowError = form.prLink !== '' && prInvalid;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3.5, borderRadius: 2, maxWidth: 640, bgcolor: '#f5f6f8', border: '1px solid #e3e6ea' }}
    >
      <Typography variant="h6" sx={{ color: '#1a1f27' }}>Raise production request</Typography>
      <Typography variant="body2" sx={{ color: '#5b6470' }}>
        For <strong>{apiName}</strong> · submitting as <strong>{requestedBy}</strong>
      </Typography>

      <Divider sx={{ my: 2.5 }} />

      <Stack spacing={2.5}>
        <TextField label="Title" required value={form.title} onChange={update('title')}
          error={titleShowError}
          helperText={titleShowError ? 'Title is required' : "Short summary of what you're shipping"}
          fullWidth sx={fieldSx} />
        <TextField label="PR link" required value={form.prLink} onChange={update('prLink')}
          error={prShowError}
          helperText={prShowError ? 'Must start with http(s)://' : 'Link to the approved pull request'}
          fullWidth sx={fieldSx} />
        <TextField label="Description" value={form.description} onChange={update('description')}
          helperText="Optional context for approvers"
          multiline minRows={3} fullWidth sx={fieldSx} />
      </Stack>

      <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
        <Button variant="text" sx={{ color: '#5b6470' }} onClick={onCancel}>Cancel</Button>
        <Button variant="contained" disableElevation disabled={!isValid} onClick={() => onSubmit(form)}>
          Submit request
        </Button>
      </Box>
    </Paper>
  );
};