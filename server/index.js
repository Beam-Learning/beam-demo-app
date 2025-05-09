const express = require('express');
const axios = require('axios');
const cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(express.json());

const BASE_URL = "https://api.beamstudio.ai";

// Endpoints
const API_LOGIN_URL = `${BASE_URL}/auth/access-token`
const API_ME_URL = `${BASE_URL}/v2/user/me`
const API_AGENT_LIST_URL = `${BASE_URL}/agent`
const API_AGENT_TASKS_LIST_URL = `${BASE_URL}/agent-tasks`
const API_AGENT_TASKS_DETAILS_URL = `${BASE_URL}/agent-tasks`
const API_AGENT_TASKS_CREATE_URL = `${BASE_URL}/agent-tasks`
const API_AGENT_TASKS_RETRY_URL = `${BASE_URL}/agent-tasks/retry`
const API_AGENT_TASKS_RATING_URL = `${BASE_URL}/agent-tasks/execution`

app.post('/api/login', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const response = await axios.post(API_LOGIN_URL, { apiKey });
        res.json(response.data);
    } catch (err) {
        console.log({ err })
        res.status(400).json({ error: 'Invalid API Key' });
    }
});

app.get('/api/me', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const response = await axios.get(API_ME_URL, {
            headers: { Authorization: token }
        });
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch user data' });
    }
});

app.get('/api/agents', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];

        const response = await axios.get(API_AGENT_LIST_URL, {
            headers: { Authorization: token, "current-workspace-id": workspaceId },
            query: { pageSize: 100, pageNum: 1 }
        });
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch agents' });
    }
});

app.get('/api/agents/tasks', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];

        console.log("req.params", {
            headers: { Authorization: token, "current-workspace-id": workspaceId },
            params: { ...req.query, pageSize: 100, pageNum: 1, ordering: 'desc' }
        })

        const response = await axios.get(API_AGENT_TASKS_LIST_URL, {
            headers: { Authorization: token, "current-workspace-id": workspaceId },
            params: { ...req.query, pageSize: 100, pageNum: 1, ordering: 'desc' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch tasks' });
    }
});

app.get('/api/agents/tasks/:taskId', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];
        const { taskId } = req.params;

        const response = await axios.get(`${API_AGENT_TASKS_DETAILS_URL}/${taskId}`, {
            headers: { Authorization: token, "current-workspace-id": workspaceId },
            params: { taskId }
        });
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch task details' });
    }
});

app.post('/api/agents/tasks', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];

        let data = JSON.stringify(req.body);
        let config = {
            method: 'post',
            url: API_AGENT_TASKS_CREATE_URL,
            headers: {
                'accept': 'application/json',
                'current-workspace-id': workspaceId,
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config)
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

app.post('/api/agents/tasks/retry', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];

        let data = JSON.stringify(req.body);
        let config = {
            method: 'post',
            url: API_AGENT_TASKS_RETRY_URL,
            headers: {
                'accept': 'application/json',
                'current-workspace-id': workspaceId,
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config)
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to re-run task' });
    }
});

app.patch('/api/agents/tasks/rating/:taskId', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const workspaceId = req.headers['current-workspace-id'];
        const { taskId } = req.params;

        let data = JSON.stringify(req.body);
        let config = {
            method: 'patch',
            url: `${API_AGENT_TASKS_RATING_URL}/${taskId}/output-rating`,
            headers: {
                'accept': 'application/json',
                'current-workspace-id': workspaceId,
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config)
        res.json(response.data);
    } catch (err) {
        res.status(400).json({ error: 'Failed to rate task' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));