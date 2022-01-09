import Express, { Request, Response } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { createItem } from './service';

const app = Express();
const port = 3000;

app.use(bodyParser.json()); // regular json payloads
app.use(bodyParser.urlencoded({ extended: true })); // html form payloads

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// app.use("/admin", (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     if (authorizedUsers.includes(bearerToken)) {
//       return next();
//     }
//   }
//   return res.status(401).send("Unauthorized");
// });

// handle all POST requests that match '/'
app.post('/item', (req: Request, res: Response) => {
	if (!('name' in req.body) || !('price' in req.body)) {
		res.status(400).send('Missing required variables!');
	}
	const name = req.body.name as string;
	const price = Number(req.body.price);
	if (name.length < 0 || name.length > 26 || isNaN(price)) {
		return res.status(400).send('Invalid argument shape!');
	}
	const uuid = createItem(name, price);
	return res.send({
		uuid
	});
});

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});