import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import jiraQueryService from '../../services/jiraQueryService';
import { useSnackbar } from 'notistack';

export default function JQLModal({ open, onClose, jql, teamId, onSave }) {
    const [formData, setFormData] = useState({
        teamId: teamId || '',
        jqlKey: '',
        jql: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (jql) {
            setFormData({
                teamId: jql.teamId || teamId || '',
                jqlKey: jql.jqlKey || '',
                jql: jql.jql || '',
                description: jql.description || '',
            });
        } else {
            setFormData({
                teamId: teamId || '',
                jqlKey: '',
                jql: '',
                description: '',
            });
        }
    }, [jql, open, teamId]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleEditorChange = (value) => {
        setFormData({ ...formData, jql: value || '' });
    };

    const handleSubmit = async () => {
        if (!formData.jqlKey || !formData.jql || !formData.description) {
            enqueueSnackbar('All fields are required', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let response;
            if (jql) {
                response = await jiraQueryService.updateJQL(jql._id, formData);
            } else {
                response = await jiraQueryService.createJQL(formData);
            }

            // Backend returns { success: true, data: {...} }
            // Service already returns response.data, so we get { success, data, message }
            onSave(response.data);
            enqueueSnackbar(
                response.message || `JQL ${jql ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            console.error('JQL save error:', error);
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${jql ? 'update' : 'create'} JQL`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{jql ? 'Edit JQL Query' : 'Add JQL Query'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="JQL Key"
                    value={formData.jqlKey}
                    onChange={(e) => handleChange('jqlKey', e.target.value)}
                    margin="normal"
                    required
                    helperText="Unique identifier for this JQL query within the team"
                    disabled={!!jql}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    margin="normal"
                    required
                    multiline
                    rows={2}
                    helperText="Brief description of what this JQL query does"
                />
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        JQL Query *
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <Editor
                            height="300px"
                            defaultLanguage="sql"
                            value={formData.jql}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                tabSize: 2,
                            }}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Enter your Jira Query Language (JQL) query
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}