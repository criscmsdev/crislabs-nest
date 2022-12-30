import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import ConnectionArgs, {
  getPagingParameters,
} from 'src/common/pagination/relay/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import {
  DataPage,
  ListPetPage1,
  PetPage1,
} from 'src/common/entities/page.model';
import { PetPage1Service } from '../services/page1.service';
import { CreatePage, UpdatePage } from 'src/common/dto/page.input';
import { UpdateImage } from 'src/common/dto/site.input';
import { PetProduct } from 'src/common/entities/product.model';
import { Type } from 'src/common/entities/site.model';
import { PetProductService } from 'src/products/categories/pet/pet-product/category.service';

@Resolver(() => PetPage1)
export class PetPage1Resolver {
  constructor(
    private readonly page1Service: PetPage1Service,
    private readonly productService: PetProductService,
  ) {}

  @Mutation(() => PetPage1, { name: 'petCreatePage1' })
  createPage(@Args('input') input: CreatePage) {
    return this.page1Service.create(input);
  }

  @Mutation(() => PetPage1, { name: 'petUpdatePage1' })
  updatePage(
    @Args('input') input: UpdatePage,
    // @Args('type') type: string,
  ) {
    return this.page1Service.update(input);
  }

  @Mutation(() => PetPage1, { name: 'petUpdateImagePage1' })
  updateImage(@Args('input') input: UpdateImage) {
    return this.page1Service.updateImage(input);
  }

  @Mutation(() => String, { name: 'petDeletePage1' })
  deletePage(@Args('id') id: string) {
    return this.page1Service.deleteOne(id);
  }

  @Mutation(() => [String], { name: 'petDeletePages1' })
  deletePagesById(@Args('ids', { type: () => [String] }) ids: string[]) {
    return this.page1Service.deleteMany(ids);
  }

  @Mutation(() => String, { name: 'petDeleteAllPages1' })
  deleteAllPages() {
    return this.page1Service.deleteAll();
  }

  @Query(() => PetPage1, { name: 'petGetPage1' })
  findPage(@Args('id') id: string) {
    return this.page1Service.findOne(id);
  }

  @Query(() => PetPage1, { name: 'petGetPage1BySlug' })
  findPageBySlug(@Args('slug') slug: string, @Args('siteId') siteId: string) {
    return this.page1Service.findOneBySlug(slug, siteId);
  }

  @Query(() => [PetPage1], { name: 'petGetPages1' })
  findPages() {
    return this.page1Service.findAll();
  }

  @Query(() => [PetPage1], { name: 'petGetPages1ByParentId' })
  findPagesByParentId(
    @Args('parentId') parentId: string,
    // @Args('type') type: string,
  ) {
    return this.page1Service.findByParentId(parentId);
  }

  @Query(() => ListPetPage1, { name: 'petGetPages1WithCursor' })
  async findAllWithCursor(
    @Args('args') args: ConnectionArgs,
    @Args('parentId') parentId: string,
  ): Promise<ListPetPage1> {
    const { limit, offset } = getPagingParameters(args);
    const { data, count } = await this.page1Service.findByCursor(
      {
        limit,
        offset,
      },
      parentId,
    );
    const page = connectionFromArraySlice(data, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @ResolveField('products', () => [PetProduct], { nullable: 'itemsAndList' })
  getProduct(@Parent() { _id, dataPage }: PetPage1) {
    const { type } = dataPage as DataPage;
    const { slug } = type as Type;
    if (slug === 'pet') {
      return this.productService.findByParentId(_id.toString());
    } else {
      return null;
    }
  }
}
