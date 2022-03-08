import { create } from 'domain';
import { connect } from 'http2';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';
import { Order } from './models/Order';
import { User } from './models/user';

export const getItems = async (conn: Connection) => {
  const items = conn.manager.find<Item>(Item);
  return items;
}

export const createItem = async (conn: Connection, name: string, description: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = description;
  item.price = price;
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const deleteItem = async (conn: Connection, uuid: string) => {
  const itemToDelete = await conn.manager.findOne<Item>(Item, {
    where: {
      uuid: uuid
    }
  });
  if (!itemToDelete) {
    return 404;
  }
  await conn.manager.delete(Item, {
    uuid: uuid
  });
  return 200;
}

export const createOrder = async (conn: Connection, itemId: string, userId: string) => {
  const order = new Order();
  order.item = Item.create({ uuid: itemId });
  order.user = User.create({ uuid: userId })
  order.createdAt = new Date();
  const createdOrder = await conn.manager.save(order);
  return ({
    uuid: createdOrder.uuid, createdAt: createdOrder.createdAt
  });
}

export const getUserOrder = async (conn: Connection, userId: string) => {
  const order = await conn.manager.find<Order>(Order, {
    where: {
      user: userId
    },
    loadEagerRelations: true,
    relations: ["item"],
  })
  return (order);
}

export const getItem = async (conn: Connection, itemId: string) => {
  const item = await conn.manager.findOne<Item>(Item, {
    where: {
      itemId: itemId
    }
  })
  return ({ uuid: item.uuid, name: item.name, description: item.description, price: item.price });
}

export const getOrderInfo = async (conn: Connection, userId: string) => {
  const order = await conn.manager.findOne<Order>(Order, {
    where: {
      userId: userId
    }
  })
  const item = await conn.manager.findOne<Item>(Item, {
    where: {
      uuid: order.item.uuid
    }
  })
  return ({
    orderId: order.uuid, createdAt: order.createdAt,
    itemName: item.name, itemPrice: item.price
  });
}

export const createUser = async (conn: Connection, name: string, password: string) => {
  const existingUser = await conn.manager.find<User>(User, {
    where: {
      name: name
    }
  })
  if (existingUser.length != 0) {
    return 404;
  }
  const user = new User();
  user.name = name;
  user.password = password;
  const createdUser = await conn.manager.save(user);
  return createdUser;
}

export const loginUser = async (conn: Connection, name: string, password: string) => {
  const user = await conn.manager.findOne<User>(User, {
    where: {
      name: name,
      password: password
    }
  })
  if (!user) {
    return 404;
  }
  return user;
}

export const getUsers = async (conn: Connection) => {
  const users = conn.manager.find<User>(User);
  return users;
}

export const getUserInfo = async (conn: Connection, uuid: string) => {
  const user = conn.manager.findOne<User>(User, {
    where: {
      uuid: uuid
    }
  })
  if (!user) {
    return 404;
  }
  const orders = conn.manager.find<Order>(Order, {
    where: {
      userId: (await user).uuid
    }
  })
  return ({
    uuid: (await user).uuid, name: (await user).name,
    orders: orders
  });
}