import { Router, Request, Response } from "express";
import path from "path";
import { createItem, createOrder, createUser, deleteItem, getItem, getItems, getOrderInfo, getUserInfo, getUserOrder, getUsers, loginUser } from "./service";

export const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// router.use("/admin", (req, res, next) => {
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

router.get('/items', async (req: Request, res: Response) => {
  const items = await getItems(req.dbConnection);
  return res.json(items);
})

// handle all POST requests that match '/'
router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body)) {
    res.status(400).json({ message: "Missing required variables!" });
  }
  const name = req.body.name as string;
  const price = Number(req.body.price);
  const description = req.body.description as string;
  if (name.length < 0 || name.length > 26 || isNaN(price)) {
    return res.status(400).json({ message: "Invalid argument shape!" });
  }
  const uuid = await createItem(req.dbConnection, name, description, price);
  return res.send({
    uuid
  });
});

router.delete('/items/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;
  const status = await deleteItem(req.dbConnection, uuid);
  if (status == 200) {
    res.status(200).json({ error: false, message: "Item deleted!" });
  } else {
    res.status(400).json({ error: true, message: "Item does not exist in database." });
  }
})

router.post('/order', async (req: Request, res: Response) => {
  if (!('itemId' in req.body) || !('userId' in req.body)) {
    res.status(400).json({ message: "Missing required variables!" });
  }
  const itemId = req.body.itemId;
  const userId = req.body.userId;
  const createdOrder = await createOrder(req.dbConnection, itemId, userId);
  //console.log({ item: { uuid: itemId }, user: { uuid: userId }, uuid: createdOrder.uuid, createdAt: createdOrder.createdAt });
  return res.json({ item: { uuid: itemId }, user: { uuid: userId }, uuid: createdOrder.uuid, createdAt: createdOrder.createdAt });
})

router.get('/orders', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const orderInfo = await getUserOrder(req.dbConnection, userId);
  return res.json(orderInfo);
})

router.get('/orders/:uuid', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const orderInfo = await getOrderInfo(req.dbConnection, userId);
  return res.json(orderInfo);
})

router.post('/user', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)) {
    res.status(400).json({ message: "'Missing required variables!" });
  }
  const username = req.body.username as string;
  const password = req.body.password as string;
  const uuid = await createUser(req.dbConnection, username, password);
  if (uuid == 404) {
    res.status(400).json({ message: "Username already exists." });
  } else {
    return res.json(uuid);
  }
})

router.post('/login', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)) {
    return res.status(400).json({ message: "Missing required variables!" });
  }
  const username = req.body.username as string;
  const password = req.body.password as string;
  const user = await loginUser(req.dbConnection, username, password);
  if (user == 404) {
    return res.status(400).json({ message: "Login failed" });
  } else {
    return res.json(user);
  }
})

router.get('/users', async (req: Request, res: Response) => {
  const users = await getUsers(req.dbConnection);
  return res.json(users);
})

router.get('/user/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;
  const userInfo = await getUserInfo(req.dbConnection, uuid);
  if (userInfo == 404) {
    res.status(400).json({ message: "User with uuid does not exist." });
  } else {
    return res.json(userInfo);
  }
})