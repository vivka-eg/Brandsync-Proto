import { populate } from "@/strapi/populate";
import { strapi } from "@strapi/client";

class StrapiServerHandler {
  constructor() {
    this.client = strapi({
      baseURL: process.env.NEXT_PUBLIC_INTERNAL_API_URL,
      auth: process.env.STRAPI_API_TOKEN,
    });
  }

  async findOne(collection, id) {
    try {
      const response = await this.client.collection(collection).findOne(id, {
        populate: populate[collection].findOne,
      });
      return response.data;
    } catch (error) {
      return this.formatError(error);
    }
  }

  async find(
    collection,
    { filters = {}, page = 1, pageSize = 40, customPopulate, sort } = {}
  ) {
    try {
      const query = {
        populate: customPopulate ?? populate[collection].find,
        pagination: { page, pageSize },
        filters,
      };
      if (sort) query.sort = sort;
      return await this.client.collection(collection).find(query);
    } catch (error) {
      return { data: null, ...this.formatError(error) };
    }
  }

  async getSingleType(type) {
    try {
      const response = await this.client.single(type).find({
        populate: populate.singleType[type],
      });
      return response.data;
    } catch (error) {
      return this.formatError(error);
    }
  }

  async findOneBySpecificKeyMatch(collection, key, value) {
    try {
      const response = await this.client.collection(collection).find({
        filters: { [key]: { $eq: value } },
        populate: populate[collection].findOne,
      });
      return response.data?.[0];
    } catch (error) {
      return this.formatError(error);
    }
  }

  formatError(error) {
    console.error("[StrapiServerHandler]", error);
    return { error: error.message || "Failed to fetch" };
  }
}

export const strapiServer = new StrapiServerHandler();
