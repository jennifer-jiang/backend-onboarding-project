import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';

export const createItem = async (conn: Connection, name: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = "TODO: FILL THIS OUT";
  item.price = price;
  const createdItem = await conn.manager.save(item); // goes to the database, run a sql query and insert an item, then return the created item
  return createdItem.uuid;
};

export const deleteItem = (name: string) => {
  // if (name in db) {
  //   delete db[name];
  // } else {
  //   throw new Error("item not found!")
  // }
}

/**
 * line1
 * await line2 -> db call
 * line3
 * line4
 */