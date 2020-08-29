import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cities from './data/cities.js'
import visas from './data/visaTypes.js'
import validator from 'express-validator'
import axios from 'axios'
import { getUserId } from './helpers.js'

dotenv.config()

const { body, validationResult } = validator

const port = process.env.PORT || 8000
const baseURL = process.env.CAMUNDA_BASE_URL

const app = express()
app.use(cors())
app.use(express.json())

// GET /api/cities
app.get('/api/cities', (req, res) => {
	res.status(200).json(cities)
})

// GET /api/cities/:id
app.get('/api/cities/:id', (req, res) => {
	const foundCity = cities.filter((city) => city._id === req.params.id)[0]

	if (!foundCity) {
		res.status(404).json({
			message: 'No city with the given id was found :/',
		})
	}

	res.status(200).json(foundCity)
})

// GET /api/visas
app.get('/api/visas', (req, res) => {
	res.status(200).json(visas)
})

// GET /api/visas/:id
app.get('/api/visas/:id', (req, res) => {
	const foundVisa = visas.filter((visa) => visa._id === req.params.id)[0]

	if (!foundVisa) {
		res.status(404).json({
			message: 'No visa type with the given id was found :/',
		})
	}

	res.status(200).json(foundVisa)
})

// POST /api/signup
app.post(
	'/api/signup',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('firstName')
			.isLength({ max: 15 })
			.withMessage('Must be between 5-15 characters'),
		body('lastName')
			.isLength({ max: 15 })
			.withMessage('Must be between 5-15 characters'),
		body('password')
			.isLength({ min: 8 })
			.withMessage('Passsword must be atleast 8 characters long'),
		body('city').exists().withMessage('Required Field!'),
		body('visa').exists().withMessage('Required Field!'),
	],
	async (req, res) => {
		const result = validationResult(req)

		const { city, visa, email, firstName, lastName, password } = req.body
		const userId = getUserId(email)

		if (!result.isEmpty()) res.status(400).send(result)

		// TODO: Make API calls to Camunda here

		const variableRequest = {
			variables: {
				city: {
					value: city,
					type: 'String',
				},
				visa: {
					value: visa,
					type: 'String',
				},
			},
		}

		const userRequest = {
			profile: {
				id: userId,
				email,
				firstName,
				lastName,
			},
			credentials: { password },
		}

		try {
			// Start new Prcoess
			const processResponse = await axios.post(
				baseURL +
					'/process-definition/key/TwoPageForm/tenant-id/TwoFormDiagram/start',
				variableRequest
			)

			var processInstanceId = processResponse.data.id

			// Create a new User
			await axios.post(baseURL + '/user/create', userRequest)

			// Fetch the latest pending task from the new process
			const taskResponse = await axios.get(
				baseURL + `/task?processInstanceId=${processInstanceId}`
			)

			var taskId = taskResponse.data[0].id

			// Assign the task to the user (auditing reasons)
			await axios.post(baseURL + `/task/${taskId}/assignee`, {
				userId,
			})

			// Mark the first task as complete
			await axios.post(baseURL + `/task/${taskId}/complete`, {})

			// Fetch the next task
			const newProcessResponse = await axios.get(
				baseURL + `/task?processInstanceId=${processInstanceId}`
			)

			var newTaskId = newProcessResponse.data[0].id

			// Assign it tp the user
			await axios.post(baseURL + `/task/${newTaskId}/assignee`, {
				userId,
			})
		} catch (error) {
			res.status(500).json(error)
		}

		// Returns the users ID, the process Instance ID and the new task's ID
		res.status(200).json({ userId, processInstanceId, newTaskId })
	}
)

