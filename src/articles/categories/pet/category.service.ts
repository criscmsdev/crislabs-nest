import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateArticle,
  UpdateArticle,
  UpdateLikesArticle,
} from 'src/common/dto/article.input';
import { UpdateImage } from 'src/common/dto/site.input';
import { PetArticle } from 'src/common/entities/article.model';
import { ArticleDocument } from 'src/common/entities/article.schema';
import {
  articleCreated,
  articleDisLikesUpdated,
  articleImageUpdated,
  articleLikesUpdated,
  articleUpdated,
} from 'src/common/functions/article';
import { ListInput } from 'src/common/pagination/dto/list.input';

@Injectable()
export class PetArticleService {
  constructor(
    @InjectModel(PetArticle.name, 'petDB')
    private articleModel: Model<ArticleDocument>,
  ) {}

  async create(input: CreateArticle) {
    const data = new this.articleModel(articleCreated(input));
    return (await data.save()).toJSON();
  }

  async update(input: UpdateArticle) {
    const data = await this.articleModel.findOneAndUpdate(
      { _id: input.id },
      articleUpdated(input),
      { lean: true, new: true },
    );
    return data;
  }

  async updateLikes(input: UpdateLikesArticle) {
    const data = await this.articleModel.findOneAndUpdate(
      { _id: input.id },
      articleLikesUpdated(input),
      { lean: true, new: true },
    );
    return data;
  }
  async updateDisLikes(input: UpdateLikesArticle) {
    const data = await this.articleModel.findOneAndUpdate(
      { _id: input.id },
      articleDisLikesUpdated(input),
      { lean: true, new: true },
    );
    return data;
  }

  async updateImage(input: UpdateImage) {
    const data = await this.articleModel.findOneAndUpdate(
      { _id: input.id },
      articleImageUpdated(input),
      { lean: true, new: true },
    );
    return data;
  }

  async deleteOne(id: string) {
    await this.articleModel.deleteOne({ _id: id });
    return id;
  }

  async deleteMany(ids: string[]) {
    await this.articleModel.deleteMany({ _id: { $in: ids } });
    return ids;
  }

  async deleteManyBySiteId(ids: string[]) {
    await this.articleModel.deleteMany({ siteId: { $in: ids } });
    return 'articles delete';
  }

  async deleteAll() {
    await this.articleModel.deleteMany();
    return 'articles delete';
  }

  findAll() {
    const data = this.articleModel.find({});
    return data;
  }

  findBySiteId(siteId: string) {
    const data = this.articleModel.find({ siteId: siteId });
    return data;
  }

  findByParentId(parentId: string) {
    const data = this.articleModel.find({ parentId: parentId });
    return data;
  }
  findByUserId(userId: string) {
    const data = this.articleModel.find({ 'dataUser.author': userId });
    return data;
  }

  async findOne(id: string) {
    const document = await this.articleModel.findOne({ _id: id });
    if (!document) throw new NotFoundException('Document not found.');
    return document;
  }

  async findOneBySlug(slug: string, siteId: string) {
    const document = await this.articleModel.findOne({
      slug: slug,
      siteId: siteId,
    });
    if (!document) throw new NotFoundException('Document not found.');

    return document;
  }

  async findByCursor(paginationQuery: ListInput, parentId: string) {
    const { limit, offset } = paginationQuery;
    const count = await this.articleModel.count({ parentId: parentId });
    const data = await this.articleModel
      .find({ parentId: parentId }, {}, { lean: true })
      .sort({ 'dataArticle.updateDate.lastUpdatedAt': -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return { data, count };
  }
}