// POST /api/login
app.post(
	'/api/login',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password')
			.isLength({ min: 8 })
			.withMessage('Passsword must be atleast 8 characters long'),
	],
	async (req, res) => {
		const result = validationResult(req)

		if (!result.isEmpty()) res.status(400).send(result)

		const { email, password } = req.body

		const userId = getUserId(email)

		// TODO: Make API calls to Camunda here
		try {
			// Verify users credentials
			const verifyResponse = await axios.post(baseURL + '/identity/verify', {
				username: userId,
				password,
			})

			// Send a 400 response if user is not authenticated 😤
			if (!verifyResponse.data.authenticated)
				res.status(400).json({ message: 'User not authenticated' })

			// Look for tasks assigned to user
			const taskResponse = await axios.get(baseURL + `/task?assignee=${userId}`)

			// Return empty response if no tasks are pending
			if (!taskResponse.data || !taskResponse.data.length)
				res.status(200).json({ email })

			const { id: taskId, taskDefinitionKey } = taskResponse.data[0]

			// return the latest pending task id and definition key
			res.status(200).json({ email, taskId, taskDefinitionKey })
		} catch (error) {
			res.status(500).json(error)
		}
	}
)

// POST /api/profile
app.post(
	'/api/profile',
	[body('email').isEmail().withMessage('Invalid email')],
	async (req, res) => {
		const result = validationResult(req)

		if (!result.isEmpty()) res.status(400).send(result)

		const userId = getUserId(req.body.email)

		try {
			var [taskResponse, userResponse] = await Promise.all([
				await axios.get(baseURL + `/task?assignee=${userId}`),
				await axios.get(baseURL + `/user/${userId}/profile`),
			])

			if (!taskResponse.data[0])
				res.status(404).json({ message: 'This user has no pending tasks' })

			const { id: taskId } = taskResponse.data[0]

			// res.send(baseURL + `/task/${taskId}/variables`)
			var variablesResponse = await axios.get(
				baseURL + `/task/${taskId}/variables`
			)
		} catch (error) {
			console.log({ error })
			res.status(500).json(error)
		}
		const city = variablesResponse.data.city.value
		const visa = variablesResponse.data.visa.value

		const { value: uploadedEid } = variablesResponse.data.eidUploaded || {
			value: false,
		}
		const { value: uploadedPassport } = variablesResponse.data
			.passportUploaded || { value: false }

		const { email, firstName, lastName } = userResponse.data

		res.status(200).json({
			email,
			firstName,
			lastName,
			city,
			visa,
			uploadedEid,
			uploadedPassport,
		})
	}
)

// POST /api/upload
app.post(
	'/api/upload',
	[body('email').isEmail().withMessage('Invalid email')],
	async (req, res) => {
		const result = validationResult(req)

		if (!result.isEmpty()) res.status(400).send(result)

		const variableRequest = {
			variables: {
				eidUploaded: {
					value: true,
				},
				passportUploaded: {
					value: true,
				},
			},
		}

		const userId = getUserId(req.body.email)

		try {
			const taskResponse = await axios.get(baseURL + `/task?assignee=${userId}`)

			const {
				id: taskId,
				taskDefinitionKey,
				processInstanceId,
			} = taskResponse.data[0]

			if (taskDefinitionKey !== 'UploadFiles')
				res.status(400).json({
					error:
						"User can't Upload Files if the current task isn't 'Upload Files'",
				})

			await axios.post(baseURL + `/task/${taskId}/complete`, variableRequest)

			// Fetch the next task
			const newProcessResponse = await axios.get(
				baseURL + `/task?processInstanceId=${processInstanceId}`
			)

			var newTaskId = newProcessResponse.data[0].id

			// Assign it to the user
			await axios.post(baseURL + `/task/${newTaskId}/assignee`, {
				userId,
			})

			res.status(200).end()
		} catch (error) {
			console.log(error)
			res.status(500).json(error)
		}

		const city = variablesResponse.data.city.value
		const visa = variablesResponse.data.visa.value

		const { email, firstName, lastName } = userResponse.data

		res.status(200).json({ email, firstName, lastName, city, visa })
	}
)

app.listen(port, () => {
	console.log(`[server]: App listening on PORT:${port} ✅`)
})
